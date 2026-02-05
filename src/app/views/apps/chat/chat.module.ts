import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { routes } from './chat.routing.module';
import { RouterModule } from '@angular/router';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { ColumnPanelModule } from '@app/shared/components/column-panel/column-panel.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ChatComponent } from './chat.component';
import { ConversationComponent } from './conversation/conversation.component';

import { ChatService } from './chat.service';
import { AddConversationComponent } from './add-conversation/add-conversation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { MomentModule } from 'ngx-moment';
import { UploadModule } from '@app/shared/components/upload/upload.module';
import { PickerComponent, PickerModule } from '@ctrl/ngx-emoji-mart';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { UpdateConversationComponent } from './update-conversation/update-conversation.component';
import { CommonModule } from '@angular/common';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UsersConversationComponent } from './users-conversation/users-conversation.component';

@NgModule({
  declarations: [
    ChatComponent,
    ConversationComponent,
    AddConversationComponent,
    UpdateConversationComponent,
    ImageModalComponent,
    UsersConversationComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    PickerModule,
    ModalModule.forRoot(),
    ColumnPanelModule,
    AvatarModule,
    NgImageFullscreenViewModule,
    BsDropdownModule.forRoot(),
    NgSelectModule,
    MomentModule,
    UploadModule.forRoot(),
    TooltipModule.forRoot(),
    PerfectScrollbarModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: [
    ChatService,
  ],
})
export class ChatModule { }
