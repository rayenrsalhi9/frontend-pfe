import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    ArticleComponent,
    ArticlePreviewComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
    QuillModule.forRoot(),
    SharedModule,
  ]
})
export class ArticleModule { }
