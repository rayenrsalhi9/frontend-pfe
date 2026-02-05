import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleCategoryService } from '@app/shared/services/article-category.service';
import { ArticleService } from '@app/shared/services/article.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ArticlesCategoriesComponent } from '../articles-categories/articles-categories.component';
import { ArticlesViewsComponent } from '../articles-views/articles-views.component';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { environment } from 'src/environments/environment';
import { ArticleResource } from '@app/shared/enums/article-resource';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from '@app/core/security/security.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {

  showMobilePanel = false

  rows: any[] = [];
  selected = [];
  categories:any[] =[];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  articleResource:ArticleResource
  bsModalRef: BsModalRef;

  //currentUser:any

  constructor(
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private cdr: ChangeDetectorRef,
    private securityService: SecurityService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.articleResource = new ArticleResource();
    this.articleResource.orderBy = 'createdAt desc'
    this.articleResource.createdAt = ''
   }

  ngOnInit(): void {

    //this.currentUser = this.securityService.getUserDetail().user;

    this.getArtilces()
    this.getCategories()
  }

  getHost() {
    return environment.apiUrl
  }


  getArtilces(data = this.articleResource) {
    this.articleService.allArticles(data).subscribe(
      (data: any) => {
        this.rows = data
        this.cdr.markForCheck()
      }
    )
  }

  getCategories() {
    this.articleCategoryService.allCategories().subscribe(
      (data:any)=>{
        this.categories = data
        this.cdr.markForCheck()
      },
      error=>{

      }
    )
  }

  viewArticle(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent, { initialState: initialState })
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
  }

  updateArticle(data: any) {
  }

  deleteArticle(data: any) {

    this.translate.get('ARTICLES.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });
    });

    this.bsModalRef.content.onClose.subscribe(result => {
      if (result) {
        this.articleService.deleteArticle(data.id).subscribe(
          (data: any) => {
            this.translate.get('ARTICLES.DELETE.TOAST.ARTICLE_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {this.toastr.success(translatedMessage); });
            this.getArtilces()
          }
        )

      }
    })

  }

  onNameChange(event: any) {
    let val = event.target.value
    if (val) {
      this.articleResource.name = val;
    } else {
      this.articleResource.name = '';
    }
    this.articleResource.skip = 0;
    this.getArtilces(this.articleResource);
  }

  onCategoryChange(event: any) {
    if (event) {
      this.articleResource.articleCategoryId = event;
    } else {
      this.articleResource.articleCategoryId = '';
    }
    this.articleResource.skip = 0;
    this.getArtilces(this.articleResource);
  }

  onDateChange(event: any) {
    if (event) {
      this.articleResource.createdAt = new Date(event).toDateString();
    } else {
      this.articleResource.createdAt = '';
    }
    this.articleResource.skip = 0;
    this.getArtilces(this.articleResource);
  }

}
