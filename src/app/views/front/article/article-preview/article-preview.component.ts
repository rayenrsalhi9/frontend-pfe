import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, EMPTY } from "rxjs";
import { takeUntil, switchMap, map, filter, catchError } from "rxjs/operators";
import { ArticleService } from "@app/shared/services/article.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-article-preview",
  templateUrl: "./article-preview.component.html",
  styleUrls: ["./article-preview.component.scss"],
})
export class ArticlePreviewComponent implements OnInit, OnDestroy {
  article: any = {};
  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  getHost() {
    return environment.apiUrl;
  }

  ngOnInit(): void {
    this.activeRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params.get("id")),
        filter((id) => !!id),
        switchMap((id) =>
          this.articleService.getArticle(id).pipe(catchError(() => EMPTY)),
        ),
      )
      .subscribe({
        next: (data: any) => {
          this.article = data;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  copyLink() {
    if (!(navigator.clipboard && navigator.clipboard.writeText)) {
      this.toastr.error(
        this.translate.instant("ARTICLES.COPY_LINK.UNSUPPORTED"),
      );
      return;
    }
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.toastr.success(
          this.translate.instant("ARTICLES.COPY_LINK.SUCCESS"),
        );
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        this.toastr.error(
          this.translate.instant("ARTICLES.COPY_LINK.UNSUPPORTED"),
        );
      });
  }
}
