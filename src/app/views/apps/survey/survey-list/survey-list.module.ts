import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyListRoutingModule } from './survey-list-routing.module';
import { SurveyListComponent } from './survey-list.component';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    SurveyListComponent
  ],
  imports: [
    CommonModule,
    SurveyListRoutingModule,
    SharedModule,
    AvatarModule,
    DropdownModule,
    ColumnPanelModule,
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    TooltipModule.forRoot(),
    QuillModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class SurveyListModule { }
