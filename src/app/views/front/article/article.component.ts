import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ArticleService } from "@app/shared/services/article.service";
import { ArticlesViewsComponent } from "@app/views/apps/articles/articles-views/articles-views.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { Article } from "@app/shared/models/article.model";
import { environment } from "src/environments/environment";
import { RtlService } from "@app/core/rtl.service";

@Component({
  selector: "app-article",
  templateUrl: "./article.component.html",
  styleUrls: ["./article.component.scss"],
})
export class ArticleComponent implements OnInit, OnDestroy {
  articles: Article[] | null = null;
  isRtl = false;
  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private rtlService: RtlService,
  ) {}

  ngOnInit(): void {
    this.rtlService.getIsRtl$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRtl: boolean) => {
      this.isRtl = isRtl;
    });
    this.getArticles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getArticles() {
    this.articleService.allArticles().subscribe({
      next: (data: any) => {
        this.articles = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des articles:", error);
        this.articles = [];
        this.cdr.markForCheck();
      },
    });
  }

  getHost() {
    return environment.apiUrl;
  }

  viewArticle(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent, {
      initialState: initialState,
    });
  }
}
