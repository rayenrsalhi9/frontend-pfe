import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./forum-list/forum-list.module').then(m => m.ForumListModule),
    data: {
      title: 'NAV.APPS_FORUM_LIST',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'add',
    loadChildren: () => import('./forum-add/forum-add.module').then(m => m.ForumAddModule),
    data: {
      title: 'FORUM.BUTTONS.ADD',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./forum-edit/forum-edit.module').then(m => m.ForumEditModule),
    data: {
      title: 'FORUM.BUTTONS.EDIT',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import('./forum-category/forum-category.module').then(m => m.ForumCategoryModule),
    data: {
      title: 'NAV.APPS_FORUM_CATEGORY',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
