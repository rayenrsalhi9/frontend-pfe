import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './role-list.routing';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { RoleListComponent } from './role-list.component';



@NgModule({
  declarations: [
    RoleListComponent
  ],
  imports: [
    SharedModule,
    AvatarModule,
    DropdownModule,
    ColumnPanelModule,
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class RoleListModule { }
