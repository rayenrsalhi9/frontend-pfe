import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, EMPTY } from "rxjs";
import { takeUntil, switchMap, map, filter, catchError } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { ArticleService } from "@app/shared/services/article.service";
import { BsModalService } from "ngx-bootstrap/modal";
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
      if (confirm(this.translate.instant("article.deleteComment.confirm"))) {
        this.articleService.deleteComment(id).subscribe(
          (response: any) => {
            if (response?.success === true) {
              this.article.comments = this.article.comments.filter(
                (comment: any) => comment.id !== id,
              );
              this.cdr.markForCheck();
              this.toastr.success(
                this.translate.instant("article.deleteComment.success"),
              );
            } else {
              this.toastr.error(
                response?.message ||
                  this.translate.instant("article.deleteComment.failure"),
              );
            }
          },
          (error: any) => {
            console.error("Delete comment error:", error);
            this.toastr.error(
              this.translate.instant("article.deleteComment.failure"),
            );
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
    if (!(navigator.clipboard && navigator.clipboard.writeText)) {
      this.toastr.error(this.translate.instant("article.copyLink.unsupported"));
      return;
    }
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.toastr.success(this.translate.instant("article.copyLink.success"));
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        this.toastr.error(
          this.translate.instant("article.copyLink.unsupported"),
        );
      });
  }
}
