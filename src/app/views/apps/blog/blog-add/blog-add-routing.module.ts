import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogAddComponent } from './blog-add.component';

const routes: Routes = [
  { path: '', component: BlogAddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogAddRoutingModule { }
