import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./articles-list/articles-list.module').then(m => m.ArticlesListModule),
    data: {
      title: 'NAV.APPS_ARTICLE_LIST',
      hidePageHeader: false
    }
   
  },
  {
    path: 'add',
    loadChildren: () => import('./articles-add/articles-add.module').then(m => m.ArticlesAddModule),
    data: {
      title: 'ARTICLES.LIST.BUTTONS.ADD',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./articles-add/articles-add.module').then(m => m.ArticlesAddModule),
    data: {
      title: 'ARTICLES.LIST.BUTTONS.EDIT',
      hidePageHeader: false,
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import('./articles-categories/articles-categories.module').then(m => m.ArticlesCategoriesModule),
    data: {
      title: 'NAV.APPS_ARTICLE_CATEGORY',
      hidePageHeader: false
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule { }
