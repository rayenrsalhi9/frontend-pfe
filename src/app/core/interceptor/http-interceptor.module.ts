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
      this.router.navigate(["login"]);
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
    if (token || guestToken) {
      let usedToken = token ? token : guestToken;
      const newReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + usedToken),
        url: `${baseUrl}${url}`,
      });
      return next.handle(newReq).pipe(
        tap(
          () => {},
          (err: any) => {
            if (err instanceof HttpErrorResponse) {
              this.handleApiError(err);
            }
          },
        ),
      );
    } else {
      const newReq = req.clone({
        url: `${baseUrl}${url}`,
      });
      return next.handle(newReq).pipe(
        tap(
          () => {},
          (err: any) => {
            if (err instanceof HttpErrorResponse) {
              this.handleApiError(err);
            }
          },
        ),
      );
    }
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