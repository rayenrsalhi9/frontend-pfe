import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { NgApiDoc } from '@app/shared/components/docs/api-docs';
import { ngdoc } from '@app/shared/components/docs/api-docs/ng-api-doc';
import { CheckboxModule } from '@app/shared/components/checkbox/checkbox.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { UserPasswordEditComponent } from './user-password-edit/user-password-edit.component';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    UserPasswordEditComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    CheckboxModule,
    NgSelectModule,
    ModalModule.forRoot(),
    SharedModule,
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
  ],
  providers: [{ provide: NgApiDoc, useValue: ngdoc }]
})
export class UsersModule { }
