import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './smpt-add.routes';
import { SmtpAddComponent } from './smtp-add.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@app/shared/shared.module';
import { SwitchModule } from '@app/shared/components/switch/switch.module';



@NgModule({
  declarations: [
    SmtpAddComponent
  ],
  imports: [
    SharedModule,
    SwitchModule,
    CommonModule,
    NgSelectModule,
    RouterModule.forChild(routes),
  ]
})
export class SmtpAddModule { }
