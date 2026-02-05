import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumComponent } from './forum.component';
import { ForumPreviewComponent } from './forum-preview/forum-preview.component';

const routes: Routes = [
  {
    path:'',component:ForumComponent,
  },
  {
    path:':id',component:ForumPreviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
