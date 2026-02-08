import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ResponsesAuditComponent } from './responses-audit.component';
import { RouterModule } from '@angular/router';
import { routes } from './responses-audit.routing.module';

@NgModule({
  declarations: [ResponsesAuditComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ]
})
export class ResponsesAuditModule { }
