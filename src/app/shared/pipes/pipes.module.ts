import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './truncate.pipe';
import { ReminderFrequencyPipe } from './reminder-frequency.pipe';
import { UTCToLocalTime } from './utc-to-localtime.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [TruncatePipe, ReminderFrequencyPipe,UTCToLocalTime,SafeHtmlPipe],
  imports: [CommonModule],
  exports: [TruncatePipe, ReminderFrequencyPipe,UTCToLocalTime,SafeHtmlPipe],
})
export class PipesModule {}
