import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';

register();

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild("swiper") swiper?: ElementRef<{ swiper: Swiper }>;
  activeIndex: number = 0;

  constructor(public util: UtilService) { }

  ngOnInit() {
    // Configurar slides específicos para Member Kingdom
    this.setupChurchSlides();
  }

  /**
   * Configurar slides personalizados para gestão de igrejas
   */
  private setupChurchSlides() {
    this.util.welcomeSlider = [
      {
        title: "Gerencie sua Igreja",
        sub: "Organize membros, eventos e atividades da sua comunidade em um só lugar. Simplifique a administração e fortaleça os vínculos.",
        image: "assets/images/sliders/church-management-svg.svg", // Você precisará adicionar essas imagens
        icon: "business-outline",
        features: [
          { icon: "people-outline", text: "Cadastro completo de membros" },
          { icon: "calendar-outline", text: "Agenda de eventos e cultos" },
          { icon: "stats-chart-outline", text: "Relatórios e estatísticas" }
        ]
      },
      {
        title: "Conecte sua Comunidade",
        sub: "Facilite a comunicação entre líderes e membros. Mantenha todos informados sobre eventos, anúncios e atividades importantes.",
        image: "assets/images/sliders/church-community-svg.svg",
        icon: "heart-outline",
        features: [
          { icon: "chatbubbles-outline", text: "Comunicação direta" },
          { icon: "notifications-outline", text: "Notificações importantes" },
          { icon: "share-social-outline", text: "Compartilhamento fácil" }
        ]
      },
      {
        title: "Cresça com Propósito",
        sub: "Acompanhe o crescimento da sua igreja com ferramentas inteligentes. Dados que ajudam a tomar melhores decisões ministeriais.",
        image: "assets/images/sliders/church-growth-svg.svg",
        icon: "trending-up-outline",
        features: [
          { icon: "analytics-outline", text: "Métricas de crescimento" },
          { icon: "folder-outline", text: "Organização por departamentos" },
          { icon: "shield-checkmark-outline", text: "Dados seguros e privados" }
        ]
      }
    ];
  }

  /**
   * Manipula a mudança de slide
   */
  changed() {
    this.activeIndex = this.swiper?.nativeElement.swiper.activeIndex || 0;
    console.log('Slide ativo:', this.activeIndex);
  }

  /**
   * Navega para a tela de autenticação
   */
  onAuth() {
    // Salvar que o usuário já viu a introdução
    localStorage.setItem('member_kingdom_intro_seen', 'true');

    // Navegar para login
    this.util.navigateRoot('/login');
  }

  /**
   * Ir para o próximo slide
   */
  nextSlide() {
    if (this.activeIndex < 2) {
      this.swiper?.nativeElement.swiper.slideNext();
    } else {
      this.onAuth();
    }
  }

  /**
   * Ir para slide específico
   */
  goToSlide(index: number) {
    this.swiper?.nativeElement.swiper.slideTo(index);
  }
}

// ===== ATUALIZAR util.service.ts =====

/**
 * Adicione esta interface no seu util.service.ts ou em um arquivo de tipos separado
 */
export interface WelcomeSlide {
  title: string;
  sub: string;
  image: string;
  icon: string;
  features?: Array<{
    icon: string;
    text: string;
  }>;
}
