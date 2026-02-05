import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyDetailComponent } from './survey-detail/survey-detail.component';
import { SharedModule } from '@app/shared/shared.module';
import { OverviewComponent } from '@app/views/dashboard/components/overview/overview-component';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    SurveyDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SurveyRoutingModule,
    NgApexchartsModule,
  ]
})
export class SurveyModule { }
