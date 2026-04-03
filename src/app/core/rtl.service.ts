import { Injectable, PLATFORM_ID, Inject, OnDestroy } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RtlService implements OnDestroy {
  private isRtlSubject: BehaviorSubject<boolean>;
  private mutationObserver: MutationObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const initialValue =
      isPlatformBrowser(platformId) && document.dir === "rtl";
    this.isRtlSubject = new BehaviorSubject<boolean>(initialValue);

    if (isPlatformBrowser(platformId)) {
      this.mutationObserver = new MutationObserver(() => {
        const isRtl = document.dir === "rtl";
        this.isRtlSubject.next(isRtl);
      });

      this.mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
      });
    }
  }

  get isRtl(): boolean {
    return this.isRtlSubject.value;
  }

  getIsRtl$(): Observable<boolean> {
    return this.isRtlSubject.asObservable();
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }
}
