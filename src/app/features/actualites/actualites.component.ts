import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Ajouter
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/ApiService';
import { UtilsService } from '../../core/services/utils.service';
import { ModalService } from '../../core/services/modal.service';
import { Post } from '../../core/models/post';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-actualites',
  standalone: true, // <-- composant standalone
  imports: [
    CommonModule, // <-- indispensable pour *ngIf, *ngFor
    RouterLink,
    DatePipe
  ],
  templateUrl: './actualites.component.html',
  styleUrls: ['./actualites.component.scss']
})
export class ActualitesComponent implements OnInit {
  @Input() fullWidth = false;
  @Input() imageSize = 4;

  posts: Post[] = [];
  totalCount = 0;
  loaded = false;
  toggle = false;
  firstLoad = false;
  keySearch = "";
  itemsPerPage = 10;
  page: number = 1; // <-- initialisé pour TS2564


  predicate = "date";
  ascending = "desc";

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public activeRoute: ActivatedRoute,
    protected router: Router,
    private apiService: ApiService,
    public utilsService: UtilsService,
  ) {
    this.activeRoute.queryParams.subscribe(param => this.loadData(param));
  }

  ngOnInit(): void {
    this.titleService.setTitle('Comparatif forfaits mobiles et box internet | Zone Adsl Mobile');
    this.metaService.updateTag({
      name: 'description',
      content: 'Comparez les forfaits mobiles, les offres fibre et les box internet avec Zone ADSL Mobile. Trouvez les meilleures offres adaptées à vos besoins et à votre budget.'
    });
    this.resizeHandle();
  }

  @HostListener('window:resize', ['$event'])
  resizeHandler() {
    this.resizeHandle();
  }

  resizeHandle() {
    this.toggle = window.innerWidth < 992;
  }



  trackByFn(index: number, item: any) {
    return item?.slug || index;
  }


  transition(page?: number) {
    this.page = page || this.page || 1;
    this.loadData({ page: this.page, searchTerm: this.keySearch });
  }

  private loadData(param: any) {
    this.loaded = false;
    this.page = param.page ? Number(param.page) : 1;
    const searchTerm = param.searchTerm?.toLowerCase();

    const request = searchTerm ?
      this.apiService.searchFrontOfficeNews({ page: this.page - 1, size: this.itemsPerPage, sort: this.sort() }, { attribute: searchTerm }) :
      this.apiService.fetchNewsData({ page: this.page - 1, size: this.itemsPerPage, sort: this.sort() });

    request.subscribe(result => {
      this.posts = result.body;
      this.totalCount = Number(result.headers.get('X-Total-Count'));
      this.loaded = true;
      if (!this.firstLoad) this.firstLoad = true;
      this.utilsService.scrollToPageContent();
    });
  }

  private sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'desc' : 'asc')];
    if (this.predicate !== 'date') result.push('date');
    return result;
  }


}
