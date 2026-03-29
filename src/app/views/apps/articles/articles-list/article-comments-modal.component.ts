import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ArticleService } from "@app/shared/services/article.service";
import { takeUntil } from "rxjs/operators";
import { CommentsModalBaseComponent } from "../../shared/comments-modal-base.component";

@Component({
  selector: "app-article-comments-modal",
  templateUrl: "./article-comments-modal.component.html",
  styleUrls: ["../../shared/comments-modal.css"],
})
export class ArticleCommentsModalComponent
  extends CommentsModalBaseComponent
  implements OnInit, OnDestroy
{
  articleId!: string;
  articleTitle!: string;

  article: any = null;
  onCommentsChanged?: () => void;

  constructor(
    public bsModalRef: BsModalRef,
    protected translateService: TranslateService,
    private articleService: ArticleService,
    protected toastr: ToastrService,
    protected cdr: ChangeDetectorRef,
  ) {
    super(bsModalRef, translateService, toastr, cdr);
  }

  loadData(): void {
    if (!this.articleId) {
      this.translateService
        .get("ARTICLES.ERRORS.ID_MISSING")
        .pipe(takeUntil(this.destroy$))
        .subscribe((msg: string) => {
          this.errorMessage = msg;
          this.cdr.markForCheck();
        });
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.articleService
      .getArticle(this.articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.article = resp;
          this.comments = Array.isArray(resp?.comments) ? resp.comments : [];
          this.canDeleteComments = !!(
            resp?.canDeleteComments ?? resp?.can_delete_comments
          );

          this.loading = false;
          this.cdr.markForCheck();
        },
        (err) => this.handleError(err, "ARTICLES.ERRORS.LOAD_FAILED"),
      );
  }

  protected executeDelete(comment: any): void {
    this.articleService
      .deleteComment(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          if (resp?.success === false) {
            this.handleError(
              { error: { message: resp?.message } },
              "ARTICLES.DELETE_COMMENT.TOAST.DELETED_ERROR",
            );
            return;
          }

          this.comments = (this.comments || []).filter(
            (c) => c?.id !== comment.id,
          );
          this.handleSuccess(
            "ARTICLES.DELETE_COMMENT.TOAST.DELETED_SUCCESSFULLY",
            this.onCommentsChanged,
          );
        },
        (err) => {
          this.handleError(err, "ARTICLES.DELETE_COMMENT.TOAST.DELETED_ERROR");
        },
      );
  }
}
