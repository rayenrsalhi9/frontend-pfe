import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesAddComponent } from './articles-add.component';
import { RouterModule } from '@angular/router';
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
import { routes } from './articles-add.routing.module';
import { SwitchModule } from '@app/shared/components/switch/switch.module';
import { UploadModule } from '@app/shared/components/upload/upload.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    ArticlesAddComponent
  ],
  imports: [
    CommonModule,
    SwitchModule,
    SharedModule,
    AvatarModule,
    UploadModule.forRoot(),
    DropdownModule,
    ColumnPanelModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    QuillModule.forRoot({}),
    RatingModule,
    PerfectScrollbarModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ]
})
export class ArticlesAddModule { }
