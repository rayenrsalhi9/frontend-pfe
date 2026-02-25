import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./role-user.routing";
import { SharedModule } from "@app/shared/shared.module";
import { RoleUserComponent } from "./role-user.component";

@NgModule({
  declarations: [RoleUserComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class RoleUserModule {}
