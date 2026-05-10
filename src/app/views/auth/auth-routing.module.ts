import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ForgotFormComponent } from "./components/forgot-form/forgot-form.component";
import { VerifyFormComponent } from "./components/verify-form/verify-form.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forgot",
    component: ForgotFormComponent,
  },
  {
    path: "reset/:token/:email",
    component: ResetPasswordComponent,
  },
  {
    path: "verify/:email",
    component: VerifyFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
