import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';

const routes: Routes = [
  {
    path: '/',
    loadChildren: () => import('./document-assigned/document-assigned.module').then(m => m.DocumentAssignedModule),
    data: {
      title: 'NAV.DOCUMENT_ASSIGNED',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'list',
    loadChildren: () => import('./document-list/document-list.module').then(m => m.DocumentListModule),
    data: {
      title: 'NAV.DOCUMENT',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'add',
    loadChildren: () => import('./document-add/document-add.module').then(m => m.DocumentAddModule),
    data: {
      title: 'DOCUMENTS.LIST.BUTTONS.ADD',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import('./document-categories/document-categories.module').then(m => m.DocumentCategoriesModule),
    data: {
      title: 'NAV.DOCUMENT_CATEGORIES',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'assigned',
    loadChildren: () => import('./document-assigned/document-assigned.module').then(m => m.DocumentAssignedModule),
    data: {
      title: 'NAV.DOCUMENT_ASSIGNED',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'audit',
    loadChildren: () => import('./document-audits-trail/document-audits-trail.module').then(m => m.DocumentAuditsTrailModule),
    data: {
      title: 'NAV.DOCUMENT_AUDIT_TRAIL',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DomcumentsRoutingModule { }
