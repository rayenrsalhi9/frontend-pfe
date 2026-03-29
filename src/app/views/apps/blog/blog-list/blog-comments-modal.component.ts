import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { BlogService } from "../blog.service";
import { takeUntil } from "rxjs/operators";
import { CommentsModalBaseComponent } from "../../shared/comments-modal-base.component";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    picture?: string;
  };
}

export interface BlogResponse {
  id: string;
  title: string;
  comments?: Comment[];
  canDeleteComments?: boolean;
  can_delete_comments?: boolean;
}

@Component({
  selector: "app-blog-comments-modal",
  templateUrl: "./blog-comments-modal.component.html",
  styleUrls: ["../../shared/comments-modal.css"],
})
export class BlogCommentsModalComponent
  extends CommentsModalBaseComponent
  implements OnInit, OnDestroy
{
  blogId: string;
  blogTitle: string;

  blog: BlogResponse | null = null;
  onCommentsChanged?: () => void;

  constructor(
    public bsModalRef: BsModalRef,
    protected translateService: TranslateService,
    private blogService: BlogService,
    protected toastr: ToastrService,
    protected cdr: ChangeDetectorRef,
  ) {
    super(bsModalRef, translateService, toastr, cdr);
  }

  loadData(): void {
    if (!this.blogId) {
      this.translateService
        .get("BLOG.ERRORS.ID_MISSING")
        .pipe(takeUntil(this.destroy$))
        .subscribe((msg: string) => {
          this.errorMessage = msg;
          this.cdr.markForCheck();
        });
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.blogService
      .getBlog(this.blogId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          const resp = data as BlogResponse;
          this.blog = resp;
          this.comments = Array.isArray(resp?.comments) ? resp.comments : [];
          this.canDeleteComments = !!(
            resp?.canDeleteComments ?? resp?.can_delete_comments
          );

          this.loading = false;
          this.cdr.markForCheck();
        },
        (err) => this.handleError(err, "BLOG.TABLE.LOAD_ERROR"),
      );
  }

  protected executeDelete(comment: any): void {
    this.blogService
      .deleteComment(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          if (resp?.success === true) {
            this.comments = (this.comments || []).filter(
              (c) => c?.id !== comment.id,
            );
            this.handleSuccess(
              "BLOG.DELETE_COMMENT.TOAST.DELETED_SUCCESSFULLY",
              this.onCommentsChanged,
            );
          } else {
            this.handleError(
              { error: { message: resp?.message } },
              "BLOG.DELETE_COMMENT.TOAST.DELETED_ERROR",
            );
          }
        },
        (err) => {
          this.handleError(err, "BLOG.DELETE_COMMENT.TOAST.DELETED_ERROR");
        },
      );
  }
}
