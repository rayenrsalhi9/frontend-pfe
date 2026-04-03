import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class RtlService {
  readonly isRtl: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isRtl = isPlatformBrowser(platformId) && document.dir === "rtl";
  }
}
