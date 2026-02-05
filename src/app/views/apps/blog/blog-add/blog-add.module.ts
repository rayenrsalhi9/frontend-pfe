import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogAddRoutingModule } from './blog-add-routing.module';
import { BlogAddComponent } from './blog-add.component';
import { RouterModule } from '@angular/router';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SwitchModule } from '@app/shared/components/switch/switch.module';
import { UploadModule } from '@app/shared/components/upload/upload.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { CKEditorModule } from 'ckeditor4-angular';
import { JoditAngularModule } from 'jodit-angular';

@NgModule({
  declarations: [
    BlogAddComponent
  ],
  imports: [
    CommonModule,
    BlogAddRoutingModule,
    JoditAngularModule,
    SwitchModule,
    SharedModule,
    AvatarModule,
    UploadModule.forRoot(),
    DropdownModule,
    CKEditorModule,
    ColumnPanelModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    QuillModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule.forRoot()
  ]
})
export class BlogAddModule { }
