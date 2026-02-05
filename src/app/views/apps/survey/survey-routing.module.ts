import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';
import { SurveyDetailComponent } from './survey-detail/survey-detail.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./survey-list/survey-list.module').then(m => m.SurveyListModule),
    data: {
      title: 'NAV.APPS_SURVEY',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'add',
    loadChildren: () => import('./survey-add/survey-add.module').then(m => m.SurveyAddModule),
    data: {
      title: 'SURVEY.BUTTONS.ADD',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./survey-edit/survey-edit.module').then(m => m.SurveyEditModule),
    data: {
      title: 'SURVEY.BUTTONS.EDIT',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'detail/:id',
    data:{
      title: 'SURVEY.BUTTONS.VIEW',
      hidePageHeader: false
    },
    component:SurveyDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
