import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, of } from "rxjs";
import { takeUntil, switchMap, map, filter } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { ForumService } from "@app/views/apps/forum/forum.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
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

  constructor(
    private forumService: ForumService,
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private modalService: BsModalService,
    private toastr: ToastrService,
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
        switchMap((id) => this.forumService.getForum(id)),
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

    if (currentUser) {
      this.user = JSON.parse(currentUser).user;
    } else if (guestUser) {
      this.user = JSON.parse(guestUser);
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
      // Show confirmation dialog
      if (confirm("Are you sure you want to delete this comment?")) {
        this.forumService.deleteComment(id).subscribe(
          (response: any) => {
            if (response.success) {
              // Remove comment from local array
              this.forum.comments = this.forum.comments.filter(
                (comment: any) => comment.id !== id,
              );
              this.cdr.markForCheck();

              // Show success message
              this.toastr.success("Comment deleted successfully");
            } else {
              this.toastr.error(response.message || "Failed to delete comment");
            }
          },
          (error: any) => {
            console.error("Delete comment error:", error);
            this.toastr.error("An error occurred while deleting the comment");
          },
        );
      }
    } else {
      console.log(false);
      this.modalService.show(SusbcribeModalComponent);
    }
  }

  // Check if user can delete a comment
  canDeleteComment(comment: any): boolean {
    if (!this.user) return false;

    // User can delete their own comments
    if (comment.user.email === this.user.email) {
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
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.toastr.success("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  }
}
