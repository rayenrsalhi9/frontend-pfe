import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article.component';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';

const routes: Routes = [
  {
    path:'',component:ArticleComponent,
  },
  {
    path:':id',component:ArticlePreviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
