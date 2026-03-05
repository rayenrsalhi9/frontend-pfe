import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
} from "@angular/core";
import { Store, Select } from "@ngxs/store";
import { AppConfig } from "@app/shared/types/app-config.interface";
import { Observable } from "rxjs";
import { UpdateCurrentLanguage } from "@app/store/app-config/app-config.action";
import { supportedLanguages } from "@app/configs/i18n.config";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "nav-i18n",
  templateUrl: "./nav-i18n.component.html",
  styleUrls: ["./nav-i18n.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavI18NComponent implements OnInit {
  @Input() dropDirection: "dropdown" | "dropup" | "dropright" = "dropdown";
  @Select((state: { app: AppConfig }) => state.app) app$: Observable<AppConfig>;
  currentLang: string;
  languageList = [];
  isMenuOpen = false;

  constructor(
    private store: Store,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    this.getLanguageList();
    this.app$.subscribe((app) => {
      this.currentLang = app.lang;
      this.cdr.markForCheck();
    });
  }

  getLanguageList() {
    let list = [];
    for (const key in supportedLanguages) {
      if (Object.prototype.hasOwnProperty.call(supportedLanguages, key)) {
        const lang = supportedLanguages[key];
        list.push({
          key: key,
          lang: lang,
        });
      }
    }
    this.languageList = list;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.cdr.markForCheck();
  }

  setLanguage(language: string) {
    this.store.dispatch(new UpdateCurrentLanguage(language));
    this.translateService.use(language);
    this.isMenuOpen = false;
    this.cdr.markForCheck();
  }
}
