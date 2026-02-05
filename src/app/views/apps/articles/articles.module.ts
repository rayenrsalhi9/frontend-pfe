import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from '../mail/mail.routing.module';
import { ArticlesRoutingModule } from './articles.routing.module';
import { ArticlesCategoryAddComponent } from './articles-category-add/articles-category-add.component';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { CheckboxModule } from '@app/shared/components/checkbox/checkbox.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { RadioModule } from '@app/shared/components/radio/radio.module';
import { SharedModule } from '@app/shared/shared.module';
import { DomcumentsRoutingModule } from '@app/views/documents/document.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [
    ArticlesCategoryAddComponent
  ],
  imports: [
    ArticlesRoutingModule,
    CommonModule,
    DomcumentsRoutingModule,
    ModalModule.forRoot(),
    SharedModule,
    AvatarModule,
    DropdownModule,
    ColumnPanelModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    QuillModule.forRoot({}),
    CheckboxModule,
    RadioModule,
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    CheckboxModule,
  ]
})
export class ArticlesModule { }
