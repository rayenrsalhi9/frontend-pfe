import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, switchMap, map, filter } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { ArticleService } from "@app/shared/services/article.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-article-preview",
  templateUrl: "./article-preview.component.html",
  styleUrls: ["./article-preview.component.scss"],
})
export class ArticlePreviewComponent implements OnInit, OnDestroy {
  article: any = {};
  comment: string = "";
  user: any;
  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
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
        switchMap((id) => this.articleService.getArticle(id)),
      )
      .subscribe((data: any) => {
        this.article = data;
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

  addComment() {
    const text = (this.comment || "").trim();
    if (!text) return;

    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      this.articleService
        .addComment(this.article.id, { comment: text })
        .subscribe(
          (data: any) => {
            this.article.comments = data.comments;
            this.comment = "";
            this.cdr.markForCheck();
          },
          (error: any) => {
            console.error(error);
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
      if (confirm("Are you sure you want to delete this comment?")) {
        this.articleService.deleteComment(id).subscribe(
          (response: any) => {
            if (response?.success === true) {
              this.article.comments = this.article.comments.filter(
                (comment: any) => comment.id !== id,
              );
              this.cdr.markForCheck();
              this.toastr.success("Comment deleted successfully");
            } else {
              this.toastr.error(
                response?.message || "Failed to delete comment",
              );
            }
          },
          (error: any) => {
            console.error("Delete comment error:", error);
            this.toastr.error("An error occurred while deleting the comment");
          },
        );
      }
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }

  canDeleteComment(comment: any): boolean {
    if (!this.user) return false;
    if (comment.user?.email === this.user.email) return true;
    return this.securityService.hasClaim("ARTICLE_DELETE_COMMENT");
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
}
