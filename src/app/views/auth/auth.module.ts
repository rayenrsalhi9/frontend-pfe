import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { LogoModule } from '@app/shared/components/logo/logo.module';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

import { LoginComponent } from'./login/login.component';
import { LoginV2Component } from './login-v2/login-v2.component';
import { LoginV3Component } from './login-v3/login-v3.component';
import { RegisterComponent } from './register/register.component';
import { RegisterV2Component } from './register-v2/register-v2.component';
import { RegisterV3Component } from './register-v3/register-v3.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from '@app/core/interceptor/http-interceptor.module';
import { ForgotFormComponent } from './components/forgot-form/forgot-form.component';
import { VerifyFormComponent } from './components/verify-form/verify-form.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterFormComponent,
        LoginFormComponent,
        LoginV2Component,
        LoginV3Component,
        RegisterComponent,
        RegisterV2Component,
        RegisterV3Component,
        ForgotFormComponent,
        VerifyFormComponent,
        ResetPasswordComponent
    ],
    imports: [
        AuthRoutingModule,
        SharedModule,
        LogoModule,
        LogoModule,
        ToastrModule.forRoot(),
    ],
    providers:[
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpRequestInterceptor,
        multi: true,
      }
    ]
})
export class AuthModule { }
