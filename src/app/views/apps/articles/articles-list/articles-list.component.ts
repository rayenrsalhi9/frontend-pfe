import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, of } from "rxjs";
import {
  debounceTime,
  switchMap,
  catchError,
  tap,
  takeUntil,
} from "rxjs/operators";
import { ArticleCategoryService } from "@app/shared/services/article-category.service";
import { ArticleService } from "@app/shared/services/article.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ArticlesViewsComponent } from "../articles-views/articles-views.component";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { environment } from "src/environments/environment";
import { ArticleResource } from "@app/shared/enums/article-resource";
import { TranslateService } from "@ngx-translate/core";
import { SecurityService } from "@app/core/security/security.service";

@Component({
  selector: "app-articles-list",
  templateUrl: "./articles-list.component.html",
  styleUrls: ["./articles-list.component.css"],
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  showMobilePanel = false;

  rows: any[] = [];
  selected = [];
  categories: any[] = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  articleResource: ArticleResource;
  bsModalRef: BsModalRef;
  searchSubject: Subject<void> = new Subject<void>();
  private destroy$ = new Subject<void>();

  currentUser: any;

  constructor(
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private cdr: ChangeDetectorRef,
    private securityService: SecurityService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.articleResource = new ArticleResource();
    this.articleResource.orderBy = "createdAt desc";
    this.articleResource.createdAt = "";
  }

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail().user;

    this.searchSubject
      .pipe(
        debounceTime(300),
        tap(() => this.cdr.detectChanges()),
        switchMap(() =>
          this.articleService.allArticles(this.articleResource).pipe(
            catchError((err) => {
              console.error(err);
              return of([]);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((data: any) => {
        this.rows = data;
        this.cdr.markForCheck();
      });
    this.searchSubject.next();
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getHost() {
    return environment.apiUrl;
  }

  getArtilces(data = this.articleResource) {
    this.articleResource = data;
    this.searchSubject.next();
  }

  getCategories() {
    this.articleCategoryService.allCategories().subscribe(
      (data: any) => {
        this.categories = data;
        this.cdr.markForCheck();
      },
      (error) => {
        console.log(`Error fetching categories:`, error);
      },
    );
  }

  viewArticle(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent, {
      initialState: initialState,
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  deleteArticle(data: any) {
    this.translate.get("ARTICLES.DELETE.LABEL").subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        class: "modal-confirm-custom",
        initialState: {
          title: translations.TITLE,
          message: translations.MESSAGE,
          button: {
            cancel: translations.BUTTON.CANCEL,
            confirm: translations.BUTTON.CONFIRM,
          },
        },
      });

      this.bsModalRef.content.onClose.subscribe((result) => {
        if (result) {
          this.articleService.deleteArticle(data.id).subscribe(() => {
            this.translate
              .get("ARTICLES.DELETE.TOAST.ARTICLE_DELETED_SUCCESSFULLY")
              .subscribe((translatedMessage: string) => {
                this.toastr.success(translatedMessage);
              });
            this.getArtilces();
          });
        }
      });
    });
  }

  onNameChange(event: any) {
    const val = event.target.value;
    this.articleResource.name = val ? val : "";
    this.articleResource.skip = 0;
    this.searchSubject.next();
  }

  onCategoryChange(event: any) {
    if (event) {
      this.articleResource.articleCategoryId = event;
    } else {
      this.articleResource.articleCategoryId = "";
    }
    this.articleResource.skip = 0;
    this.getArtilces(this.articleResource);
  }

  onDateChange(event: any) {
    if (event) {
      this.articleResource.createdAt = new Date(event).toDateString();
    } else {
      this.articleResource.createdAt = "";
    }
    this.articleResource.skip = 0;
    this.getArtilces(this.articleResource);
  }

  hasAnyArticleActions(row: any): boolean {
    const isOwner = row.createdBy === this.currentUser?.id;
    const hasViewClaim = this.securityService.hasClaim("ARTICLE_VIEW_ARTICLES");
    const hasEditClaim = this.securityService.hasClaim("ARTICLE_EDIT_ARTICLE");
    const hasDeleteClaim = this.securityService.hasClaim(
      "ARTICLE_DELETE_ARTICLE",
    );

    return hasViewClaim || (isOwner && (hasEditClaim || hasDeleteClaim));
  }
}
