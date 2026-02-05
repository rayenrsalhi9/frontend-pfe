import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-rounting.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { CheckboxModule } from '@app/shared/components/checkbox/checkbox.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { RadioModule } from '@app/shared/components/radio/radio.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ModalModule.forRoot(),
    SharedModule,
    AvatarModule,
    DropdownModule,
    ColumnPanelModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    CheckboxModule,
    RadioModule,
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    CheckboxModule,
    QuillModule.forRoot(),
  ]
})
export class SettingsModule { }
