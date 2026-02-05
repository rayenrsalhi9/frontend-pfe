import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { CommonError } from '../enums/common-error';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  private pusher: Pusher;
  private channel: any;

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  initializePusher(): void {
    Pusher.logToConsole = true
    this.pusher = new Pusher("app-key", {
      cluster: "mt1",
      auth:{
        headers:{
          "Authorization": "Bearer "+localStorage.getItem('bearerToken'),
        }
      },
      authEndpoint: environment.apiUrl + "api/pusher/auth",
      wsHost: environment.wsHost,
      wsPort: environment.wsPort,
      forceTLS: false,
      wssPort: environment.wsPort,
      disableStats:true
    })
  }

  getSocketId() {
    if(this.pusher) {
      return this.pusher.connection.socket_id
    }
  }

  connect() {
    if(this.pusher){
      this.pusher.connect()
    } else {
      this.initializePusher()
    }
  }

  disconnect() {
    if(this.pusher){
      this.pusher.disconnect()
    }
  }

  sendEvent(channelName: string, eventName: string,data:any) {
    this.pusher.send_event(eventName,data,channelName)
  }

  emitEvent(channelName: string, eventName: string,data:any) {
    this.pusher.subscribe(channelName).trigger(eventName,data)
  }

  subscribeToChannel(channelName: string, eventName: string, callback: (data: any) => void): void {
    this.channel = this.pusher.subscribe(channelName)
    this.channel.bind(eventName, callback);
  }

  unsubscribeFromChannel(channelName: string): void {
    if (this.pusher) {
      this.pusher.unsubscribe(channelName);
    }
  }


}
