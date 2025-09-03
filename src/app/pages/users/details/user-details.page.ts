// user-details.page.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { Role, User } from 'src/app/models/user.model';
import { RolesService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { IonModal, RadioGroupChangeEventDetail, SelectChangeEventDetail } from '@ionic/angular';

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

  private syncRoleOnUser(roleId: number | null) {
    this.user.role_id = roleId;
    const nextRole =
      roleId != null ? this.roles.find(r => Number(r.id) === Number(roleId)) ?? null : null;
    this.user.role = nextRole;
  }

  // Exemplo de salvar (update) enviando role_id
  save() {
    if (!this.user) return;

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
      next: () => this.util.onBack(),
      error: (e: any) => console.error(e),   // <<< tipado
    });
  }






  roleColor(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('admin')) return 'tertiary';
    if (n.includes('manager') || n.includes('gestor')) return 'warning';
    if (n.includes('viewer') || n.includes('user') || n.includes('cliente')) return 'medium';
    return 'primary';
  }

  openRolePicker() {
    this.rolesFiltered = this.roles;
    this.tempSelectedRoleId = this.selectedRoleId ?? null;
    this.roleModalOpen = true;         // <<< abre modal
  }

  closeRolePicker() {
    this.roleModalOpen = false;        // <<< fecha modal
  }

  confirmRolePicker() {
    this.selectedRoleId = this.tempSelectedRoleId;
    this.syncRoleOnUser(this.selectedRoleId);
    this.roleModalOpen = false;
  }

  onRoleRadioChange(ev: Event | CustomEvent<RadioGroupChangeEventDetail>) {
    const val = (ev as CustomEvent<RadioGroupChangeEventDetail>)?.detail?.value;
    this.tempSelectedRoleId = val != null ? Number(val) : null;
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
