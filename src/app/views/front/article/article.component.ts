import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ArticleService } from "@app/shared/services/article.service";
import { ArticlesViewsComponent } from "@app/views/apps/articles/articles-views/articles-views.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { Article } from "@app/shared/models/article.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-article",
  templateUrl: "./article.component.html",
  styleUrls: ["./article.component.scss"],
})
export class ArticleComponent implements OnInit {
  articles: Article[] | null = null;

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.articleService.allArticles().subscribe({
      next: (data: any) => {
        this.articles = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des articles:", error);
        this.articles = [];
        this.cdr.markForCheck();
      },
    });
  }

  getHost() {
    return environment.apiUrl;
  }

  viewArticle(data: any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent, {
      initialState: initialState,
    });
  }
}
