import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, of } from "rxjs";
import { takeUntil, switchMap, map, filter, take } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { ForumService } from "@app/views/apps/forum/forum.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-forum-preview",
  templateUrl: "./forum-preview.component.html",
  styleUrls: ["./forum-preview.component.scss"],
})
export class ForumPreviewComponent implements OnInit, OnDestroy {
  forum: any = {};
  comment: any;
  user: any;
  private destroy$ = new Subject<void>();
  private modalRef: BsModalRef | null = null;

  constructor(
    private forumService: ForumService,
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  getHost() {
    return environment.apiUrl;
  }

  ngOnInit(): void {
    this.activeRoute.paramMap
      .pipe(
        map((params) => params.get("id")),
        filter((id) => !!id),
        switchMap((id) => this.forumService.getForum(id)),
        takeUntil(this.destroy$),
      )
      .subscribe((data: any) => {
        this.forum = data;
        this.cdr.markForCheck();
      });

    this.getUserInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInfo() {
    const currentUser = localStorage.getItem("currentUser");
    const guestUser = localStorage.getItem("guestUser");

    let parsedCurrentUser: any = null;
    let parsedGuestUser: any = null;

    if (currentUser) {
      try {
        parsedCurrentUser = JSON.parse(currentUser);
      } catch (e) {
        console.error("Invalid currentUser JSON", e);
      }
    }

    if (guestUser) {
      try {
        parsedGuestUser = JSON.parse(guestUser);
      } catch (e) {
        console.error("Invalid guestUser JSON", e);
      }
    }

    if (parsedCurrentUser?.user) {
      this.user = parsedCurrentUser.user;
    } else if (parsedGuestUser) {
      this.user = parsedGuestUser;
    }
  }

  addReaction(reaction) {
    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      this.forumService
        .reactionForum(this.forum.id, { type: reaction })
        .subscribe(
          (data: any) => {
            this.forum.reactionsUp = data.reactionsUp;
            this.forum.reactionsHeart = data.reactionsHeart;
            this.forum.reactionsDown = data.reactionsDown;
          },
          (error: any) => {
            console.log(error);
          },
        );
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }

  addComment() {
    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      this.forumService
        .commentForum(this.forum.id, { comment: this.comment })
        .subscribe(
          (data: any) => {
            console.log(data);
            this.forum.comments = data.comments;
            this.comment = "";
            this.cdr.markForCheck();
          },
          (error: any) => {
            console.log(error);
          },
        );
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }

  deleteComment(id: string) {
    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      const initialState = {
        title: this.translate.instant("PREVIEW.FORUM.COMMENT.DELETE_CONFIRM.TITLE"),
        message: this.translate.instant("PREVIEW.FORUM.COMMENT.DELETE_CONFIRM.MESSAGE"),
        button: {
          cancel: this.translate.instant("PREVIEW.FORUM.COMMENT.DELETE_CONFIRM.CANCEL"),
          confirm: this.translate.instant("PREVIEW.FORUM.COMMENT.DELETE_CONFIRM.CONFIRM"),
        },
      };

      this.modalRef = this.modalService.show(ConfirmModalComponent, {
        initialState,
        class: "modal-dialog-centered",
        backdrop: "static",
        keyboard: false,
      });

      if (this.modalRef) {
        this.modalRef.content.onClose.pipe(take(1)).subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.confirmDeleteComment(id);
          }
        });
      }
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }

  private confirmDeleteComment(id: string): void {
    this.forumService.deleteComment(id).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.forum.comments = this.forum.comments.filter((c: any) => c.id !== id);
          this.cdr.markForCheck();
          this.toastr.success(
            this.translate.instant("PREVIEW.FORUM.DELETE_TOAST.SUCCESS"),
          );
        } else {
          this.toastr.error(
            response?.message ||
              response?.friendlyMessage ||
              this.translate.instant("PREVIEW.FORUM.DELETE_TOAST.ERROR"),
          );
        }
      },
      error: (err: any) => {
        this.toastr.error(
          err?.error?.message ||
            err?.friendlyMessage ||
            err?.messages?.[0] ||
            this.translate.instant("PREVIEW.FORUM.DELETE_TOAST.ERROR"),
        );
      },
    });
  }

  // Check if user can delete a comment
  canDeleteComment(comment: any): boolean {
    if (!this.user) return false;

    // User can delete their own comments
    if (comment.user?.email === this.user.email) {
      return true;
    }

    // Check if user has admin permission
    return this.securityService.hasClaim("FORUM_DELETE_COMMENT");
  }

  hasReacted(type: string): boolean {
    if (!this.user) return false;

    const checkReaction = (r: any) => {
      if (typeof r === "string")
        return r === this.user.id || r === this.user.email;
      return (
        r?.user?.id === this.user.id ||
        r?.user?.email === this.user.email ||
        r?.id === this.user.id
      );
    };

    if (type === "up" && this.forum.reactionsUp?.length) {
      return this.forum.reactionsUp.some(checkReaction);
    } else if (type === "down" && this.forum.reactionsDown?.length) {
      return this.forum.reactionsDown.some(checkReaction);
    } else if (type === "heart" && this.forum.reactionsHeart?.length) {
      return this.forum.reactionsHeart.some(checkReaction);
    }
    return false;
  }

  copyLink() {
    if (!(navigator.clipboard && navigator.clipboard.writeText)) {
      this.toastr.error("Could not copy link — please copy manually");
      return;
    }
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.toastr.success("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        this.toastr.error("Could not copy link — please copy manually");
      });
  }
}
