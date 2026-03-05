import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
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
  banners = [];
  latestBlogs = [];
  latestForums = [];
  articles: any[] = [];
  survey = null;
  errorMessage: string = "";
  bsModalRef: BsModalRef;

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
    this.getBannerBlogs();
    this.getLatestBlogs();
    this.getLastForums();
    this.getLatestSurvey();
    this.loadPublicArticles();
  }

  loadPublicArticles(): void {
    this.userService.getArticles().subscribe(
      (data) => {
        this.articles = data;
      },
      (error) => {
        this.errorMessage = "Erreur lors du chargement des articles";
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

  getBannerBlogs() {
    this.blogService
      .allBlogs({ banner: 1, limit: 5 })
      .subscribe((data: any) => {
        this.banners = data;
        this.cdr.markForCheck();
      });
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
      this.latestForums = data;
      this.cdr.markForCheck();
    });
  }

  getLatestSurvey() {
    this.surveyService.getLatestSurvey().subscribe((data: any) => {
      this.survey = Object.keys(data).length ? data : null;
      this.cdr.markForCheck();
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
