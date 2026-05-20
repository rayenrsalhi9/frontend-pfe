import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { ArticleService } from "@app/shared/services/article.service";
import { UserService } from "@app/shared/services/user.service";
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
  latestBlogs: any[] = [];
  latestForums: any[] = [];
  articles: any[] = [];
  survey: any = null;
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

  /** First blog — shown as the large featured card */
  get featuredBlog(): any | null {
    return this.latestBlogs?.length > 0 ? this.latestBlogs[0] : null;
  }

  /** Remaining blogs — shown in the numbered list below the featured card */
  get remainingBlogs(): any[] {
    return this.latestBlogs?.length > 1 ? this.latestBlogs.slice(1) : [];
  }

  loadPublicArticles(): void {
    this.articleService.allArticles({ limit: 5 }).subscribe({
      next: (data: any) => {
        this.articles = (data || []).slice(0, 5);
        this.cdr.markForCheck();
      },
      error: (error) => this.handleLoadError(error, "WELCOME.ARTICLE_LOAD_ERROR")
    });
  }


  getHost(): string {
    return environment.apiUrl;
  }

  displayName(creator: any): string {
    const name = [creator?.firstName, creator?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    return name || creator?.userName || "";
  }

  getLatestBlogs(): void {
    this.blogService.allBlogs({ limit: 5 }).subscribe({
      next: (data: any) => {
        this.latestBlogs = (data || []).slice(0, 5);
        this.cdr.markForCheck();
      },
      error: (error) => this.handleLoadError(error, "WELCOME.BLOG_LOAD_ERROR")
    });
  }


  getLatestForums(): void {
    this.forumService.allForums({ limit: 5 }).subscribe({
      next: (data: any) => {
        this.latestForums = (data || []).map((forum: any) =>
          this.normalizeForum(forum),
        );
        this.cdr.markForCheck();
      },
      error: (error) => this.handleLoadError(error, "WELCOME.FORUM_LOAD_ERROR")
    });
  }

  getLastForums(): void {
    this.getLatestForums();
  }


  normalizeForum(
    forum: Partial<Record<string, any>> & {
      reactionsCount?: number;
      reactions_count?: number;
      reactions?: any[];
      reactionsUp?: any[];
      reactionsDown?: any[];
      reactionsHeart?: any[];
      commentsCount?: number;
      comments_count?: number;
      comments?: any[];
    },
  ) {
    const reactionsCount =
      forum?.reactionsCount ??
      forum?.reactions_count ??
      (Array.isArray(forum?.reactions) ? forum.reactions.length : 0) +
        (Array.isArray(forum?.reactionsUp) ? forum.reactionsUp.length : 0) +
        (Array.isArray(forum?.reactionsDown) ? forum.reactionsDown.length : 0) +
        (Array.isArray(forum?.reactionsHeart)
          ? forum.reactionsHeart.length
          : 0);

    const commentsCount =
      forum?.commentsCount ??
      forum?.comments_count ??
      (Array.isArray(forum?.comments) ? forum.comments.length : 0);

    return { ...forum, reactionsCount, commentsCount };
  }

  getLatestSurvey(): void {
    this.surveyService.getLatestSurvey().subscribe({
      next: (data: any) => {
        const isValidSurvey =
          data &&
          typeof data.type === "string" &&
          ["simple", "rating", "satisfaction"].includes(data.type);
        this.survey = isValidSurvey ? data : null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.survey = null;
        this.cdr.markForCheck();
      },
    });
  }

  surveyAnswer(value: any): void {
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
              () => {
                this.toastr.success(translatedMessage["SUCCESS"]);
                this.getLatestSurvey();
              },
              () => {
                this.toastr.error(translatedMessage["ERROR"]);
              },
            );
        });
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }

  private handleLoadError(error: any, translationKey: string): void {
    console.error(`Error loading data:`, error);
    this.errorMessage = this.translate.instant(translationKey);
    this.cdr.markForCheck();
  }
}

