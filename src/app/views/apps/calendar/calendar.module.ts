import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { routes } from "./calendar.routing.module";
import { RouterModule } from "@angular/router";
import { CalendarComponent } from "./calendar.component";
import { ColumnPanelModule } from "@app/shared/components/column-panel/column-panel.module";
import { CalendarModule as SharedCalendarModule } from "@app/shared/calendar/calendar.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { PopoverModule } from "ngx-bootstrap/popover";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgBootstrapFormValidationModule } from "ng-bootstrap-form-validation";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import localeEn from "@angular/common/locales/en";
import localeAr from "@angular/common/locales/ar";
import { TimepickerModule } from "ngx-bootstrap/timepicker";

registerLocaleData(localeFr);
registerLocaleData(localeEn);
registerLocaleData(localeAr);

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    SharedModule,
    ColumnPanelModule,
    SharedCalendarModule,
    PerfectScrollbarModule,
    TimepickerModule.forRoot(),
    NgBootstrapFormValidationModule.forRoot(),
    NgSelectModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    BsDatepickerModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: [],
})
export class CalendarAppModule {}
