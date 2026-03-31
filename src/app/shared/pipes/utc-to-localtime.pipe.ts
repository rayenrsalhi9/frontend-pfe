import { Pipe, PipeTransform } from "@angular/core";
enum UTCToLocalTimeFormat {
  FULL = "full",
  SHORT = "short",
  SHORT_DATE = "shortDate",
  SHORT_TIME = "shortTime",
  MEDIUM_DATE = "mediumDate",
}

@Pipe({
  name: "utcToLocalTime",
})
export class UTCToLocalTime implements PipeTransform {
  transform(utcDate: Date, format: UTCToLocalTimeFormat | string): any {
    const browserLanguages = navigator.language;
    if (!utcDate) {
      return "";
    }
    if (format === UTCToLocalTimeFormat.SHORT) {
      const date = new Date(utcDate).toLocaleDateString(browserLanguages);
      const time = new Date(utcDate).toLocaleTimeString(browserLanguages);
      return `${date} ${time}`;
    } else if (
      format === UTCToLocalTimeFormat.SHORT_DATE ||
      format === UTCToLocalTimeFormat.MEDIUM_DATE
    ) {
      const date = new Date(utcDate).toLocaleDateString(browserLanguages);
      return `${date}`;
    } else if (format === UTCToLocalTimeFormat.SHORT_TIME) {
      const time = new Date(utcDate).toLocaleTimeString(browserLanguages);
      return `${time}`;
    } else {
      const date = new Date(utcDate).toLocaleDateString(browserLanguages);
      const time = new Date(utcDate).toLocaleTimeString(browserLanguages);
      return `${date} ${time}`;
    }
  }
}
