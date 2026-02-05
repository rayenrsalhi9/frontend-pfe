import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/core/security/security.service';
import { SusbcribeModalComponent } from '@app/shared/components/susbcribe-modal/susbcribe-modal.component';
import { ArticleService } from '@app/shared/services/article.service';
import { UserService } from '@app/shared/services/user.service';
import { ArticlesViewsComponent } from '@app/views/apps/articles/articles-views/articles-views.component';

import { BlogService } from '@app/views/apps/blog/blog.service';
import { ForumService } from '@app/views/apps/forum/forum.service';
import { SurveyService } from '@app/views/apps/survey/survey.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {


  banners = []
  latestBlogs = []
  latestForums = []
  articles: any[] = [];
  survey = null
  errorMessage: string = '';
  bsModalRef: BsModalRef;

  constructor(
    private blogService: BlogService,
    private userService: UserService,
    private forumService: ForumService,
    private cdr: ChangeDetectorRef,
    private securityService:SecurityService,
    private surveyService:SurveyService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate:TranslateService,
    private articleService:ArticleService,
  ) { }

  ngOnInit(): void {
    this.getBannerBlogs()
    this.getLatestBlogs()
    this.getLastForums()
    this.getLatestSurvey()
     this.loadPublicArticles()
  }

  // Méthode pour charger les articles depuis l'API
  loadPublicArticles(): void {
    this.userService.getArticles().subscribe(
      (data) => {
        this.articles = data; // Stocke les articles dans le tableau
        console.log('data',this.articles)
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des articles'; // Gérer les erreurs
        console.error(error);
      }
    );
  }

  viewArticle(data:any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent,{initialState:initialState})
  }
  // getLatestArticles() {
  //   this.articleService.allArticles({limit:4}).subscribe(
  //     (data:any)=>{
  //       this.latestArticles = data
  //       this.cdr.markForCheck()
  //     }
  //   )
  //   this.cdr.detectChanges()
  // }
  getHost() {
    return environment.apiUrl
  }

  getBannerBlogs() {
    this.blogService.allBlogs({ banner: 1, limit: 5 }).subscribe(
      (data: any) => {
        this.banners = data
        this.cdr.markForCheck()
        
      }
    )
    this.cdr.detectChanges()
  }

  getLatestBlogs() {
    this.blogService.allBlogs({ banner: 0, limit: 3 }).subscribe(
      (data: any) => {
        this.latestBlogs = data
        this.cdr.markForCheck()
        console.log(this.latestBlogs)
      }
    )
    this.cdr.detectChanges()
  }

  getLastForums () {
    this.forumService.allForums({limit:6}).subscribe(
      (data:any) => {
        this.latestForums = data
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  getLatestSurvey() {
    this.surveyService.getLatestSurvey().subscribe(
      (data:any)=>{
        this.survey = Object.keys(data).length?data:null
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  surveyAnswer(value: any) {
    if(this.securityService.isGuestUser() || this.securityService.isUserAuthenticate()) {
      console.log(true);
      this.translate.get('SURVEY.TOAST').subscribe((translatedMessage: string) => {
        this.surveyService.responseSurvey(this.survey.id,{answer:value}).subscribe(
          (data:any)=>{
            this.toastr.success(translatedMessage["SUCCESS"])
          },
          (error:any)=> {
            this.toastr.error(translatedMessage['ERROR'])
          }
        )
      })
    } else {
      console.log(false);
      this.modalService.show(SusbcribeModalComponent)
    }
  }

}
