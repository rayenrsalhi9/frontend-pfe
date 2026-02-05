import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumEditComponent } from './forum-edit.component';

const routes: Routes = [
  { path: '', component: ForumEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumEditRoutingModule { }
