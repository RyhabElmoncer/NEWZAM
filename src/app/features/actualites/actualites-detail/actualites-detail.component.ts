import {Component, HostListener} from '@angular/core';
import {Post} from '../../../core/models/post';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../core/services/ApiService';
import {ModalService} from '../../../core/services/modal.service';
import {UtilsService} from '../../../core/services/utils.service';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-actualites-detail',

  templateUrl: './actualites-detail.component.html',
  imports: [
    DatePipe,
    NgIf
  ],
  styleUrls: ['./actualites-detail.component.scss']
})
export class ActualitesDetailComponent {
  post!: Post;
  loaded = false;
  firstLoad = false;
  toggle = false;


  constructor(public activeRoute: ActivatedRoute, private apiService: ApiService, public utilsService: UtilsService, private modalService: ModalService) {
    this.activeRoute.params.subscribe(params => {
      this.loaded = false;

      this.apiService.getSingleNews(params['id']).subscribe(result => {
        this.post = result;
        this.utilsService.scrollToPageContent();
        if (!this.firstLoad) {
          this.firstLoad = true;
        }

        this.loaded = true;
      });
    });
  }


  @HostListener('window:resize', ['$event'])
  resizeHandler(event: Event) {
    this.resizeHandle()
  }


  resizeHandle() {
    if (window.innerWidth < 992)
      this.toggle = true;
    else
      this.toggle = false;
  }






}
