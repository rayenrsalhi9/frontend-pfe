import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumListRoutingModule } from './forum-list-routing.module';
import { ForumListComponent } from './forum-list.component';
import { ForumCommentsModalComponent } from './forum-comments-modal.component';

import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SharedModule } from '@app/shared/shared.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ModalModule } from 'ngx-bootstrap/modal';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    ForumListComponent,
    ForumCommentsModalComponent
  ],
  imports: [
    CommonModule,
    ForumListRoutingModule,
    SharedModule,
    AvatarModule,
    DropdownModule,
    ColumnPanelModule,
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    QuillModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
  ],
})
export class ForumListModule { }
