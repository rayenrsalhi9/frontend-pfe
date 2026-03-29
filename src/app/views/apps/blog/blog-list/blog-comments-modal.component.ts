import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { BlogService } from "../blog.service";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-blog-comments-modal",
  templateUrl: "./blog-comments-modal.component.html",
  styleUrls: ["./blog-comments-modal.component.css"],
})
export class BlogCommentsModalComponent implements OnInit, OnDestroy {
  blogId: string;
  blogTitle: string;

  onCommentsChanged?: () => void;

  loading = false;
  errorMessage: string | null = null;

  blog: any = null;
  comments: any[] = [];

  canDeleteComments = false;
  confirmingDeleteId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public bsModalRef: BsModalRef,
    private translateService: TranslateService,
    private blogService: BlogService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadBlog();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBlog(): void {
    if (!this.blogId) {
      this.errorMessage = "Blog id is missing.";
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.blogService
      .getBlog(this.blogId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.blog = resp;
          this.comments = Array.isArray(resp?.comments) ? resp.comments : [];
          this.canDeleteComments = !!(
            resp?.canDeleteComments ?? resp?.can_delete_comments
          );

          this.loading = false;
          this.cdr.markForCheck();
        },
        (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || "Failed to load comments.";
          this.cdr.markForCheck();
        },
      );
  }

  deleteComment(comment: any): void {
    if (!this.canDeleteComments) return;
    if (!comment?.id) return;

    this.confirmingDeleteId = comment.id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(comment: any): void {
    this.executeDelete(comment);
  }

  private executeDelete(comment: any): void {
    this.blogService
      .deleteComment(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          if (resp?.success === false) {
            this.toastr.error(resp?.message || "Failed to delete comment.");
            return;
          }

          this.comments = (this.comments || []).filter(
            (c) => c?.id !== comment.id,
          );
          this.confirmingDeleteId = null;

          if (this.onCommentsChanged) {
            this.onCommentsChanged();
          }

          this.translateService
            .get("BLOG.DELETE_COMMENT.TOAST.DELETED_SUCCESSFULLY")
            .pipe(takeUntil(this.destroy$))
            .subscribe((msg: string) =>
              this.toastr.success(msg || "Comment deleted."),
            );

          this.cdr.markForCheck();
        },
        (err) => {
          const msg = err?.error?.message || "Failed to delete comment.";
          this.toastr.error(msg);
        },
      );
  }

  close(): void {
    this.bsModalRef.hide();
  }
}
