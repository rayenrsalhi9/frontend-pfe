import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogEditComponent } from './blog-edit.component';

const routes: Routes = [
  { path: '', component: BlogEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogEditRoutingModule { }
