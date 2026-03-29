import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ForumService } from "../forum.service";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-forum-comments-modal",
  templateUrl: "./forum-comments-modal.component.html",
  styleUrls: ["../../shared/comments-modal.css"],
})
export class ForumCommentsModalComponent implements OnInit, OnDestroy {
  forumId: string;
  forumTitle: string;

  onCommentsChanged?: () => void;

  loading = false;
  errorMessage: string | null = null;

  forum: any = null;
  comments: any[] = [];

  canDeleteComments = false;
  confirmingDeleteId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public bsModalRef: BsModalRef,
    private translateService: TranslateService,
    private forumService: ForumService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadForum();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadForum(): void {
    if (!this.forumId) {
      this.errorMessage = "Forum id is missing.";
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.forumService
      .getForum(this.forumId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.forum = resp;
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
    if (!this.canDeleteComments || !comment?.id) return;

    this.confirmingDeleteId = comment.id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(comment: any): void {
    if (!comment?.id || !this.canDeleteComments) return;
    this.executeDelete(comment);
  }

  private executeDelete(comment: any): void {
    this.forumService
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
            .get("FORUM.DELETE_COMMENT.TOAST.DELETED_SUCCESSFULLY")
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
