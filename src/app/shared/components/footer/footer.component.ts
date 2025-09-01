import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/ApiService';

@Component({
  selector: 'app-footer',
  standalone: true,   // ✅ must have this
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  
	@Input() containerClass = "container";
	@Input() isBottomSticky = false;

	year: any;
  

}
