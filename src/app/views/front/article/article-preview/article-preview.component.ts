import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { SusbcribeModalComponent } from '@app/shared/components/susbcribe-modal/susbcribe-modal.component';
import { ArticleService } from '@app/shared/services/article.service';
import { BlogService } from '@app/views/apps/blog/blog.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.css']
})
export class ArticlePreviewComponent implements OnInit {

  article: any = {}
  comment: any

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private modalService: BsModalService,
  ) { }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      if (id) {
        this.articleService.getArticle(id).subscribe(
          (data: any) => {
            this.article = data
            this.cdr.markForCheck()
          }
        )
      }
    })
  }





}
