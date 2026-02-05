import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Message } from '@app/shared/enums/conversation';
import { WildcardSearch } from '@app/shared/utils/WildcardSearch';
import { NumberFormatStyle } from '@angular/common';
import { PusherService } from '@app/shared/services/pusher.service';
import { ConversationService } from '@app/shared/services/conversation.service';
import { Conversation } from '@app/shared/enums/conversation';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddConversationComponent } from './add-conversation/add-conversation.component';
import { SecurityService } from '@app/core/security/security.service';
import { User } from '@app/shared/enums/user-auth';
import { CommonService } from '@app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  users: User[] = []
  usersTemp: User[] = []
  conversations: Conversation[] = []
  conversationsTemp: Conversation[] = []
  selectedId: string | NumberFormatStyle
  oldSelectedId: string | NumberFormatStyle
  mobilePanelOpen: boolean
  user: User
  bsModalRef: BsModalRef;
  momentLang:any


  constructor(
    private cdr: ChangeDetectorRef,
    private pusherService: PusherService,
    private conversationService: ConversationService,
    private securityService: SecurityService,
    private toastrService:ToastrService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private translateService: TranslateService,
  ) {
    this.fetch()
  }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.initConversations()
    this.user = this.securityService.getUserDetail().user
    this.getUsers()
    this.initChatChannel()
    this.momentLang = this.translateService.currentLang.split('_')[0]

  }

  getUsers() {
    this.commonService.getUsers().subscribe((users: User[]) => {
      this.users = users
      this.usersTemp = users
      this.cdr.markForCheck()
    });
    this.cdr.detectChanges()
  }

  initConversations() {
    this.conversationService.getConversations().subscribe(
      (data: Conversation[]) => {
        let sortedData = data.sort(function (a: any, b: any) {
          return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
        });
        this.conversations = sortedData
        this.conversationsTemp = sortedData
        /* if(data.length > 0) this.selectChat(data[0]) */
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  initChatChannel() {
    this.pusherService.subscribeToChannel('user.' + this.user.id, 'chat-update', (data: any) => {
      this.updateChat(data.data)
    })
  }

  newConversation(data: any) {
    this.conversationService.createConversation({
      users: [data.id, this.user.id]
    }).subscribe(
      (data: Conversation) => {
        this.selectChat(data)
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  ngOnDestroy(): void {
    this.pusherService.unsubscribeFromChannel('private-conversation.' + this.oldSelectedId)
    this.pusherService.unsubscribeFromChannel('user.' + this.user.id)
  }

  fetch(id = '1') {
  }

  selectChat(item: Conversation) {

    this.selectedId = item.id

    if (this.oldSelectedId != this.selectedId) {
      this.pusherService.unsubscribeFromChannel('private-conversation.' + this.oldSelectedId)
      this.oldSelectedId = this.selectedId
    }

    this.mobilePanelOpen = false
  }

  createGroup() {
    this.modalService.show(AddConversationComponent, { initialState: { conversationId: null, type: 'group' } }).content.onClose.subscribe(
      (data: Conversation) => {
        this.updateConversation(data);
      }
    )
  }

  updateChat(data: Message) {

    let updatedConversations = this.conversationsTemp.map((conversation: Conversation) => {
      if (conversation.id == data.conversation.id) {
        return {
          ...conversation,
          title: conversation.title,
          lastMessage: data
        }
      } else {
        return conversation
      }
    })

    const conversationFound = updatedConversations.some((conversation: Conversation) => conversation.id === data.conversation.id);
    if (!conversationFound) {
      updatedConversations.push({
        id: data.conversation.id,
        createdAt: data.conversation.createdAt,
        updatedAt: data.conversation.updatedAt,
        title: data.conversation.title,
        users: data.conversation.users,
        lastMessage: data
      });
    }

    let sortedData = updatedConversations.sort(function (a: any, b: any) {
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });

    this.conversationsTemp = sortedData
    this.conversations = sortedData

    this.cdr.markForCheck()
  }

  updateConversation(data: Conversation) {

    let updatedConversations = this.conversations.map((conversation: Conversation) => {
      if (conversation.id == data.id) {
        return {
          ...conversation,
          title: data.title,
          users: data.users,
          lastMessage: data.lastMessage
        }
      } else {
        return conversation
      }
    })

    this.conversations = updatedConversations
    this.conversationsTemp = updatedConversations

    this.selectChat(data)
    this.cdr.markForCheck()
  }

  serach(e) {

    const searchValue = e.target.value;

    if (searchValue) {

      const conversationsFound = this.conversations.filter(conver => {
        return conver.users.some(user => {
          const fullName = `${user.firstName} ${user.lastName}`;
          return (
            fullName.includes(searchValue) ||
            user.firstName.includes(searchValue) ||
            user.lastName.includes(searchValue) ||
            user.email.includes(searchValue)
          );
        });
      });

      const foundUsers = this.users.filter(usr => {
        const fullName = `${usr.firstName} ${usr.lastName}`;
        return (
          (searchValue && fullName.includes(searchValue)) ||
          (searchValue && usr.firstName.includes(searchValue)) ||
          (searchValue && usr.lastName.includes(searchValue)) ||
          (searchValue && usr.email.includes(searchValue))
        );
      });

      this.conversations = conversationsFound;
      this.users = foundUsers;

    } else {
      this.users = this.usersTemp;
      this.conversations = this.conversationsTemp;
    }


  }

  deleteConversation(event, conversation: Conversation) {

    this.translateService.get('CHAT.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });
    }); 

    this.bsModalRef.content.onClose.subscribe(result => {
      if (result) {

        this.conversationService.deleteConversation(conversation.id).subscribe(
          (data: any) => {
            this.pusherService.unsubscribeFromChannel('private-conversation.' + conversation.id)
            this.initConversations()
            this.translateService.get('CHAT.DELETE.TOAST.CONVERSATION_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
              this.toastrService.success(translatedMessage); // Display translated message using Toastr
            }); 
            if (this.selectedId == conversation.id) this.selectedId = null
          }
        )

      }
    })


    event.stopPropagation();


  }

  onMobilePanelToggleOpen() {
    this.mobilePanelOpen = true
  }
}
