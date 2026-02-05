import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyAddComponent } from './survey-add.component';

const routes: Routes = [
  { path: '', component: SurveyAddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyAddRoutingModule { }
