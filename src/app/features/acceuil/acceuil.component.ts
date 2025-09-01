import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubliciteComponent } from '../../shared/components/publicite/publicite.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [
    CommonModule,
    PubliciteComponent,
    RouterLink
  ],
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  initAnimations(): void {
    // Observer pour les animations au défilement
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animationName = element.getAttribute('aniName') || 'fadeInUp';

          element.classList.add('animate__animated', `animate__${animationName}`);

          // Une fois l'animation déclenchée, on peut arrêter d'observer
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observer tous les éléments avec l'attribut contentAnim
    const animatedElements = document.querySelectorAll('[contentAnim]');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }
}
