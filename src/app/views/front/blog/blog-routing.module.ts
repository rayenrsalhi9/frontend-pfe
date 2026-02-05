import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogPreviewComponent } from './blog-preview/blog-preview.component';

const routes: Routes = [
  {
    path:'',component:BlogComponent,
  },
  {
    path:':id',component:BlogPreviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
