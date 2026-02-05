import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AvatarModule } from "@app/shared/components/avatar/avatar.module";
import { ColumnPanelModule } from "@app/shared/components/column-panel/column-panel.module";
import { DropdownModule } from "@app/shared/components/dropdown/dropdown.module";
import { SharedModule } from "@app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { RatingModule } from "ngx-bootstrap/rating";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { QuillModule } from "ngx-quill";
import { DocumentAddComponent } from "./document-add.component";
import { routes } from "./document-add.routes";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";




@NgModule({
  declarations: [
    DocumentAddComponent
  ],
  imports: [
    SharedModule,
    AvatarModule,
    NgSelectModule,
    DropdownModule,
    BsDatepickerModule.forRoot(),
    ColumnPanelModule,
    NgxDatatableModule,
    RatingModule,
    PerfectScrollbarModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class DocumentAddModule { }
