import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { ApiService } from '../../../core/services/ApiService';
import { ModalService } from '../../../core/services/modal.service';
import {
  Observable,
  Subject,
  fromEvent,
  merge,
  timer,
  EMPTY,
  catchError,
  takeUntil,
  switchMap,
  debounceTime
} from 'rxjs';

interface Slide {
  id: string;
  titre: string;
  description: string;
  imageUrl: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  isWithoutEngagement: boolean;
  period?: number;
}

@Component({
  selector: 'app-publicite',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './publicite.component.html',
  styleUrls: ['./publicite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PubliciteComponent implements OnInit, OnDestroy {

  // Injection de dépendances
  private readonly apiService = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly modalService = inject(ModalService);

  // ViewChild pour accéder au DOM
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;

  // État des slides
  slides: Slide[] = [];
  loadingSlides = true;
  errorSlides: string | null = null;
  activeSlideIndex = 0;

  // État des produits
  boxSide: Product[] = [];
  phoneSide: Product[] = [];
  isloadSildes = false;

  // Autoplay et progression
  private slideInterval?: ReturnType<typeof setInterval>;
  private progressInterval?: ReturnType<typeof setInterval>;
  slideProgress = 0;
  private readonly SLIDE_DURATION = 3000; // 5 secondes
  private readonly PROGRESS_INTERVAL = 100; // 100ms
  private isAutoplayPaused = false;
  private isUserInteracting = false;

  // Support tactile et swipe
  private touchStartX = 0;
  private touchEndX = 0;
  private touchStartY = 0;
  private touchEndY = 0;
  private readonly MIN_SWIPE_DISTANCE = 50;
  private readonly MAX_VERTICAL_DISTANCE = 100;

  // Gestion des observables
  private readonly destroy$ = new Subject<void>();
  private readonly pauseAutoplay$ = new Subject<void>();
  private readonly resumeAutoplay$ = new Subject<void>();

  // Préférences utilisateur
  private prefersReducedMotion = false;

  constructor(private router: Router) {
    this.checkReducedMotionPreference();
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Gestion des événements de redimensionnement
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.debounceResize();
  }

  // Gestion de la visibilité de la page
  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(): void {
    if (document.hidden) {
      this.pauseAutoplay();
    } else if (!this.isUserInteracting) {
      this.resumeAutoplay();
    }
  }

  // Gestion des événements tactiles
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.isUserInteracting = true;
      this.pauseAutoplay();
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    // Prévenir le scroll vertical si c'est un swipe horizontal
    if (this.isHorizontalSwipe(event)) {
      event.preventDefault();
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length === 1) {
      const touch = event.changedTouches[0];
      this.touchEndX = touch.clientX;
      this.touchEndY = touch.clientY;
      this.handleSwipeGesture();

      // Reprendre l'autoplay après un délai
      setTimeout(() => {
        this.isUserInteracting = false;
        this.resumeAutoplay();
      }, 2000);
    }
  }

  // Gestion du clavier pour l'accessibilité
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.slides.length <= 1) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.prevSlide();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextSlide();
        break;
      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToSlide(this.slides.length - 1);
        break;
      case ' ':
        event.preventDefault();
        this.toggleAutoplay();
        break;
    }
  }

  // Initialisation du composant
  private initializeComponent(): void {
    this.fetchAllData();
  }

  // Configuration des écouteurs d'événements
  private setupEventListeners(): void {
    // Gestion de l'autoplay avec les observables
    merge(
      this.pauseAutoplay$.pipe(switchMap(() => EMPTY)),
      this.resumeAutoplay$.pipe(switchMap(() => this.createAutoplayTimer()))
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  // Chargement de toutes les données
  private fetchAllData(): void {
    this.fetchSlides();
    this.fetchBoxSideData();
    this.fetchPhoneSideData();
  }

  // Récupération des slides
  fetchSlides(): void {
    this.loadingSlides = true;
    this.errorSlides = null;

    this.apiService.fetchSlidesData().pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des slides:', error);
        this.errorSlides = "Impossible de charger les offres. Veuillez réessayer.";
        this.loadingSlides = false;
        this.cdr.markForCheck();
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (slides: Slide[]) => {
        this.slides = slides || [];
        this.loadingSlides = false;
        this.isloadSildes = true;

        if (this.slides.length > 1 && !this.prefersReducedMotion) {
          this.startAutoplay();
        }

        this.cdr.markForCheck();
      }
    });
  }

  // Récupération des box internet
  private fetchBoxSideData(): void {
    this.apiService.fetchBoxSideData().pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des box internet:', error);
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: Product[]) => {
        this.boxSide = data || [];
        this.cdr.markForCheck();
      }
    });
  }

  // Récupération des forfaits mobiles
  private fetchPhoneSideData(): void {
    this.apiService.fetchPhoneSideData().pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des forfaits mobiles:', error);
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: Product[]) => {
        this.phoneSide = data || [];
        this.cdr.markForCheck();
      }
    });
  }

  // Gestion de l'autoplay
  private startAutoplay(): void {
    if (this.slides.length <= 1 || this.prefersReducedMotion) return;

    this.clearIntervals();
    this.slideProgress = 0;

    this.progressInterval = setInterval(() => {
      if (!this.isAutoplayPaused && !this.isUserInteracting) {
        this.slideProgress += (100 / (this.SLIDE_DURATION / this.PROGRESS_INTERVAL));

        if (this.slideProgress >= 100) {
          this.nextSlide();
          this.slideProgress = 0;
        }

        this.cdr.markForCheck();
      }
    }, this.PROGRESS_INTERVAL);
  }

  private createAutoplayTimer(): Observable<number> {
    return timer(0, this.SLIDE_DURATION).pipe(
      takeUntil(this.pauseAutoplay$),
      takeUntil(this.destroy$)
    );
  }

  // Navigation dans les slides
  nextSlide(): void {
    if (this.slides.length <= 1) return;

    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
    this.resetProgress();
    this.announceSlideChange();
  }

  prevSlide(): void {
    if (this.slides.length <= 1) return;

    this.activeSlideIndex = this.activeSlideIndex === 0
      ? this.slides.length - 1
      : this.activeSlideIndex - 1;
    this.resetProgress();
    this.announceSlideChange();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length && index !== this.activeSlideIndex) {
      this.activeSlideIndex = index;
      this.resetProgress();
      this.announceSlideChange();
    }
  }

  // Contrôle de l'autoplay
  private pauseAutoplay(): void {
    this.isAutoplayPaused = true;
    this.pauseAutoplay$.next();
  }

  private resumeAutoplay(): void {
    if (!this.isUserInteracting && this.slides.length > 1) {
      this.isAutoplayPaused = false;
      this.resumeAutoplay$.next();
    }
  }

  private toggleAutoplay(): void {
    if (this.isAutoplayPaused) {
      this.resumeAutoplay();
    } else {
      this.pauseAutoplay();
    }
  }

  // Gestion des événements de souris
  onMouseEnter(): void {
    this.pauseAutoplay();
  }

  onMouseLeave(): void {
    this.resumeAutoplay();
  }

  // Gestion des gestes tactiles
  private isHorizontalSwipe(event: TouchEvent): boolean {
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - this.touchStartX);
    const deltaY = Math.abs(touch.clientY - this.touchStartY);
    return deltaX > deltaY && deltaX > 10;
  }

  private handleSwipeGesture(): void {
    const swipeDistanceX = this.touchEndX - this.touchStartX;
    const swipeDistanceY = Math.abs(this.touchEndY - this.touchStartY);

    // Vérifier que c'est un swipe horizontal valide
    if (swipeDistanceY < this.MAX_VERTICAL_DISTANCE &&
      Math.abs(swipeDistanceX) > this.MIN_SWIPE_DISTANCE) {

      if (swipeDistanceX > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  // Utilitaires
  private resetProgress(): void {
    this.slideProgress = 0;
    if (this.slides.length > 1 && !this.prefersReducedMotion) {
      this.startAutoplay();
    }
  }

  private clearIntervals(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = undefined;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  }

  private cleanup(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearIntervals();
  }

  // Redimensionnement avec debounce
  private debounceResize = this.debounce(() => {
    if (this.slides.length > 1 && !this.isAutoplayPaused) {
      this.startAutoplay();
    }
    this.cdr.markForCheck();
  }, 250);

  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Vérification des préférences d'accessibilité
  private checkReducedMotionPreference(): void {
    if (typeof window !== 'undefined') {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  // Annonce des changements pour les lecteurs d'écran
  private announceSlideChange(): void {
    if (typeof window !== 'undefined' && this.slides[this.activeSlideIndex]) {
      const slide = this.slides[this.activeSlideIndex];
      const announcement = `Slide ${this.activeSlideIndex + 1} sur ${this.slides.length}: ${slide.titre}`;

      // Créer un élément pour annoncer le changement aux lecteurs d'écran
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;

      document.body.appendChild(announcer);
      setTimeout(() => document.body.removeChild(announcer), 1000);
    }
  }

  // Affichage du modal
  onShowModel(): void {
    this.pauseAutoplay();
    this.modalService.showDynamicModal();

    // Reprendre l'autoplay après fermeture du modal (simulation)
    setTimeout(() => {
      this.resumeAutoplay();
    }, 5000);
  }

  // TrackBy pour optimiser les performances
  trackByFn(index: number, item: Product): string {
    return item.id || index.toString();
  }

  trackBySlideFn(index: number, item: Slide): string {
    return item.id || index.toString();
  }

  // Getters pour la compatibilité avec le template existant
  get box(): Product[] {
    return this.boxSide;
  }

  get phones(): Product[] {
    return this.phoneSide;
  }

  get loaded(): boolean {
    return this.isloadSildes;
  }

  // Méthodes utilitaires pour la gestion des erreurs
  private handleError(error: any, context: string): void {
    console.error(`Erreur dans ${context}:`, error);
    this.cdr.markForCheck();
  }

  // Gestion de l'intersection observer pour optimiser les performances
  private setupIntersectionObserver(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Le carousel est visible, démarrer l'autoplay si nécessaire
              if (this.slides.length > 1 && !this.isAutoplayPaused && !this.prefersReducedMotion) {
                this.startAutoplay();
              }
            } else {
              // Le carousel n'est pas visible, arrêter l'autoplay
              this.pauseAutoplay();
            }
          });
        },
        { threshold: 0.5 }
      );

      // Observer le container du carousel quand il sera disponible
      setTimeout(() => {
        if (this.carouselContainer?.nativeElement) {
          observer.observe(this.carouselContainer.nativeElement);
        }
      }, 100);

      // Nettoyer l'observer
      this.destroy$.subscribe(() => {
        observer.disconnect();
      });
    }
  }

  // Préchargement des images pour de meilleures performances
  private preloadImages(): void {
    this.slides.forEach((slide, index) => {
      if (slide.imageUrl && index < 3) { // Précharger les 3 premières images
        const img = new Image();
        img.src = slide.imageUrl;
      }
    });
  }

  // Validation des données
  private validateSlideData(slides: any[]): Slide[] {
    return slides.filter(slide =>
      slide &&
      slide.titre &&
      slide.description &&
      slide.imageUrl
    );
  }

  private validateProductData(products: any[]): Product[] {
    return products.filter(product =>
      product &&
      product.id &&
      product.title &&
      typeof product.price === 'number' &&
      product.imageUrl
    );
  }

  // Gestion avancée de l'état du carousel
  private resetCarouselState(): void {
    this.activeSlideIndex = 0;
    this.slideProgress = 0;
    this.isAutoplayPaused = false;
    this.isUserInteracting = false;
  }

  // Animation fluide vers un slide spécifique
  animateToSlide(targetIndex: number): void {
    if (targetIndex === this.activeSlideIndex) return;

    const direction = targetIndex > this.activeSlideIndex ? 1 : -1;
    const distance = Math.abs(targetIndex - this.activeSlideIndex);

    // Pour de grandes distances, prendre le chemin le plus court
    if (distance > this.slides.length / 2) {
      if (direction === 1) {
        // Aller vers la gauche via le début
        this.activeSlideIndex = targetIndex;
      } else {
        // Aller vers la droite via la fin
        this.activeSlideIndex = targetIndex;
      }
    } else {
      this.activeSlideIndex = targetIndex;
    }

    this.resetProgress();
    this.announceSlideChange();
  }

  // Gestion de la performance sur mobile
  private optimizeForMobile(): void {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Réduire la fréquence de mise à jour sur mobile
       // this.SLIDE_DURATION = 6000; // Plus long sur mobile
      }
    }
  }

  // Méthodes de débogage (pour le développement)
  debugAddressFound(event: any): void {
    if (console && console.log) {
      console.log('Address found event:', event);
    }
  }

  // Gestion de l'état de focus pour l'accessibilité
  private manageFocusState(): void {
    // S'assurer que le slide actif soit focusable
    if (typeof document !== 'undefined') {
      const activeSlide = document.querySelector('.slide-item.active');
      if (activeSlide) {
        (activeSlide as HTMLElement).setAttribute('tabindex', '0');
      }

      // Retirer le focus des autres slides
      const inactiveSlides = document.querySelectorAll('.slide-item:not(.active)');
      inactiveSlides.forEach(slide => {
        (slide as HTMLElement).setAttribute('tabindex', '-1');
      });
    }
  }

  // Nettoyage des ressources
  private performCleanup(): void {
    this.clearIntervals();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Méthodes supplémentaires pour l'accessibilité
  getSlideAriaLabel(index: number): string {
    const slide = this.slides[index];
    return `Slide ${index + 1} sur ${this.slides.length}: ${slide?.titre || 'Slide sans titre'}`;
  }

  getCurrentSlideDescription(): string {
    const slide = this.slides[this.activeSlideIndex];
    return slide ? slide.description : '';
  }

  // Gestion des préférences utilisateur
  private applyUserPreferences(): void {
    // Vérifier les préférences de mouvement réduit
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mediaQuery.matches;

      mediaQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion = e.matches;
        if (this.prefersReducedMotion) {
          this.clearIntervals();
        } else if (this.slides.length > 1) {
          this.startAutoplay();
        }
      });
    }
  }

  // Méthodes de cache et optimisation
  private cacheProductImages(): void {
    const allProducts = [...this.boxSide, ...this.phoneSide];
    allProducts.slice(0, 6).forEach(product => {
      if (product.imageUrl) {
        const img = new Image();
        img.src = product.imageUrl;
      }
    });
  }

  // Gestion de la mémoire
  private optimizeMemoryUsage(): void {
    // Limiter le nombre de slides actifs en mémoire
    if (this.slides.length > 10) {
      // Implémenter une stratégie de lazy loading si nécessaire
      console.warn('Grand nombre de slides détecté. Considérez l\'implémentation du lazy loading.');
    }
  }

  // Méthodes finales
  private finalizeInitialization(): void {
    this.preloadImages();
    this.setupIntersectionObserver();
    this.applyUserPreferences();
    this.optimizeForMobile();
    this.cacheProductImages();
    this.manageFocusState();
  }
  navigateToADSL(): void {
    this.router.navigate(['/adsl-offers']).catch(err => {
      console.error('Erreur navigation ADSL:', err);
    });
  }

  navigateToFibre(): void {
    this.router.navigate(['/fibre-offers']).catch(err => {
      console.error('Erreur navigation Fibre:', err);
    });
  }

  navigateToBox4G(): void {
    this.router.navigate(['/box-4g-offers']).catch(err => {
      console.error('Erreur navigation Box 4G:', err);
    });
  }

  navigateToMobile(): void {
    this.router.navigate(['/mobile-offers']).catch(err => {
      console.error('Erreur navigation Mobile:', err);
    });
  }



}
