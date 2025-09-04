// user-details.page.ts
import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild, ɵNoopNgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { Role, User } from 'src/app/models/user.model';
import { RolesService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { IonModal, RadioGroupChangeEventDetail, SelectChangeEventDetail, ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {
  @ViewChild('roleModal') roleModal!: IonModal;
  user!: User;     // teremos a linha inteira aqui
  isEdit = false;  // true = editar, false = criar

  roles: Role[] = [];
  selectedRoleId: number | null = null;
  tempSelectedRoleId: number | null = null;
  roleModalOpen = false;               // <<< controla o modal
  rolesFiltered = this.roles;          // garanta que existe essa prop

  // (opcional) confirmação de senha separada
  confirmPassword = '';

  constructor(
    public util: UtilService,
    private router: Router,
    private roleService: RolesService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    // 1) tenta pelo state desta navegação ou histórico
    const nav = this.router.getCurrentNavigation();
    const fromState = (nav?.extras?.state as any)?.user ?? (history.state?.user as User | undefined);

    // 2) fallback: sessionStorage (sobrevive a F5)
    const fromStorage = !fromState
      ? (sessionStorage.getItem('user_edit') ? JSON.parse(sessionStorage.getItem('user_edit')!) as User : undefined)
      : undefined;

    const data = fromState ?? fromStorage;

    if (!data) {
      // sem dados: voltar
      this.util.onBack();
      return;
    }

    this.user = data;
    this.isEdit = true; // veio com dados => edição
    console.log("Usuário => ", this.user);
    // limpa pra não reaproveitar sem querer numa navegação diferente
    sessionStorage.removeItem('user_edit');

    // carrega os papéis e garante que o atual apareça selecionado
    this.loadRoles();
  }


  private loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (rs: Role[]) => {          // <<< tipado como array
        this.roles = rs;
        if (this.selectedRoleId == null && this.user?.role?.id != null) {
          this.selectedRoleId = this.user.role.id;
        }
        this.syncRoleOnUser(this.selectedRoleId);
      },
      error: (e: any) => console.error(e),
    });
  }

  // chamado no (ionChange) do select
  // Ionic 6/7: tipos dos eventos

  get selectedRoleName(): string {
    return (
      this.user?.role?.name ||
      this.roles.find(r => Number(r.id) === Number(this.selectedRoleId))?.name ||
      ''
    );
  }

  openRolePicker() {
    this.rolesFiltered = this.roles;
    this.tempSelectedRoleId = this.selectedRoleId ?? null;
    this.roleModalOpen = true;
  }

  confirmRolePicker(id?: number) {
    if (typeof id === 'number') this.tempSelectedRoleId = id;
    this.selectedRoleId = this.tempSelectedRoleId;
    this.syncRoleOnUser(this.selectedRoleId);
    this.roleModalOpen = false;
  }

  closeRolePicker(commit = false) {
    if (commit) {
      this.selectedRoleId = this.tempSelectedRoleId;
      this.syncRoleOnUser(this.selectedRoleId);
    }
    this.roleModalOpen = false;
  }

  onRoleRadioChange(ev: any) {
    const val = ev?.detail?.value;
    this.tempSelectedRoleId = val != null ? Number(val) : null;
  }

  private syncRoleOnUser(roleId: number | null) {
    this.user.role_id = roleId;
    this.user.role = roleId != null
      ? (this.roles.find(r => Number(r.id) === Number(roleId)) ?? null)
      : null;
  }


  // Exemplo de salvar (update) enviando role_id
  async save() {
    const payload: any = {
      name: this.user.name,
      email: this.user.email,
      role_id: this.user.role_id,
    };
    if (this.user.password) {
      payload.password = this.user.password;
      payload.password_confirmation = this.confirmPassword;
    }

    this.userService.updateUser(this.user.id, payload).subscribe({
      next: async (res) => {
        const msg = res?.message || 'Usuário atualizado com sucesso!';
        const t = await this.toastCtrl.create({
          message: msg,
          duration: 2000,
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle',
        });
        await t.present();
        // navega após o toast sumir (ou imediatamente, como preferir)
        t.onDidDismiss().then(() => this.util.onBack());
      },
      error: async (err: HttpErrorResponse) => {
        const msg = (err.error?.message as string) || 'Falha ao salvar usuário.';
        const t = await this.toastCtrl.create({
          message: msg,
          duration: 2500,
          color: 'danger',
          position: 'top',
          icon: 'alert-circle',
        });
        await t.present();
      },
    });
  }

  roleColor(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('admin')) return 'tertiary';
    if (n.includes('manager') || n.includes('gestor')) return 'warning';
    if (n.includes('viewer') || n.includes('user') || n.includes('cliente')) return 'medium';
    return 'primary';
  }

  onRoleSearch(ev: any) {
    const q = (ev?.target?.value || '').toString().toLowerCase().trim();
    this.rolesFiltered = !q
      ? this.roles
      : this.roles.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q)
      );
  }

  // se ainda usar o ion-select em outra variante:
  onRoleChange(ev: Event | CustomEvent<SelectChangeEventDetail<any>>) {
    const val = (ev as CustomEvent<SelectChangeEventDetail<any>>).detail?.value;
    const id = val == null ? null : Number(val);
    this.selectedRoleId = Number.isFinite(id as number) ? (id as number) : null;
    this.syncRoleOnUser(this.selectedRoleId);
  }

  trackRole(_i: number, r: Role) { return r.id; }

  onBack() {
    this.util.onBack();
  }
}
