import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, switchMap, map, filter, take } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { BlogService } from "@app/views/apps/blog/blog.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blog-preview",
  templateUrl: "./blog-preview.component.html",
  styleUrls: ["./blog-preview.component.scss"],
})
export class BlogPreviewComponent implements OnInit, OnDestroy {
  blog: any = {};
  comment: any;
  user: any;
  private destroy$ = new Subject<void>();
  private modalRef: BsModalRef | null = null;

  constructor(
    private blogService: BlogService,
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
        takeUntil(this.destroy$),
        map((params) => params.get("id")),
        filter((id) => !!id),
        switchMap((id) => this.blogService.getBlog(id)),
      )
      .subscribe((data: any) => {
        this.blog = data;
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

    if (type === "up" && this.blog.reactionsUp?.length) {
      return this.blog.reactionsUp.some(checkReaction);
    } else if (type === "down" && this.blog.reactionsDown?.length) {
      return this.blog.reactionsDown.some(checkReaction);
    }
    return false;
  }

  copyLink() {
    if (!navigator.clipboard) {
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

  addReaction(reaction) {
    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      this.blogService.reactionBlog(this.blog.id, { type: reaction }).subscribe(
        (data: any) => {
          this.blog.reactionsUp = data.reactionsUp;
          this.blog.reactionsDown = data.reactionsDown;
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
      this.blogService
        .commentBlog(this.blog.id, { comment: this.comment })
        .subscribe(
          (data: any) => {
            this.blog.comments = data.comments;
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
        title: this.translate.instant("PREVIEW.BLOG.COMMENT.DELETE_CONFIRM.TITLE"),
        message: this.translate.instant("PREVIEW.BLOG.COMMENT.DELETE_CONFIRM.MESSAGE"),
        button: {
          cancel: this.translate.instant("PREVIEW.BLOG.COMMENT.DELETE_CONFIRM.CANCEL"),
          confirm: this.translate.instant("PREVIEW.BLOG.COMMENT.DELETE_CONFIRM.CONFIRM"),
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
    this.blogService.deleteComment(id).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.blog.comments = response;
          this.cdr.markForCheck();
          this.toastr.success(
            this.translate.instant("PREVIEW.BLOG.DELETE_TOAST.SUCCESS"),
          );
        } else {
          this.toastr.error(
            response.friendlyMessage ||
              response.messages?.[0] ||
              this.translate.instant("PREVIEW.BLOG.DELETE_TOAST.ERROR"),
          );
        }
      },
      error: (err: any) => {
        this.toastr.error(
          err?.friendlyMessage ||
            err?.messages?.[0] ||
            this.translate.instant("PREVIEW.BLOG.DELETE_TOAST.ERROR"),
        );
      },
    });
  }

  canDeleteComment(comment: any): boolean {
    if (!this.user) return false;

    if (comment.user?.email === this.user.email) {
      return true;
    }

    return this.securityService.hasClaim("BLOG_DELETE_COMMENT");
  }
}
