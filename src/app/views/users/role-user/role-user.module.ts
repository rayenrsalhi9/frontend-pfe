import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './role-user.routing';
import { SharedModule } from '@app/shared/shared.module';
import { RoleUserComponent } from './role-user.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    RoleUserComponent
  ],
  imports: [
    SharedModule,
    DragDropModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class RoleUserModule { }
