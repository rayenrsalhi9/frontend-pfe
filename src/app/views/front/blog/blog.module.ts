import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { BlogPreviewComponent } from './blog-preview/blog-preview.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    BlogComponent,
    BlogPreviewComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    FormsModule,
    QuillModule.forRoot(),
    SharedModule,
  ]
})
export class BlogModule { }
