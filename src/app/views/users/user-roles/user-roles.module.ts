import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared/shared.module";
import { routes } from "./user-roles.routing";
import { UserRolesComponent } from "./user-roles.component";

@NgModule({
  declarations: [UserRolesComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class UserRolesModule {}
