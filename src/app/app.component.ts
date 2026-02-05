import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Select } from '@ngxs/store';
import { AppConfig } from '@app/shared/types/app-config.interface';
import { Observable, Subscription } from 'rxjs';
import { en_US } from './i18n/en/index'
import { fr_FR } from './i18n/fr/index'
import Pusher from "pusher-js"
import { PusherService } from './shared/services/pusher.service';
import { ar_AR } from './i18n/ar';
import { DashboradService } from './shared/services/dashboard.service';
import { NotificationSystem } from './shared/services/notification-system.service';

const storageKey = 'lang'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  @Select((state: { app: AppConfig; }) => state.app) app$: Observable<AppConfig>;
  private langChangeSubscription!: Subscription;
  currentLang: string;

  constructor(
    private dash:DashboradService,
    private translateService: TranslateService,
    private notificationSystem:NotificationSystem
  ) {
    translateService.setTranslation('en_US', en_US);
    translateService.setTranslation('fr_FR', fr_FR);
    translateService.setTranslation('ar_AR', ar_AR);
  }

  ngOnInit() {
    this.notificationSystem.requestPermission()

    this.app$.subscribe(app => {
      this.currentLang = localStorage.getItem(storageKey) || app.lang || this.translateService.getBrowserCultureLang();
      this.translateService.use(this.currentLang);
    });
    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(storageKey, event.lang);
      window.location.reload()
    });
  }

  ngOnDestroy() {

    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

}
