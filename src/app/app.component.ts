import { Component, OnInit, OnDestroy } from "@angular/core";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { Select } from "@ngxs/store";
import { AppConfig } from "@app/shared/types/app-config.interface";
import { Observable, Subscription } from "rxjs";
import { en_US } from "./i18n/en/index";
import { fr_FR } from "./i18n/fr/index";
import { ar_AR } from "./i18n/ar";
import { NotificationSystem } from "./shared/services/notification-system.service";

const storageKey = "lang";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit, OnDestroy {
  @Select((state: { app: AppConfig }) => state.app) app$: Observable<AppConfig>;
  private appSubscription!: Subscription;
  private langChangeSubscription!: Subscription;
  currentLang: string;

  constructor(
    private translateService: TranslateService,
    private notificationSystem: NotificationSystem,
  ) {
    translateService.setTranslation("en_US", en_US);
    translateService.setTranslation("fr_FR", fr_FR);
    translateService.setTranslation("ar_AR", ar_AR);
  }

  ngOnInit() {
    this.notificationSystem.requestPermission();

    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        const locale = event.lang || "en_US";
        const htmlLang = locale.replace("_", "-");
        const baseLang = htmlLang.split("-")[0].toLowerCase();

        localStorage.setItem(storageKey, locale);
        document.documentElement.lang = htmlLang;
        document.documentElement.dir = baseLang === "ar" ? "rtl" : "ltr";
      },
    );

    this.appSubscription = this.app$.subscribe((app) => {
      this.currentLang =
        localStorage.getItem(storageKey) ||
        app.lang ||
        this.translateService.getBrowserCultureLang()?.replace("-", "_") ||
        "en_US";
      this.translateService.use(this.currentLang);
    });
  }

  ngOnDestroy() {
    if (this.appSubscription) {
      this.appSubscription.unsubscribe();
    }
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
