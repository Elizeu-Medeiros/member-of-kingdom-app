
import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { People } from 'src/app/models/people.model';
import { PeopleService } from 'src/app/services/people.service';
import { RolesService } from 'src/app/services/role.service';
import { IonModal, ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from 'src/app/models/roles.model';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.page.html',
  styleUrls: ['./people-form.page.scss'],
})
export class PeopleFormPage implements OnInit {
  @ViewChild('roleModal') roleModal!: IonModal;

  people!: People;
  isEdit = false;
  isLoading = false;

  roles: Role[] = [];
  rolesFiltered: Role[] = [];
  selectedRoleId: number | null = null;
  tempSelectedRoleId: number | null = null;
  roleModalOpen = false;


  confirmPassword = '';
  validationErrors: { [key: string]: string } = {};

  constructor(
    public util: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RolesService,
    private peopleService: PeopleService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {

    // Carregar roles em paralelo (não bloquear a inicialização)
    this.loadRoles();

    // Processar usuário independentemente
    this.initializeForm();
  }

  /**
   * ALGORITMO CORRIGIDO: Processamento paralelo
   */
  private initializeForm() {
    const peopleId = this.route.snapshot.paramMap.get('id');

    if (peopleId && peopleId !== 'new') {
      // Modo EDITAR - buscar usuário por ID
      this.isEdit = true;
      this.loadPeopleById(Number(peopleId));
    } else {
      // Verificar se veio dados via navegação
      const peopleData = this.getPeopleDataFromNavigation();

      if (peopleData) {
        this.isEdit = true;
        this.people = peopleData;
        // Sincronizar role quando ambos os dados estiverem prontos
        this.syncRoleWhenReady();
      } else {
        this.isEdit = false;
        this.initializeNewPeople();
      }
    }
  }

  /**
   * Carregamento de roles (não bloqueia a UI)
   */
  private loadRoles() {

    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {

        this.roles = roles;
        this.rolesFiltered = [...roles]; // Cópia independente

        // Tentar sincronizar se o usuário já estiver carregado
        this.syncRoleWhenReady();
      },
      error: (error) => {

        this.showToast('Erro ao carregar papéis. Verifique sua conexão.', 'danger');
      }
    });
  }

  /**
   * Carregamento de usuário por ID
   */
  private loadPeopleById(id: number) {
    this.isLoading = true;


    this.peopleService.getPeople(id).subscribe({
      next: (people: People) => {

        this.people = people;
        this.isLoading = false;

        // Tentar sincronizar se os roles já estiverem carregados
        this.syncRoleWhenReady();
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 404) {
          this.showToast('Usuário não encontrado', 'warning');
        } else {
          this.showToast('Erro ao carregar usuário', 'danger');
        }

        // Voltar após erro
        setTimeout(() => this.util.onBack(), 2000);
      }
    });
  }

  /**
   * Sincronização inteligente - só executa quando ambos os dados estão prontos
   */
  private syncRoleWhenReady() {
    // Determinar role ID prioritário
    let targetRoleId: number | null = null;

    // if (this.people.role_id != null) {
    //   targetRoleId = Number(this.people.role_id);
    // } else if (this.people.role?.id != null) {
    //   targetRoleId = Number(this.people.role.id);
    // }

    this.selectedRoleId = targetRoleId;
    this.syncRoleOnPeople(targetRoleId);

    // console.log('✅ Role sincronizada:', {
    //   selectedRoleId: this.selectedRoleId,
    //   selectedRoleName: this.selectedRoleName
    // });
  }

  private getPeopleDataFromNavigation(): People | null {
    const nav = this.router.getCurrentNavigation();
    const fromState = (nav?.extras?.state as any)?.people;
    const fromHistory = history.state?.people;

    let fromStorage = null;
    try {
      const stored = sessionStorage.getItem('people_edit');
      if (stored) {
        fromStorage = JSON.parse(stored);
        sessionStorage.removeItem('people_edit');
      }
    } catch (e) {
      console.warn('⚠️ Erro ao ler sessionStorage:', e);
    }

    const result = fromState || fromHistory || fromStorage || null;
    console.log('📦 Dados da navegação:', !!result);

    return result;
  }

  private initializeNewPeople() {
    this.people = {
      id: 0,
      name_full: '',
      email: '',
      type_people_id: 0,
      type: { id: 0, description: '' },
      // password: '',
      // role_id: null,
      // role: null,
    };

    this.selectedRoleId = null;
  }

  // ===== VALIDAÇÃO =====

  validateField(field: string, value: any): string {
    let error = '';

    switch (field) {
      case 'name':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          error = 'Nome deve ter pelo menos 2 caracteres';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || typeof value !== 'string' || !emailRegex.test(value.trim())) {
          error = 'Email deve ter formato válido';
        }
        break;

      case 'password':
        if (!this.isEdit) {
          if (!value || typeof value !== 'string' || value.length < 6) {
            error = 'Senha deve ter pelo menos 6 caracteres';
          }
        } else {
          if (value && (typeof value !== 'string' || value.length < 6)) {
            error = 'Senha deve ter pelo menos 6 caracteres';
          }
        }
        break;

      // case 'confirmPassword':
      //   if (this.people?.password && value !== this.people.password) {
      //     error = 'Confirmação deve ser igual à senha';
      //   }
      //   break;

      case 'role_id':
        if (!this.isEdit && !value) {
          error = 'Papel é obrigatório para novos usuários';
        }
        break;
    }

    if (error) {
      this.validationErrors[field] = error;
    } else {
      delete this.validationErrors[field];
    }

    return error;
  }

  private validateForm(): boolean {
    this.validationErrors = {};

    const fieldsToValidate = [
      { key: 'name', value: this.people?.name_full },
      { key: 'email', value: this.people?.email },
      // { key: 'password', value: this.people?.password },
      // { key: 'confirmPassword', value: this.confirmPassword },
      // { key: 'role_id', value: this.selectedRoleId }
    ];

    let isValid = true;

    fieldsToValidate.forEach(({ key, value }) => {
      const error = this.validateField(key, value);
      if (error) {
        isValid = false;
      }
    });

    return isValid;
  }

  // ===== SALVAMENTO =====

  async save() {

    if (!this.validateForm()) {
      this.showToast('Por favor, corrija os erros no formulário', 'warning');
      return;
    }

    this.isLoading = true;
    const payload = this.preparePayload();

    try {
      if (this.isEdit) {
        await this.updatePeople(payload);
      } else {
        await this.createPeople(payload);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private preparePayload(): any {
    const payload: any = {
      name: this.people.name_full?.trim(),
      email: this.people.email?.trim(),
      role_id: this.selectedRoleId
    };

    // if (this.people.password) {
    //   payload.password = this.people.password;
    //   payload.password_confirmation = this.confirmPassword;
    // }

    console.log('📤 Payload preparado:', payload);
    return payload;
  }

  private async createPeople(payload: any) {
    return new Promise((resolve, reject) => {
      this.peopleService.createPeople(payload).subscribe({
        next: async (response) => {
          await this.showToast(
            response?.message || 'Usuário criado com sucesso!',
            'success'
          );
          sessionStorage.setItem('peoples_dirty', '1');
          this.util.onBack();
          resolve(response);
        },
        error: async (error: HttpErrorResponse) => {
          await this.handleSaveError(error);
          reject(error);
        }
      });
    });
  }

  private async updatePeople(payload: any) {
    return new Promise((resolve, reject) => {
      this.peopleService.updatePeople(this.people.id, payload).subscribe({
        next: async (response) => {
          await this.showToast(
            response?.message || 'Usuário atualizado com sucesso!',
            'success'
          );
          sessionStorage.setItem('peoples_dirty', '1');
          this.util.onBack();
          resolve(response);
        },
        error: async (error: HttpErrorResponse) => {
          await this.handleSaveError(error);
          reject(error);
        }
      });
    });
  }

  private async handleSaveError(error: HttpErrorResponse) {
    let message = 'Erro ao salvar usuário';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.error?.errors) {
      const errorValues = Object.values(error.error.errors) as string[][];
      const errors: string[] = [];
      errorValues.forEach(errorArray => {
        if (Array.isArray(errorArray)) {
          errors.push(...errorArray);
        }
      });
      message = errors.join(', ');
    }

    await this.showToast(message, 'danger');
  }

  // ===== MÉTODOS DE ROLE =====

  get selectedRoleName(): string {
    const roleName = (
      // this.people?.role?.name ||
      this.roles.find(r => Number(r.id) === Number(this.selectedRoleId))?.name ||
      ''
    );

    return roleName;
  }

  openRolePicker() {
    if (this.roles.length === 0) {
      this.showToast('Carregando papéis...', 'medium');
      return;
    }

    this.rolesFiltered = [...this.roles];
    this.tempSelectedRoleId = this.selectedRoleId ?? null;
    this.roleModalOpen = true;
  }

  confirmRolePicker(id?: number) {
    if (typeof id === 'number') {
      this.tempSelectedRoleId = id;
    }

    this.selectedRoleId = this.tempSelectedRoleId;
    this.syncRoleOnPeople(this.selectedRoleId);
    this.roleModalOpen = false;

  }

  closeRolePicker(commit = false) {
    if (commit) {
      this.selectedRoleId = this.tempSelectedRoleId;
      this.syncRoleOnPeople(this.selectedRoleId);
    }
    this.roleModalOpen = false;
  }

  onRoleRadioChange(ev: any) {
    const val = ev?.detail?.value;
    this.tempSelectedRoleId = val != null ? Number(val) : null;
  }

  private syncRoleOnPeople(roleId: number | null) {
    if (!this.people) return;

    // this.people.role_id = roleId;

    // if (roleId != null) {
    //   const foundRole = this.roles.find(r => Number(r.id) === Number(roleId));
    //   this.people.role = foundRole || null;
    // } else {
    //   this.people.role = null;
    // }

    // Forçar detecção de mudanças
    this.cdr.detectChanges();
  }

  onRoleSearch(ev: any) {
    const query = (ev?.target?.value || '').toString().toLowerCase().trim();

    if (!query) {
      this.rolesFiltered = [...this.roles];
    } else {
      this.rolesFiltered = this.roles.filter(r =>
        (r.name || '').toLowerCase().includes(query) ||
        (r.description || '').toLowerCase().includes(query)
      );
    }
  }

  roleColor(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('admin')) return 'tertiary';
    if (n.includes('manager') || n.includes('gestor')) return 'warning';
    if (n.includes('viewer') || n.includes('people') || n.includes('cliente')) return 'medium';
    return 'primary';
  }

  // ===== MÉTODOS UTILITÁRIOS =====

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top',
      icon: color === 'success' ? 'checkmark-circle' :
        color === 'danger' ? 'alert-circle' :
          'information-circle'
    });
    await toast.present();
  }

  trackRole(_i: number, r: Role) {
    return r.id;
  }

  onBack() {
    this.util.onBack();
  }

  hasError(field: string): boolean {
    return !!this.validationErrors[field];
  }

  getError(field: string): string {
    return this.validationErrors[field] || '';
  }

  // ===== MÉTODO DE DEBUG =====
  debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('isEdit:', this.isEdit);
    console.log('isLoading:', this.isLoading);
    console.log('people:', this.people);
    console.log('roles count:', this.roles.length);
    console.log('selectedRoleId:', this.selectedRoleId);
    console.log('selectedRoleName:', this.selectedRoleName);
    console.log('==================');
  }
}
