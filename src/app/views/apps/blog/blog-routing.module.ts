import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./blog-list/blog-list.module').then(m => m.BlogListModule),
    data: {
      title: 'NAV.APPS_BLOG_LIST',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'add',
    loadChildren: () => import('./blog-add/blog-add.module').then(m => m.BlogAddModule),
    data: {
      title: 'BLOG.BUTTONS.ADD',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./blog-edit/blog-edit.module').then(m => m.BlogEditModule),
    data: {
      title: 'BLOG.BUTTONS.EDIT',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import('./blog-category/blog-category.module').then(m => m.BlogCategoryModule),
    data: {
      title: 'NAV.APPS_BLOG_CATEGORY',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
