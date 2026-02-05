import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumAddComponent } from './forum-add.component';

const routes: Routes = [
  { path: '', component: ForumAddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumAddRoutingModule { }
