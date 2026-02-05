import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';

export const APP_LAYOUT_ROUTES: Routes = [
  //Dashboard
  {
    path: 'dashboard',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  //Apps
  {
    path: 'apps',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/apps/apps.module').then(m => m.AppsModule),
  },
  {
    path: 'document',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/documents/documents.module').then(m => m.DocumentsModule),
  },
  {
    path: 'user',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/users/users.module').then(m => m.UsersModule),
  },

  {
    path:'setting',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/settings/settings.module').then(m => m.SettingsModule),
  },
  // UI Elements
  {
    path: 'ui-elements',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/ui-elements/ui-elements.module').then(m => m.UiElementsModule),
  },
  // Icons
  {
    path: 'icons',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/icons/icons.module').then(m => m.IconsModule),
  },
  {
    path: 'maps',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/maps/maps.module').then(m => m.MapsModule),
  },
  // Chart
  {
    path: 'charts',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/charts/charts.module').then(m => m.ChartsModule),
  },
  // Form Elements
  {
    path: 'form-elements',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/form-elements/form-elements.module').then(m => m.FormElementsModule),
  },
  // Tables
  {
    path: 'tables',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/tables/tables.module').then(m => m.TablesModule),
  },
  // Pages
  {
    path: 'pages',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/pages/pages.module').then(m => m.PagesModule),
  },
  // Docs
  {
    path: 'docs',
    canLoad: [AuthGuard],
    loadChildren: () => import('../views/docs/docs.module').then(m => m.DocsModule),
  }
];
