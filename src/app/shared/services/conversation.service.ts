import { Injectable } from '@angular/core';
import {
  HttpClient, HttpResponse,
} from '@angular/common/http';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { Conversation, Message } from '../enums/conversation';
import { PusherService } from './pusher.service';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
    private pusherService:PusherService
  ) {}

  createConversation(data:any):Observable<Conversation | CommonError> {
    const url = `conversations/create`;
    return this.httpClient
      .post<Conversation>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteConversation(id:any):Observable<Conversation | CommonError> {
    const url = `conversations/delete/${id}`;
    return this.httpClient
      .delete<Conversation>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateConversation(id:any, data:any):Observable<Conversation | CommonError> {
    const url = `conversations/update/${id}`;
    return this.httpClient
      .put<Conversation>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getConversations(): Observable<Conversation[] | CommonError> {
    const url = `conversations`;
    return this.httpClient
      .get<Conversation[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  conversationAddUser(data:any): Observable<any[] | CommonError> {
    const url = `conversations/addUser`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getMessages(id:string): Observable<Conversation | CommonError> {
    const url = `conversations/${id}/messages`;
    return this.httpClient
      .get<Conversation>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  setMessage(data:any): Observable<Message | CommonError> {
    const url = `conversations/message`;
    /* return this.httpClient.post<DocumentInfo[]>(url,{test:'test'})
      .pipe(catchError(this.commonHttpErrorService.handleError)); */
      return this.httpClient.post<Message>(url, data,{headers:{
        'X-Socket-Id':this.pusherService.getSocketId()
      }})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deliveredMessage(data:any): Observable<Message | CommonError> {
    const url = `conversations/message/${data.id}/delivered`;
    /* return this.httpClient.post<DocumentInfo[]>(url,{test:'test'})
      .pipe(catchError(this.commonHttpErrorService.handleError)); */
      return this.httpClient.put<Message>(url, data,{headers:{
        'X-Socket-Id':this.pusherService.getSocketId()
      }})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  seenMessage(data:any): Observable<Message | CommonError> {
    const url = `conversations/message/${data.id}/seen`;
    /* return this.httpClient.post<DocumentInfo[]>(url,{test:'test'})
      .pipe(catchError(this.commonHttpErrorService.handleError)); */
      return this.httpClient.put<Message>(url, data,{headers:{
        'X-Socket-Id':this.pusherService.getSocketId()
      }})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  reactionMessage(data:any): Observable<Message | CommonError> {
    const url = `conversations/message/${data.mid}/reaction`;
    /* return this.httpClient.post<DocumentInfo[]>(url,{test:'test'})
      .pipe(catchError(this.commonHttpErrorService.handleError)); */
      return this.httpClient.put<Message>(url, data,{headers:{
        'X-Socket-Id':this.pusherService.getSocketId()
      }})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }


}
