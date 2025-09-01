import {Component, OnInit, Input, AfterViewInit, ViewEncapsulation, HostListener, OnDestroy, Inject, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {UtilsService} from '../../../core/services/utils.service';
import {ModalService} from '../../../core/services/modal.service';
import {ApiService} from '../../../core/services/ApiService';
import {CommonModule, isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {

  wishCount = 0;
  typesBox: any[] = [];
  typesPhone: any[] = [];
  operateurs: any[] = [];
  isMobileMenuOpen = false;
  mobileDropdowns = {
    boxInternet: false,
    forfaitMobile: false,
    testDebit: false
  };
  containerClass = 'container-fluid';

  // Propriété pour vérifier si on est dans le navigateur
  private isBrowser: boolean;

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public modalService: ModalService,
    public apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Vérifier si on est côté navigateur ou serveur
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.apiService.fetchTypeBoxInternetData().subscribe(res => {
      this.typesBox = res;
    });

    // Vérifier la taille d'écran seulement côté navigateur
    if (this.isBrowser) {
      this.checkScreenSize();
    }

    this.apiService.fetchTypePhonetData().subscribe(res => {
      this.typesPhone = res;
    });

    this.apiService.fetchSuppliersData().subscribe(res => {
      this.operateurs = res;
    });
  }

  onShowModel() {
    this.modalService.showDynamicModal();
  }

  goToStepper() {
    this.router.navigate(['/Stepper']);
  }

  /**
   * Gestion du clic sur le bouton menu mobile
   */
  onMobileMenuClick(event: Event): void {
    if (!this.isBrowser) return;

    event.preventDefault();
    event.stopPropagation();
    this.toggleMobileMenu();
  }

  ngOnDestroy(): void {
    // Nettoyer seulement côté navigateur
    if (this.isBrowser && this.isMobileMenuOpen) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Écouter les changements de taille de fenêtre
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (!this.isBrowser) return;

    this.checkScreenSize();

    // Fermer le menu mobile si on passe en mode desktop
    if (window.innerWidth >= 992 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Écouter les touches du clocher
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;

    // Fermer le menu mobile avec la touche Escape
    if (event.key === 'Escape' && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Vérifier la taille de l'écran et ajuster les propriétés
   */
  private checkScreenSize(): void {
    if (!this.isBrowser) {
      // Valeurs par défaut côté serveur
      this.containerClass = 'container-fluid';
      return;
    }

    const screenWidth = window.innerWidth;

    // Ajuster la classe container selon la taille
    if (screenWidth >= 1400) {
      this.containerClass = 'container-fluid';
    } else if (screenWidth >= 1200) {
      this.containerClass = 'container';
    } else {
      this.containerClass = 'container-fluid';
    }
  }

  /**
   * Basculer l'état du menu mobile
   */
  toggleMobileMenu(): void {
    if (!this.isBrowser) return;

    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Empêcher le défilement du body quand le menu est ouvert
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Fermer le menu mobile
   */
  closeMobileMenu(): void {
    if (!this.isBrowser) return;

    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';

    // Fermer tous les dropdowns
    Object.keys(this.mobileDropdowns).forEach(key => {
      this.mobileDropdowns[key as keyof typeof this.mobileDropdowns] = false;
    });
  }

  /**
   * Basculer un dropdown dans le menu mobile
   */
  toggleMobileDropdown(dropdownName: keyof typeof this.mobileDropdowns): void {
    // Fermer tous les autres dropdowns
    Object.keys(this.mobileDropdowns).forEach(key => {
      if (key !== dropdownName) {
        this.mobileDropdowns[key as keyof typeof this.mobileDropdowns] = false;
      }
    });

    // Basculer le dropdown sélectionné
    this.mobileDropdowns[dropdownName] = !this.mobileDropdowns[dropdownName];
  }

  /**
   * Gestion des clics sur les liens avec dropdown
   */
  onDropdownLinkClick(event: Event): void {
    event.preventDefault();
  }

  /**
   * Gestion du focus pour l'accessibilité
   */
  onDropdownKeyDown(event: KeyboardEvent, dropdownName: keyof typeof this.mobileDropdowns): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMobileDropdown(dropdownName);
    }
  }

  /**
   * Vérifier si un dropdown est ouvert
   */
  isDropdownOpen(dropdownName: keyof typeof this.mobileDropdowns): boolean {
    return this.mobileDropdowns[dropdownName];
  }

  /**
   * Fermer tous les dropdowns
   */
  closeAllDropdowns(): void {
    Object.keys(this.mobileDropdowns).forEach(key => {
      this.mobileDropdowns[key as keyof typeof this.mobileDropdowns] = false;
    });
  }

  /**
   * Gestion du scroll pour le sticky header
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    // Cette logique peut être gérée par votre UtilsService
    // ou implémentée ici selon vos besoins
  }

  /**
   * Méthodes utilitaires pour la responsivité
   */
  isMobile(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth < 768;
  }

  isTablet(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth >= 768 && window.innerWidth < 992;
  }

  isDesktop(): boolean {
    if (!this.isBrowser) return true; // Défaut côté serveur
    return window.innerWidth >= 992;
  }

  /**
   * Obtenir la classe CSS appropriée selon la taille d'écran
   */
  getResponsiveClass(): string {
    if (!this.isBrowser) return 'desktop-view'; // Défaut côté serveur

    if (this.isMobile()) {
      return 'mobile-view';
    } else if (this.isTablet()) {
      return 'tablet-view';
    } else {
      return 'desktop-view';
    }
  }

  /**
   * Obtenir la largeur de l'écran de manière sécurisée
   */
  private getScreenWidth(): number {
    if (!this.isBrowser) return 1920; // Valeur par défaut côté serveur
    return window.innerWidth;
  }




  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Logique d'initialisation côté navigateur uniquement
      setTimeout(() => {
        this.checkScreenSize();
      }, 0);
    }
  }

  /**
   * Méthode pour gérer les événements de clic seulement côté navigateur
   */
  onSafeBrowserAction(action: () => void): void {
    if (this.isBrowser) {
      action();
    }
  }
}
