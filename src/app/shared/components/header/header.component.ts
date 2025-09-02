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
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  wishCount = 0;
  typesBox: any[] = [];
  typesPhone: any[] = [];
  operateurs: any[] = [];
  isMobileMenuOpen = false;
  containerClass = 'container-fluid';

  // États des dropdowns pour desktop et mobile
  dropdownStates: { [key: string]: boolean } = {};

  // Propriété pour vérifier si on est dans le navigateur
  private isBrowser: boolean;
  private dropdownTimeouts: { [key: string]: any } = {};

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public modalService: ModalService,
    public apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Initialiser les données
    this.initializeData();

    // Vérifier la taille d'écran seulement côté navigateur
    if (this.isBrowser) {
      this.checkScreenSize();
      this.setupBodyScrollLock();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.checkScreenSize();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    // Nettoyer les timeouts
    Object.values(this.dropdownTimeouts).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });

    // Restaurer le scroll du body
    if (this.isBrowser && this.isMobileMenuOpen) {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }
  }

  /**
   * Initialiser les données depuis l'API
   */
  private initializeData(): void {
    this.apiService.fetchTypeBoxInternetData().subscribe({
      next: (res) => this.typesBox = res,
      error: (error) => console.error('Erreur lors du chargement des types box:', error)
    });

    this.apiService.fetchTypePhonetData().subscribe({
      next: (res) => this.typesPhone = res,
      error: (error) => console.error('Erreur lors du chargement des types phone:', error)
    });

    this.apiService.fetchSuppliersData().subscribe({
      next: (res) => this.operateurs = res,
      error: (error) => console.error('Erreur lors du chargement des opérateurs:', error)
    });
  }

  /**
   * Afficher le modal de rappel
   */
  onShowModel(): void {
    this.modalService.showDynamicModal();
  }

  /**
   * Navigation vers le stepper
   */
  goToStepper(): void {
    this.router.navigate(['/Stepper']);
  }

  // ============ GESTION MENU MOBILE ============

  /**
   * Gestion du clic sur le bouton menu mobile
   */
  onMobileMenuClick(event: Event): void {
    if (!this.isBrowser) return;

    event.preventDefault();
    event.stopPropagation();
    this.toggleMobileMenu();
  }

  /**
   * Basculer l'état du menu mobile
   */
  toggleMobileMenu(): void {
    if (!this.isBrowser) return;

    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.updateBodyScroll();

    // Fermer tous les dropdowns quand on ferme le menu
    if (!this.isMobileMenuOpen) {
      this.closeAllDropdowns();
    }
  }

  /**
   * Fermer le menu mobile
   */
  closeMobileMenu(): void {
    if (!this.isBrowser) return;

    this.isMobileMenuOpen = false;
    this.updateBodyScroll();
    this.closeAllDropdowns();
  }

  /**
   * Mettre à jour le scroll du body
   */
  private updateBodyScroll(): void {
    if (!this.isBrowser) return;

    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }
  }

  /**
   * Configuration initiale du verrouillage du scroll
   */
  private setupBodyScrollLock(): void {
    if (!this.isBrowser) return;

    // S'assurer que le body peut scroller par défaut
    document.body.style.overflow = '';
    document.body.classList.remove('mobile-menu-open');
  }

  // ============ GESTION DROPDOWNS ============

  /**
   * Basculer un dropdown (pour mobile)
   */
  toggleDropdown(dropdownName: string): void {
    // Fermer tous les autres dropdowns mobiles
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== dropdownName && key.includes('Mobile')) {
        this.dropdownStates[key] = false;
      }
    });

    // Basculer le dropdown sélectionné
    this.dropdownStates[dropdownName] = !this.dropdownStates[dropdownName];
  }

  /**
   * Ouvrir un dropdown (pour desktop avec hover)
   */
  openDropdown(dropdownName: string): void {
    // Nettoyer le timeout existant
    if (this.dropdownTimeouts[dropdownName]) {
      clearTimeout(this.dropdownTimeouts[dropdownName]);
      delete this.dropdownTimeouts[dropdownName];
    }

    this.dropdownStates[dropdownName] = true;
  }

  /**
   * Fermer un dropdown avec délai (pour desktop avec hover)
   */
  closeDropdown(dropdownName: string): void {
    // Ajouter un délai pour permettre le hover sur le dropdown
    this.dropdownTimeouts[dropdownName] = setTimeout(() => {
      this.dropdownStates[dropdownName] = false;
      delete this.dropdownTimeouts[dropdownName];
    }, 200);
  }

  /**
   * Vérifier si un dropdown est ouvert
   */
  isDropdownOpen(dropdownName: string): boolean {
    return !!this.dropdownStates[dropdownName];
  }

  /**
   * Fermer tous les dropdowns
   */
  closeAllDropdowns(): void {
    // Nettoyer tous les timeouts
    Object.values(this.dropdownTimeouts).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    this.dropdownTimeouts = {};

    // Fermer tous les dropdowns
    Object.keys(this.dropdownStates).forEach(key => {
      this.dropdownStates[key] = false;
    });
  }

  // ============ GESTION ÉVÉNEMENTS ============

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

    // Fermer tous les dropdowns lors du redimensionnement
    this.closeAllDropdowns();
  }

  /**
   * Écouter les touches du clavier
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;

    // Fermer le menu mobile avec la touche Escape
    if (event.key === 'Escape' && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }

    // Fermer les dropdowns avec Escape
    if (event.key === 'Escape') {
      this.closeAllDropdowns();
    }
  }

  /**
   * Écouter les clics sur le document pour fermer les dropdowns
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isBrowser) return;

    // Fermer les dropdowns si on clique en dehors
    const target = event.target as HTMLElement;
    if (!target.closest('.has-dropdown')) {
      this.closeAllDropdowns();
    }
  }

  /**
   * Gestion du scroll pour le sticky header
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    // Fermer les dropdowns lors du scroll
    this.closeAllDropdowns();
  }

  // ============ MÉTHODES UTILITAIRES ============

  /**
   * Vérifier la taille de l'écran et ajuster les propriétés
   */
  private checkScreenSize(): void {
    if (!this.isBrowser) {
      this.containerClass = 'container-fluid';
      return;
    }

    const screenWidth = window.innerWidth;

    if (screenWidth >= 1400) {
      this.containerClass = 'container-fluid';
    } else if (screenWidth >= 1200) {
      this.containerClass = 'container';
    } else {
      this.containerClass = 'container-fluid';
    }
  }

  /**
   * Vérifications responsives
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
    if (!this.isBrowser) return true;
    return window.innerWidth >= 992;
  }

  /**
   * Obtenir la classe CSS responsive
   */
  getResponsiveClass(): string {
    if (!this.isBrowser) return 'desktop-view';

    if (this.isMobile()) {
      return 'mobile-view';
    } else if (this.isTablet()) {
      return 'tablet-view';
    } else {
      return 'desktop-view';
    }
  }

  /**
   * Gestion sécurisée des actions navigateur
   */
  onSafeBrowserAction(action: () => void): void {
    if (this.isBrowser) {
      action();
    }
  }

  /**
   * Gestion des clics sur les liens avec dropdown (pour éviter la navigation)
   */
  onDropdownLinkClick(event: Event): void {
    // Ne pas empêcher la navigation, juste gérer le dropdown
    // event.preventDefault(); - Retiré pour permettre la navigation
  }

  /**
   * Gestion des touches pour l'accessibilité
   */
  onDropdownKeyDown(event: KeyboardEvent, dropdownName: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown(dropdownName);
    }

    if (event.key === 'Escape') {
      this.closeAllDropdowns();
    }
  }

  /**
   * Gestion du focus pour l'accessibilité
   */
  onDropdownFocus(dropdownName: string): void {
    if (this.isMobile()) {
      // Sur mobile, ne pas ouvrir automatiquement au focus
      return;
    }
    this.openDropdown(dropdownName);
  }

  /**
   * Gestion de la perte de focus
   */
  onDropdownBlur(dropdownName: string): void {
    if (this.isMobile()) {
      return;
    }
    this.closeDropdown(dropdownName);
  }

  /**
   * Méthode pour déboguer les états (développement uniquement)
   */
  debugDropdownStates(): void {
    if (!this.isBrowser) return;
    console.log('Dropdown States:', this.dropdownStates);
    console.log('Mobile Menu Open:', this.isMobileMenuOpen);
  }

  /**
   * Réinitialiser tous les états
   */
  resetAllStates(): void {
    this.closeMobileMenu();
    this.closeAllDropdowns();
  }

  /**
   * Obtenir la largeur de l'écran de manière sécurisée
   */
  private getScreenWidth(): number {
    if (!this.isBrowser) return 1920;
    return window.innerWidth;
  }

  /**
   * Vérifier si un élément est visible
   */
  private isElementVisible(element: HTMLElement): boolean {
    if (!this.isBrowser || !element) return false;

    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;
  }

  /**
   * Animation pour l'ouverture du menu mobile
   */
  animateMenuOpen(): void {
    if (!this.isBrowser) return;

    const menuElement = document.querySelector('.mobile-nav-content');
    if (menuElement) {
      menuElement.classList.add('animate-slide-in');

      setTimeout(() => {
        menuElement.classList.remove('animate-slide-in');
      }, 400);
    }
  }

  /**
   * Gestion des métadonnées de page pour SEO
   */
  updatePageMeta(): void {
    // Cette méthode peut être étendue pour mettre à jour les métadonnées
    // selon la page actuelle
    if (this.isBrowser) {
      // Logique de mise à jour des métadonnées
    }
  }

  /**
   * Méthode pour gérer les liens externes
   */
  onExternalLinkClick(url: string, event?: Event): void {
    if (!this.isBrowser) return;

    if (event) {
      event.preventDefault();
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Gestion de l'accessibilité - focus trap pour menu mobile
   */
  private setupFocusTrap(): void {
    if (!this.isBrowser || !this.isMobileMenuOpen) return;

    const mobileNav = document.querySelector('.mobile-nav-content');
    const focusableElements = mobileNav?.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Focus sur le premier élément
      setTimeout(() => firstElement.focus(), 100);

      // Gérer le focus trap
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);

      // Nettoyer l'event listener quand le menu se ferme
      const cleanup = () => {
        document.removeEventListener('keydown', handleTabKey);
      };

      // Stocker la fonction de nettoyage
      (this as any).currentFocusTrapCleanup = cleanup;
    }
  }

  /**
   * Nettoyer le focus trap
   */
  private cleanupFocusTrap(): void {
    if ((this as any).currentFocusTrapCleanup) {
      (this as any).currentFocusTrapCleanup();
      delete (this as any).currentFocusTrapCleanup;
    }
  }

  /**
   * Vérifier la taille de l'écran et ajuster les propriétés
   */

  // ============ MÉTHODES PUBLIQUES POUR LE TEMPLATE ============

  /**
   * Vérifier si on est sur mobile (publique pour le template)
   */
  public isMobileDevice(): boolean {
    return this.isMobile();
  }

  /**
   * Vérifier si on est sur tablet (publique pour le template)
   */
  public isTabletDevice(): boolean {
    return this.isTablet();
  }

  /**
   * Vérifier si on est sur desktop (publique pour le template)
   */
  public isDesktopDevice(): boolean {
    return this.isDesktop();
  }

  /**
   * Obtenir l'état actuel du menu mobile
   */
  public getMobileMenuState(): boolean {
    return this.isMobileMenuOpen;
  }

  /**
   * Obtenir tous les états des dropdowns
   */
  public getDropdownStates(): { [key: string]: boolean } {
    return { ...this.dropdownStates };
  }

  /**
   * Méthode pour forcer la fermeture de tous les menus (utile pour les événements externes)
   */
  public forceCloseAllMenus(): void {
    this.resetAllStates();
  }
}
