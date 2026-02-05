import { NgModule } from '@angular/core';
import { DomcumentsRoutingModule } from './document.routing.module';
import { NgApiDoc } from '@app/shared/components/docs/api-docs/api-docs.model';
import { ngdoc } from '@app/shared/components/docs/api-docs/ng-api-doc';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { DocumentHistoryComponent } from './document-history/document-history.component';
import { DocumentUploadNewVersionComponent } from './document-upload-new-version/document-upload-new-version.component';
import { CheckboxModule } from '@app/shared/components/checkbox/checkbox.module';
import { DocumentReminderComponent } from './document-reminder/document-reminder.component';
import { DocumentSendEmailComponent } from './document-send-email/document-send-email.component';
import { DocumentShareComponent } from './document-share/document-share.component';
import { DocumentCommentComponent } from './document-comment/document-comment.component';
import { DocumentCategoryAddComponent } from './document-category-add/document-category-add.component';
import { RadioModule } from '@app/shared/components/radio/radio.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations:[
    DocumentEditComponent,
    DocumentHistoryComponent,
    DocumentUploadNewVersionComponent,
    DocumentReminderComponent,
    DocumentSendEmailComponent,
    DocumentShareComponent,
    DocumentCommentComponent,
    DocumentCategoryAddComponent
  ],
  imports: [
    DomcumentsRoutingModule,
    ModalModule.forRoot(),
    SharedModule,
    AvatarModule,
    DropdownModule,
    TimepickerModule.forRoot(),
    ColumnPanelModule,
    QuillModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgSelectModule,

    CheckboxModule,
    RadioModule,
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    CheckboxModule,
    QuillModule.forRoot(),
  ],
  bootstrap:[
    DocumentShareComponent
  ],
  providers: [
   /*  { provide: NgApiDoc, useValue: ngdoc }, */
  ]
})
export class DocumentsModule { }
