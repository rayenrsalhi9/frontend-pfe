import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { CommonError } from '../enums/common-error';
import { User } from '../enums/user-auth';
import { UserClaim } from '../enums/user-claim';
import { Employe } from '../enums/employe';
import {ArticleResource} from '../enums/article-resource'

@Injectable({ providedIn: 'root' })
export class UserService {
 // private apiUrl = 'http://localhost:8000/api/employes'; 
  private dataSubject = new BehaviorSubject<User>(null);
  data$ = this.dataSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }


  refreshUser(data: any) {
    this.dataSubject.next(data);
  }

  updateUser(user: User): Observable<User | CommonError> {
    const url = `user/${user.id}`;
    return this.httpClient.put<User>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addUser(user: User): Observable<User | CommonError> {
    const url = `user`;
    return this.httpClient.post<User>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteUser(id: string): Observable<void | CommonError> {
    const url = `user/${id}`;
    return this.httpClient.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUser(id: string): Observable<User | CommonError> {
    const url = `user/${id}`;
    return this.httpClient.get<User>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateUserClaim(userClaims: UserClaim[], userId: string): Observable<User | CommonError> {
    const url = `userClaim/${userId}`;
    return this.httpClient.put<User>(url, { userClaims })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  resetPassword(user: User): Observable<User | CommonError> {
    const url = `user/resetpassword`;
    return this.httpClient.post<User>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  changePassword(user: User): Observable<User | CommonError> {
    const url = `user/changepassword`;
    return this.httpClient.post<User>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateUserProfile(user: User): Observable<User | CommonError> {
    const url = `users/profile`;
    return this.httpClient.put<any>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  getEmployes(): Observable<Employe[]> {
   const url = `employes`;
    return this.httpClient.get<Employe[]>(url )
}
getArticles(): Observable<ArticleResource[]> {
  const url = `public-articles`;
   return this.httpClient.get<ArticleResource[]>(url )
}
}

