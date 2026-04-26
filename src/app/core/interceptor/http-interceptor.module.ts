import { Injectable, NgModule } from "@angular/core";
import { Observable } from "rxjs";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  private handleApiError(err: HttpErrorResponse): void {
    if (err.status === 401) {
      const currentUrl = this.router.url;
      if (currentUrl.startsWith('/login')) {
        return;
      }
      const returnUrl = new URL(currentUrl, window.location.origin).searchParams.get('returnUrl');
      if (returnUrl && returnUrl === currentUrl) {
        return;
      }
      this.router.navigate(["/login"], { queryParams: { returnUrl: currentUrl } });
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("bearerToken");
    const guestToken = localStorage.getItem("guestToken");
    const baseUrl = environment.apiUrl;
    if (req.url.lastIndexOf("i18n") > -1) {
      return next.handle(req);
    }
    let url = req.url.lastIndexOf("api") > -1 ? req.url : "api/" + req.url;
    const lastChar = url.substring(url.length - 1);
    if (lastChar == "/") {
      url = url.substring(0, url.length - 1);
    }

    let newReq: HttpRequest<any>;
    if (token || guestToken) {
      let usedToken = token ? token : guestToken;
      newReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + usedToken),
        url: `${baseUrl}${url}`,
      });
    } else {
      newReq = req.clone({
        url: `${baseUrl}${url}`,
      });
    }

    return next.handle(newReq).pipe(
      tap({
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.handleApiError(err);
          }
        },
      }),
    );
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
})
export class HttpInterceptorModule {}