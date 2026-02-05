import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAddComponent } from './user-add.component';
import { RouterModule } from '@angular/router';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { routes } from './user-add.routing';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    UserAddComponent
  ],
  imports: [
    SharedModule,
    AvatarModule,
    DropdownModule,
    ColumnPanelModule,
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    NgSelectModule,
    RatingModule,
    PerfectScrollbarModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class UserAddModule { }
