import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginAuditComponent } from "./login-audit.component";
import { RouterModule } from "@angular/router";
import { routes } from "./login-audit.routing.module";
import { SharedModule } from "@app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

@NgModule({
  declarations: [LoginAuditComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    NgxDatatableModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class LoginAuditModule {}
