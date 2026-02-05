import { NgModule } from '@angular/core';
import { AppsRoutingModule } from './apps.routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    AppsRoutingModule,
    SharedModule
  ],
  providers: []
})
export class AppsModule {}
