import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CalendarViewComponent } from "./calendar-view.component";

@NgModule({
  declarations: [CalendarViewComponent],
  imports: [CommonModule, TranslateModule],
  exports: [CalendarViewComponent],
})
export class CalendarModule {}
