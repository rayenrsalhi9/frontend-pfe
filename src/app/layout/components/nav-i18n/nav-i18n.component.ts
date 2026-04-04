import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { Store, Select } from "@ngxs/store";
import { AppConfig } from "@app/shared/types/app-config.interface";
import { Observable, Subscription } from "rxjs";
import { UpdateCurrentLanguage } from "@app/store/app-config/app-config.action";
import { supportedLanguages } from "@app/configs/i18n.config";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "nav-i18n",
  templateUrl: "./nav-i18n.component.html",
  styleUrls: ["./nav-i18n.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavI18NComponent implements OnInit, OnDestroy {
  @Input() dropDirection: "dropdown" | "dropup" | "dropright" = "dropdown";
  @Select((state: { app: AppConfig }) => state.app) app$: Observable<AppConfig>;
  private appSubscription: Subscription;
  currentLang: string;
  languageList: { key: string; lang: any }[] = [];
  isMenuOpen = false;
  focusedIndex = -1;

  @ViewChildren("optionBtn") optionButtons: QueryList<ElementRef>;

  constructor(
    private store: Store,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}

  @HostListener("document:click", ["$event"])
  clickout(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    this.getLanguageList();
    this.appSubscription = this.app$.subscribe((app) => {
      this.currentLang = app.lang;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.appSubscription) {
      this.appSubscription.unsubscribe();
    }
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
          this.elementRef.nativeElement.querySelector(".trigger-btn").focus();
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
}
