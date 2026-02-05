import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticleService } from '@app/shared/services/article.service';
import { ArticlesViewsComponent } from '@app/views/apps/articles/articles-views/articles-views.component';
import { BsModalService } from 'ngx-bootstrap/modal';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  articles = []

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.getArticles()
  }

  getArticles() {
    this.articleService.allArticles().subscribe(
      (data: any) => {
        this.articles = data;  // Mise à jour des articles
        this.cdr.markForCheck();  // Demander à Angular de vérifier les changements
      },
      (error) => {
        console.error('Erreur lors de la récupération des articles:', error);  // Gestion des erreurs
      }
    );
  }
  

  getHost() {
    return environment.apiUrl
  }
  viewArticle(data:any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent,{initialState:initialState})
  }

}
