import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { ArticleService } from "@app/shared/services/article.service";
import { UserService } from "@app/shared/services/user.service";
import { ArticlesViewsComponent } from "@app/views/apps/articles/articles-views/articles-views.component";

import { BlogService } from "@app/views/apps/blog/blog.service";
import { ForumService } from "@app/views/apps/forum/forum.service";
import { SurveyService } from "@app/views/apps/survey/survey.service";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent implements OnInit {
  latestBlogs = [];
  latestForums = [];
  articles: any[] = [];
  survey = null;
  errorMessage: string = "";
  bsModalRef: BsModalRef;
  selectedRating: number = 0;
  isAuthenticated$: Observable<boolean | null>;
  userName$: Observable<string | null>;
  hostBase: string;

  constructor(
    private blogService: BlogService,
    private userService: UserService,
    private forumService: ForumService,
    private cdr: ChangeDetectorRef,
    private securityService: SecurityService,
    private surveyService: SurveyService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private articleService: ArticleService,
  ) {}

  ngOnInit(): void {
    this.hostBase = environment.apiUrl;

    this.isAuthenticated$ = this.securityService.SecurityObject.pipe(
      map((auth) => {
        if (auth === undefined) return null;
        if (auth === null) return false;
        return !!auth?.user?.userName && !!auth?.authorisation?.token;
      }),
    );

    this.userName$ = this.securityService.SecurityObject.pipe(
      map((auth) => {
        if (auth && auth?.user?.userName) {
          return auth.user.firstName || auth.user.userName;
        }
        return null;
      }),
    );

    this.getLatestBlogs();
    this.getLastForums();
    this.getLatestSurvey();
    this.loadPublicArticles();
  }

  loadPublicArticles(): void {
    this.userService.getArticles().subscribe(
      (data: any) => {
        this.articles = data;
      },
      (error) => {
        this.errorMessage = this.translate.instant(
          "WELCOME.ARTICLE_LOAD_ERROR",
        );
        console.error(error);
      },
    );
  }

  viewArticle(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent, {
      initialState: initialState,
    });
  }
  getHost() {
    return environment.apiUrl;
  }

  getLatestBlogs() {
    this.blogService
      .allBlogs({ banner: 0, limit: 5 })
      .subscribe((data: any) => {
        this.latestBlogs = data;
        this.cdr.markForCheck();
      });
  }

  getLastForums() {
    this.forumService.allForums({ limit: 5 }).subscribe((data: any) => {
      this.latestForums = (data || []).map((forum: any) => this.normalizeForum(forum));
      this.cdr.markForCheck();
    });
  }

  normalizeForum(forum: any) {
    const reactionsCount =
      forum?.reactionsCount ??
      forum?.reactions_count ??
      (Array.isArray(forum?.reactions) ? forum.reactions.length : 0) +
        (Array.isArray(forum?.reactionsUp) ? forum.reactionsUp.length : 0) +
        (Array.isArray(forum?.reactionsDown) ? forum.reactionsDown.length : 0) +
        (Array.isArray(forum?.reactionsHeart) ? forum.reactionsHeart.length : 0);

    const commentsCount =
      forum?.commentsCount ??
      forum?.comments_count ??
      (Array.isArray(forum?.comments) ? forum.comments.length : 0);

    return {
      ...forum,
      reactionsCount: reactionsCount ?? 0,
      commentsCount: commentsCount ?? 0,
    };
  }

  getLatestSurvey() {
    this.surveyService.getLatestSurvey().subscribe({
      next: (data: any) => {
        this.survey = data && Object.keys(data).length > 0 ? data : null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.survey = null;
        this.cdr.markForCheck();
      }
    });
  }

  surveyAnswer(value: any) {
    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      this.translate
        .get("SURVEY.TOAST")
        .subscribe((translatedMessage: string) => {
          this.surveyService
            .responseSurvey(this.survey.id, { answer: value })
            .subscribe(
              (data: any) => {
                this.toastr.success(translatedMessage["SUCCESS"]);
                this.getLatestSurvey();
              },
              (error: any) => {
                this.toastr.error(translatedMessage["ERROR"]);
              },
            );
        });
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }
}
