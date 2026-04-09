import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { Store, Select } from "@ngxs/store";
import { Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppConfig } from "@app/shared/types/app-config.interface";
import { UpdateCurrentLanguage } from "@app/store/app-config/app-config.action";
import { supportedLanguages } from "@app/configs/i18n.config";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "nav-i18n-header",
  templateUrl: "./nav-i18n-header.component.html",
  styleUrls: ["./nav-i18n-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.header-nav-item]": "true",
  },
})
export class NavI18NHeaderComponent implements OnInit, OnDestroy {
  @Input() dropDirection: "dropdown" | "dropup" | "dropright" = "dropdown";
  @Select((state: { app: AppConfig }) => state.app) app$: Observable<AppConfig>;
  
  private destroy$ = new Subject<void>();
  private appSubscription: Subscription;
  private clickListener: (event: MouseEvent) => void;

  currentLang: string = "";
  languageList: { key: string; lang: any }[] = [];
  isMenuOpen = false;
  focusedIndex = -1;

  @ViewChildren("optionBtn") optionButtons: QueryList<ElementRef>;

  constructor(
    private store: Store,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {
    this.clickListener = (event: MouseEvent) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.isMenuOpen = false;
        this.cdr.markForCheck();
      }
    };
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    this.clickListener(event);
  }

  ngOnInit(): void {
    this.getLanguageList();
    this.appSubscription = this.app$.subscribe((app) => {
      this.currentLang = app.lang;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.appSubscription) {
      this.appSubscription.unsubscribe();
    }
  }

  getLanguageList() {
    const list: { key: string; lang: any }[] = [];
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
    if (this.isMenuOpen) {
      this.focusedIndex = this.languageList.findIndex(
        (l) => l.key === this.currentLang,
      );
      if (this.focusedIndex === -1) {
        this.focusedIndex = 0;
      }
      setTimeout(() => this.focusOption(this.focusedIndex), 0);
    }
    this.cdr.markForCheck();
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.isMenuOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        this.toggleMenu();
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        this.focusedIndex = (this.focusedIndex + 1) % this.languageList.length;
        this.focusOption(this.focusedIndex);
        event.preventDefault();
        break;
      case "ArrowUp":
        this.focusedIndex =
          (this.focusedIndex - 1 + this.languageList.length) %
          this.languageList.length;
        this.focusOption(this.focusedIndex);
        event.preventDefault();
        break;
      case "Home":
        this.focusedIndex = 0;
        this.focusOption(this.focusedIndex);
        event.preventDefault();
        break;
      case "End":
        this.focusedIndex = this.languageList.length - 1;
        this.focusOption(this.focusedIndex);
        event.preventDefault();
        break;
      case "Enter":
      case " ":
        if (
          this.focusedIndex >= 0 &&
          this.focusedIndex < this.languageList.length
        ) {
          this.setLanguage(this.languageList[this.focusedIndex].key);
        }
        event.preventDefault();
        break;
      case "Escape":
      case "Tab":
        this.isMenuOpen = false;
        if (event.key === "Escape") {
          const btn = this.elementRef.nativeElement.querySelector(".trigger-btn");
          if (btn) btn.focus();
          event.preventDefault();
        }
        break;
    }
    this.cdr.markForCheck();
  }

  private focusOption(index: number) {
    const buttons = this.optionButtons.toArray();
    if (buttons[index]) {
      buttons[index].nativeElement.focus();
    }
  }

  setLanguage(language: string) {
    this.store.dispatch(new UpdateCurrentLanguage(language));
    this.translateService.use(language);
    this.isMenuOpen = false;
    this.cdr.markForCheck();
  }

  getFlagEmoji(langKey: string): string {
    const flags: { [key: string]: string } = {
      "en": "🇬🇧",
      "en_US": "🇬🇧",
      "fr": "🇫🇷",
      "fr_FR": "🇫🇷",
      "ar": "🇸🇦",
      "ar_SA": "🇸🇦",
    };
    return flags[langKey] || "🌐";
  }
}
