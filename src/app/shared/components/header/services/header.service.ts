// src/app/shared/components/header/services/header.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  children?: NavigationItem[];
  external?: boolean;
  badge?: string;
  disabled?: boolean;
  visible?: boolean;
}

export interface ContactInfo {
  phone: string;
  email?: string;
  whatsapp?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private navigationItemsSubject = new BehaviorSubject<NavigationItem[]>(this.getDefaultNavigation());
  private contactInfoSubject = new BehaviorSubject<ContactInfo>(this.getDefaultContactInfo());
  private socialLinksSubject = new BehaviorSubject<SocialLink[]>(this.getDefaultSocialLinks());

  navigationItems$ = this.navigationItemsSubject.asObservable();
  contactInfo$ = this.contactInfoSubject.asObservable();
  socialLinks$ = this.socialLinksSubject.asObservable();

  constructor() {}

  /**
   * Récupère la navigation par défaut
   */
  private getDefaultNavigation(): NavigationItem[] {
    return [
      {
        id: 'home',
        label: 'Accueil',
        route: '/',
        icon: 'home',
        visible: true
      },
      {
        id: 'box-internet',
        label: 'Box Internet',
        route: '/box-internet',
        icon: 'wifi',
        visible: true,
        children: [
          {
            id: 'adsl',
            label: 'ADSL',
            route: '/box-internet/adsl',
            visible: true
          },
          {
            id: 'fibre',
            label: 'Fibre',
            route: '/box-internet/fibre',
            badge: 'Nouveau',
            visible: true
          },
          {
            id: 'comparateur-box',
            label: 'Comparateur',
            route: '/box-internet/comparateur',
            visible: true
          }
        ]
      },
      {
        id: 'forfait-mobile',
        label: 'Forfait Mobile',
        route: '/forfait-mobile',
        icon: 'smartphone',
        visible: true,
        children: [
          {
            id: 'sans-engagement',
            label: 'Sans engagement',
            route: '/forfait-mobile/sans-engagement',
            visible: true
          },
          {
            id: '5g',
            label: 'Forfaits 5G',
            route: '/forfait-mobile/5g',
            badge: 'Populaire',
            visible: true
          },
          {
            id: 'pro-mobile',
            label: 'Forfaits Pro',
            route: '/forfait-mobile/pro',
            visible: true
          },
          {
            id: 'comparateur-mobile',
            label: 'Comparateur',
            route: '/forfait-mobile/comparateur',
            visible: true
          }
        ]
      },
      {
        id: 'test-debit',
        label: 'Test Débit',
        route: '/test-debit',
        icon: 'speed',
        visible: true
      },
      {
        id: 'actualites',
        label: 'Actualités',
        route: '/actualites',
        icon: 'news',
        visible: true
      },
      {
        id: 'freepro',
        label: 'FreePro',
        route: '/freepro',
        icon: 'business',
        visible: true
      },
      {
        id: 'gaz-electricite',
        label: 'Gaz & Électricité',
        route: '/gaz-electricite',
        icon: 'energy',
        visible: true
      },
      {
        id: 'gryv-corp',
        label: 'GRYV Corp',
        route: '/gryv-corp',
        icon: 'corporation',
        visible: true
      }
    ];
  }

  /**
   * Récupère les informations de contact par défaut
   */
  private getDefaultContactInfo(): ContactInfo {
    return {
      phone: '09 80 80 35 37',
      email: 'contact@zone-adsl-mobile.fr',
      whatsapp: '33980803537'
    };
  }

  /**
   * Récupère les liens sociaux par défaut
   */
  private getDefaultSocialLinks(): SocialLink[] {
    return [
      {
        name: 'WhatsApp',
        url: 'https://wa.me/33980803537',
        icon: 'whatsapp',
        color: '#25d366'
      },
      {
        name: 'Facebook',
        url: 'https://facebook.com/zoneadslmobile',
        icon: 'facebook',
        color: '#1877f2'
      },
      {
        name: 'YouTube',
        url: 'https://youtube.com/zoneadslmobile',
        icon: 'youtube',
        color: '#ff0000'
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/company/zoneadslmobile',
        icon: 'linkedin',
        color: '#0a66c2'
      }
    ];
  }

  /**
   * Met à jour les éléments de navigation
   */
  updateNavigation(items: NavigationItem[]): void {
    this.navigationItemsSubject.next(items);
  }

  /**
   * Met à jour les informations de contact
   */
  updateContactInfo(contact: ContactInfo): void {
    this.contactInfoSubject.next(contact);
  }

  /**
   * Met à jour les liens sociaux
   */
  updateSocialLinks(links: SocialLink[]): void {
    this.socialLinksSubject.next(links);
  }

  /**
   * Active/désactive un élément de navigation
   */
  toggleNavigationItem(itemId: string, visible: boolean): void {
    const currentItems = this.navigationItemsSubject.value;
    const updatedItems = this.updateItemVisibility(currentItems, itemId, visible);
    this.navigationItemsSubject.next(updatedItems);
  }

  /**
   * Fonction récursive pour mettre à jour la visibilité d'un élément
   */
  private updateItemVisibility(items: NavigationItem[], itemId: string, visible: boolean): NavigationItem[] {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, visible };
      }
      if (item.children) {
        return {
          ...item,
          children: this.updateItemVisibility(item.children, itemId, visible)
        };
      }
      return item;
    });
  }

  /**
   * Ajoute un badge à un élément de navigation
   */
  addBadgeToItem(itemId: string, badge: string): void {
    const currentItems = this.navigationItemsSubject.value;
    const updatedItems = this.updateItemBadge(currentItems, itemId, badge);
    this.navigationItemsSubject.next(updatedItems);
  }

  /**
   * Fonction récursive pour ajouter un badge
   */
  private updateItemBadge(items: NavigationItem[], itemId: string, badge: string): NavigationItem[] {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, badge };
      }
      if (item.children) {
        return {
          ...item,
          children: this.updateItemBadge(item.children, itemId, badge)
        };
      }
      return item;
    });
  }

  /**
   * Récupère un élément de navigation par son ID
   */
  getNavigationItem(itemId: string): NavigationItem | null {
    const items = this.navigationItemsSubject.value;
    return this.findItemById(items, itemId);
  }

  /**
   * Fonction récursive pour trouver un élément par ID
   */
  private findItemById(items: NavigationItem[], itemId: string): NavigationItem | null {
    for (const item of items) {
      if (item.id === itemId) {
        return item;
      }
      if (item.children) {
        const found = this.findItemById(item.children, itemId);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Filtre les éléments visibles
   */
  getVisibleNavigationItems(): Observable<NavigationItem[]> {
    return new Observable(observer => {
      this.navigationItems$.subscribe(items => {
        const visibleItems = items.filter(item => item.visible !== false);
        observer.next(visibleItems);
      });
    });
  }
}