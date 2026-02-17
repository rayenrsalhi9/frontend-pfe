import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, delay } from 'rxjs/operators';
import { CommonHttpErrorService } from '../error-handler/common-http-error.service';
import { CommonError } from '../error-handler/common-error';
import { Router } from '@angular/router';
import { CompanyProfile } from '@app/shared/enums/company-profile';
import { environment } from 'src/environments/environment';
import { UserAuth } from '@app/shared/enums/user-auth';
import { ClonerService } from '@app/shared/services/clone.service';
import { PusherService } from '@app/shared/services/pusher.service';
import { NotificationSystem } from '@app/shared/services/notification-system.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  securityObject: UserAuth = new UserAuth();
  tokenTime: Date;
  clearTimeOutData: any;
  private securityObject$: BehaviorSubject<UserAuth> = new BehaviorSubject<UserAuth>(null);
  private _companyProfile$: BehaviorSubject<CompanyProfile> = new BehaviorSubject<CompanyProfile>(null);
  public get SecurityObject(): Observable<UserAuth> {
    return this.securityObject$.asObservable();
  }
  public get companyProfile(): Observable<CompanyProfile> {
    return this._companyProfile$;
  }
  constructor(
    private http: HttpClient,
    private clonerService: ClonerService,
    private commonHttpErrorService: CommonHttpErrorService,
    private pusherService: PusherService,
    private notificationSystem: NotificationSystem,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  isUserAuthenticate(): boolean {
    if (
      this.securityObject?.user?.userName &&
      this.securityObject?.authorisation?.token
    ) {

      if (!this.pusherService.getSocketId()) {
        this.pusherService.connect()
      }

      setTimeout(() => {
        this.refreshToken();
      }, 1000);

      return true;
    } else {
      return this.parseSecurityObj();
    }
  }

  isGuestUser(): boolean {
    const user = localStorage.getItem('guestUser')
    const token = localStorage.getItem('guestToken')

    return user != null || token != null;
  }

  login(entity: any): Observable<UserAuth | CommonError> {
    // Initialize security object
    // this.resetSecurityObject();
    return this.http
      .post<UserAuth>('auth/login', entity)
      .pipe(
        tap((resp) => {
          this.setupPostAuthentication(resp);
          localStorage.removeItem('guestUser');
          localStorage.removeItem('guestToken');
        })
      )
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  forgot(entity: any): Observable<any | CommonError> {

    return this.http
      .post<UserAuth>('auth/forgot', entity)
      .pipe(
        tap((resp) => {

        }))
  }

  verifiy(entity: any): Observable<any | CommonError> {

    return this.http
      .post<UserAuth>('auth/verify', entity)
      .pipe(
        tap((resp) => {

        }))
  }

  reset(entity: any): Observable<any | CommonError> {
    return this.http
    .post<UserAuth>('auth/reset-password', entity)
    .pipe(
      tap((resp) => {

      }))
  }


  subscribeGuest(entity: any): Observable<any | CommonError> {
    // Initialize security object
    // this.resetSecurityObject();
    return this.http
      .post<UserAuth>('auth/subscribe', entity)
      .pipe(
        tap((resp) => {
          console.log(resp);

          localStorage.setItem('guestUser', JSON.stringify(resp.user));
          localStorage.setItem('guestToken', resp.authorisation.token);

          window.location.reload()
          /* this.tokenTime = new Date();

          this.securityObject = this.clonerService.deepClone<UserAuth>(resp);
          this.securityObject.tokenTime = new Date();
          localStorage.setItem('currentUser', JSON.stringify(this.securityObject));
          localStorage.setItem(
            'bearerToken',
            this.securityObject.authorisation.token
          );
          this.securityObject$.next(resp);
          this.pusherService.connect()
          this.pusherService.subscribeToChannel(`user.${this.securityObject.user.id}`,'notification',(data)=>{
            if(data.type == 'message') {
              this.notificationSystem.sendNotification(data.data.message)
            }
          })
          this.refreshToken(); */
        })
      )
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  refreshToken() {
    const currentDate: Date = new Date();
    currentDate.setMinutes(
      currentDate.getMinutes() - environment.tokenExpiredTimeInMin
    );
    let diffTime;
    if (this.clearTimeOutData) {
      clearTimeout(this.clearTimeOutData);
    }
    if (!this.tokenTime) {
      diffTime = 1000;
      this.tokenTime = new Date();
    } else {
      diffTime = Math.abs(this.tokenTime.getTime() - currentDate.getTime());
    }

    this.clearTimeOutData = setTimeout(() => {
      clearTimeout(this.clearTimeOutData);
      this.refresh()
        .pipe(delay(1000))
        .subscribe((userAuth: UserAuth) => {
          this.updateSecurityData(userAuth);
          this.refreshToken();
        });
    }, diffTime);
  }

  refresh(): Observable<UserAuth | CommonError> {
    return this.http
      .post<UserAuth>('auth/refresh', {})
      .pipe(
        tap((resp) => {
          this.updateSecurityData(resp);
        })
      )
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  private parseSecurityObj(): boolean {
    const securityObjectString = localStorage.getItem('currentUser');
    if (!securityObjectString) {
      return false;
    }
    const secuObj = JSON.parse(securityObjectString);
    this.tokenTime = new Date(secuObj.tokenTime);
    this.securityObject = this.clonerService.deepClone<UserAuth>(secuObj);
    if (
      this.securityObject.user.userName &&
      this.securityObject.authorisation.token
    ) {
      this.securityObject$.next(this.securityObject);
      return true;
    }
    return false;
  }

  private setupPostAuthentication(resp: UserAuth): void {
    this.tokenTime = new Date();
    this.securityObject = this.clonerService.deepClone<UserAuth>(resp);
    this.securityObject.tokenTime = new Date();
    localStorage.setItem('currentUser', JSON.stringify(this.securityObject));
    localStorage.setItem(
      'bearerToken',
      this.securityObject.authorisation.token
    );
    this.securityObject$.next(resp);
    this.pusherService.connect()
    this.pusherService.subscribeToChannel(`user.${this.securityObject.user.id}`, 'notification', (data) => {
      if (data.type == 'message') {
        this.notificationSystem.sendNotification(data.data.message)
      }
    })
    this.refreshToken();
  }

  private updateSecurityData(userAuth: UserAuth): void {
    this.tokenTime = new Date();
    this.securityObject = this.clonerService.deepClone<UserAuth>(userAuth);
    this.securityObject.tokenTime = new Date();
    localStorage.setItem('currentUser', JSON.stringify(this.securityObject));
    localStorage.setItem(
      'bearerToken',
      this.securityObject.authorisation.token
    );
    this.securityObject$.next(userAuth);
  }

  logout(): void {
    // Get user ID before resetting security object
    const userId = this.securityObject?.user?.id;
    
    // Always reset security object regardless of backend response
    this.resetSecurityObject();
    
    // Only call logout API if we have a valid user ID
    if (userId) {
      this.http.post('auth/logout', {user: userId}).pipe(
        catchError(err => {
          console.error('Backend logout failed:', err);
          return of(null);
        })
      ).subscribe();
    }
  }

  updateProfile(companyProfile: CompanyProfile) {
    if (companyProfile.logoUrl) {
      companyProfile.logoUrl = `${environment.apiUrl}${companyProfile.logoUrl}`;
    }
    if (companyProfile.bannerUrl) {
      companyProfile.bannerUrl = `${environment.apiUrl}${companyProfile.bannerUrl}`;
    }
    this._companyProfile$.next(companyProfile);
  }

  resetSecurityObject(): void {
    this.securityObject = {
      isAuthenticated: false,
      claims: [],
      user: {
        id: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        userName: '',
        email: '',
      },
      status: '',
      authorisation: {
        token: '',
        type: '',
      },
      tokenTime: new Date(),
    };

     localStorage.removeItem('currentUser');
     localStorage.removeItem('bearerToken');
     localStorage.removeItem('guestUser');
     localStorage.removeItem('guestToken');
    this.pusherService.disconnect()
    this.securityObject$.next(null);
    this.router.navigate(['/']);
  }

  hasClaim(claimType: any, claimValue?: any): boolean {
    let ret = false;
    // See if an array of values was passed in.
    if (typeof claimType === 'string') {
      ret = this.isClaimValid(claimType, claimValue);
    } else {
      const claims: string[] = claimType;
      if (claims) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }
    // return true;
    return ret;
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret = false;
    let auth: UserAuth = null;
    // Retrieve security object
    auth = this.securityObject;
    if (auth) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(':') >= 0) {
        const words: string[] = claimType.split(':');
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : 'true';
      }
      // Attempt to find the claim
      ret = auth.claims.find((c) => c.toLowerCase() == claimType) != null;
    }
    return ret;
  }

  getUserDetail(): UserAuth {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      return null;
    }
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user JSON:', error);
      return null;
    }
  }

  setUserDetail(user: UserAuth) {
    this.securityObject = this.clonerService.deepClone<UserAuth>(user);
    localStorage.setItem('currentUser', JSON.stringify(this.securityObject));
    this.securityObject$.next(user)
  }

  register(entity: any): Observable<UserAuth | CommonError> {
    return this.http
      .post<UserAuth>('auth/register', entity)
      .pipe(
        tap((resp) => {
          this.setupPostAuthentication(resp);
        })
      )
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
