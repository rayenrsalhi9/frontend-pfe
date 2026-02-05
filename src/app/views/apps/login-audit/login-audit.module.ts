import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAuditComponent } from './login-audit.component';
import { RouterModule } from '@angular/router';
import { routes } from './login-audit.routing.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { CheckboxModule } from '@app/shared/components/checkbox/checkbox.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SharedModule } from '@app/shared/shared.module';
import { DomcumentsRoutingModule } from '@app/views/documents/document.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [
    LoginAuditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DomcumentsRoutingModule,
    ModalModule.forRoot(),
    AvatarModule,
    NgSelectModule,
    DropdownModule,
    ColumnPanelModule,
    BsDropdownModule.forRoot(),
    NgSelectModule,
    CheckboxModule,
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    CheckboxModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class LoginAuditModule { }
