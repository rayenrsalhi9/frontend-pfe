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
    const browserLanuges = navigator.language;
    if (!utcDate) {
      return "";
    }
    if (format === UTCToLocalTimeFormat.SHORT) {
      const date = new Date(utcDate).toLocaleDateString(browserLanuges);
      const time = new Date(utcDate).toLocaleTimeString(browserLanuges);
      return `${date} ${time}`;
    } else if (
      format === UTCToLocalTimeFormat.SHORT_DATE ||
      format === "mediumDate"
    ) {
      const date = new Date(utcDate).toLocaleDateString(browserLanuges);
      return `${date}`;
    } else if (format === UTCToLocalTimeFormat.SHORT_TIME) {
      const time = new Date(utcDate).toLocaleTimeString(browserLanuges);
      return `${time}`;
    } else {
      const date = new Date(utcDate).toLocaleDateString(browserLanuges);
      const time = new Date(utcDate).toLocaleTimeString(browserLanuges);
      return `${date} ${time}`;
    }
  }
}
