import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { ForumService } from '../forum.service';

@Component({
  selector: 'app-forum-comments-modal',
  templateUrl: './forum-comments-modal.component.html',
  styleUrls: ['./forum-comments-modal.component.css']
})
export class ForumCommentsModalComponent implements OnInit {
  forumId: string;
  forumTitle: string;

  onCommentsChanged?: () => void;

  loading = false;
  errorMessage: string | null = null;

  forum: any = null;
  comments: any[] = [];

  canDeleteComments = false;

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private forumService: ForumService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadForum();
  }

  loadForum(): void {
    if (!this.forumId) {
      this.errorMessage = 'Forum id is missing.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.forumService.getForum(this.forumId).subscribe(
      (resp: any) => {
        this.forum = resp;
        this.comments = Array.isArray(resp?.comments) ? resp.comments : [];
        this.canDeleteComments = !!(resp?.canDeleteComments ?? resp?.can_delete_comments);

        this.loading = false;
        this.cdr.markForCheck();
      },
      (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to load comments.';
        this.cdr.markForCheck();
      }
    );
  }

  deleteComment(comment: any): void {
    if (!this.canDeleteComments) return;
    if (!comment?.id) return;

    this.translateService.get('FORUM.DELETE_COMMENT.LABEL').subscribe((translations) => {
      const confirmModalRef = this.modalService.show(ConfirmModalComponent, {
        class: 'modal-confirm-custom',
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });

      confirmModalRef.content.onClose.subscribe((result: boolean) => {
        if (result) {
          this.executeDelete(comment);
        }
      });
    });
  }

  private executeDelete(comment: any): void {
    this.forumService.deleteComment(comment.id).subscribe(
      (resp: any) => {
        if (resp?.success === false) {
          this.toastr.error(resp?.message || 'Failed to delete comment.');
          return;
        }

        this.comments = (this.comments || []).filter((c) => c?.id !== comment.id);

        if (this.onCommentsChanged) {
          this.onCommentsChanged();
        }

        this.translateService.get('FORUM.DELETE_COMMENT.TOAST.DELETED_SUCCESSFULLY')
          .subscribe((msg: string) => this.toastr.success(msg || 'Comment deleted.'));
        
        this.cdr.markForCheck();
      },
      (err) => {
        const msg = err?.error?.message || 'Failed to delete comment.';
        this.toastr.error(msg);
      }
    );
  }

  close(): void {
    this.bsModalRef.hide();
  }
}
