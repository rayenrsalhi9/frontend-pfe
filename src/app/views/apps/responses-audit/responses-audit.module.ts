import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ResponsesAuditComponent } from './responses-audit.component';
import { RouterModule } from '@angular/router';
import { routes } from './responses-audit.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [ResponsesAuditComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    BsDatepickerModule
  ]
})
export class ResponsesAuditModule { }
