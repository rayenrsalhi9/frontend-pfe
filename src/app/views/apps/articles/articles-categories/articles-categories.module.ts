import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesCategoriesComponent } from './articles-categories.component';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './articles-categories.routing.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [
    ArticlesCategoriesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AvatarModule,
    DropdownModule,
    ColumnPanelModule,
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    QuillModule.forRoot({}),
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ]
})
export class ArticlesCategoriesModule { }
