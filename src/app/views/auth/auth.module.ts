import { NgModule } from "@angular/core";
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "@app/shared/shared.module";
import { LogoModule } from "@app/shared/components/logo/logo.module";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { LoginComponent } from "./login/login.component";
import { ToastrModule } from "ngx-toastr";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpRequestInterceptor } from "@app/core/interceptor/http-interceptor.module";
import { ForgotFormComponent } from "./components/forgot-form/forgot-form.component";
import { VerifyFormComponent } from "./components/verify-form/verify-form.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent,
    ForgotFormComponent,
    VerifyFormComponent,
    ResetPasswordComponent,
  ],
  imports: [
    AuthRoutingModule,
    SharedModule,
    LogoModule,
    LogoModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {}
