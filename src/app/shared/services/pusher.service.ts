import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { CommonError } from "../enums/common-error";
import Pusher from "pusher-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PusherService {
  private pusher: Pusher;
  private channel: any;
  private subscriptions: Map<
    string,
    Array<{ eventName: string; callback: (data: any) => void }>
  > = new Map();

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
  ) {}

  initializePusher(): void {
    Pusher.logToConsole = !environment.production;
    this.pusher = new Pusher(environment.wsKey, {
      cluster: "mt1",
      auth: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("bearerToken"),
        },
      },
      authEndpoint: environment.apiUrl + "api/pusher/auth",
      wsHost: environment.wsHost,
      wsPort: environment.wsPort,
      forceTLS: false,
      wssPort: environment.wsPort,
      disableStats: true,
    });
  }

  rebuildPusher(): void {
    const savedSubscriptions = new Map(this.subscriptions);
    if (this.pusher) {
      this.pusher.disconnect();
    }
    this.subscriptions.clear();
    this.initializePusher();
    savedSubscriptions.forEach((handlers, channelName) => {
      const channel = this.pusher.subscribe(channelName);
      handlers.forEach(({ eventName, callback }) => {
        channel.bind(eventName, callback);
      });
      this.subscriptions.set(channelName, handlers);
    });
  }

  getSocketId() {
    if (this.pusher) {
      return this.pusher.connection.socket_id;
    }
  }

  connect() {
    if (this.pusher) {
      this.pusher.connect();
    } else {
      this.initializePusher();
    }
  }

  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }

  sendEvent(channelName: string, eventName: string, data: any) {
    if (this.pusher) {
      this.pusher.send_event(eventName, data, channelName);
    }
  }

  emitEvent(channelName: string, eventName: string, data: any) {
    if (this.pusher) {
      this.pusher.subscribe(channelName).trigger(eventName, data);
    }
  }

  subscribeToChannel(
    channelName: string,
    eventName: string,
    callback: (data: any) => void,
  ): void {
    if (this.pusher) {
      const channel = this.pusher.subscribe(channelName);
      channel.bind(eventName, callback);
      const existing = this.subscriptions.get(channelName) || [];
      existing.push({ eventName, callback });
      this.subscriptions.set(channelName, existing);
    }
  }

  unsubscribeFromChannel(channelName: string, callback?: (data: any) => void): void {
    if (this.pusher) {
      const channel = this.pusher.subscribe(channelName);
      if (callback) {
        const handlers = this.subscriptions.get(channelName) || [];
        const index = handlers.findIndex((h: any) => h.callback === callback);
        if (index > -1) {
          handlers.splice(index, 1);
          channel.unbind(null, callback);
          if (handlers.length === 0) {
            this.pusher.unsubscribe(channelName);
            this.subscriptions.delete(channelName);
          } else {
            this.subscriptions.set(channelName, handlers);
          }
        }
      } else {
        this.pusher.unsubscribe(channelName);
        this.subscriptions.delete(channelName);
      }
    }
  }

  resetPusherSession(): void {
    this.subscriptions.clear();
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }
}
