import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumCategoryComponent } from './forum-category.component';

const routes: Routes = [
  { path: '', component: ForumCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumCategoryRoutingModule { }
