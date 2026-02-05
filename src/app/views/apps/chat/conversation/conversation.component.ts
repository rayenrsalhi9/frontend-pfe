import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { PusherService } from '@app/shared/services/pusher.service';
import { ConversationService } from '@app/shared/services/conversation.service';
import { Conversation, Message } from '@app/shared/enums/conversation';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddConversationComponent } from '../add-conversation/add-conversation.component';
import { environment } from 'src/environments/environment';
import { User } from '@app/shared/enums/user';
import { UpdateConversationComponent } from '../update-conversation/update-conversation.component';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { UsersConversationComponent } from '../users-conversation/users-conversation.component';

@Component({
  selector: 'conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  host: {'[class.conversation]': 'true'},
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class ConversationComponent implements OnInit {

  @ViewChild('chatPS') chatPS: PerfectScrollbarComponent;
  conversation: Conversation
  message: string
  toggled: boolean
  title: string
  avatar:string

  private _id: string;
  isOpen:boolean = false
  isScrolled:boolean = false
  reactionToggle:any = false

  @Input() set chatId(id) {
    this._id = id;
    this.fetchChatDetail(id);
  }
  @Input() user: User

  get chatId(): string {
    return this._id;
  }

  showFlag: boolean = false;
  selectedImage:any = []

  @Output() updateChat: EventEmitter<Message> = new EventEmitter<Message>();
  @Output() updateConversation: EventEmitter<Conversation>  = new EventEmitter<Conversation>();
  @Output() openMobilePanel = new EventEmitter();
  public bsModalRef: BsModalRef

  constructor(
    private cdr: ChangeDetectorRef,
    private pusherService: PusherService,
    private conversationService: ConversationService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {

  }

  handleUpdateChat() {

    const initialState = {
      conversation: Object.assign({}, this.conversation),
    };

    this.modalService.show(UpdateConversationComponent,{initialState:initialState})
  }

  handleShowUsers() {
    const initialState = {
      conversation: Object.assign({}, this.conversation),
    };

    this.modalService.show(UsersConversationComponent,{initialState:initialState})
  }

  getHost() {
    return environment.apiUrl
  }

  handleEmojiBar() {
    this.isOpen = !this.isOpen
  }

  ngAfterViewChecked() {
    if(!this.isScrolled) {
      this.scrollToBottom();
      this.isScrolled = true
    }
  }

  handlerRactionToggle(message:Message) {
    if(this.reactionToggle != null && this.reactionToggle == message.id) {
      this.reactionToggle = null
    } else {
      this.reactionToggle = message.id
    }
  }

  handleSelection(event) {
    this.message = this.message ? this.message + event.emoji.native : event.emoji.native
    /* this.toggled = false; */
  }

  fetchChatDetail(id: string) {

    if(id == null) {
      this.conversation = null
      this.message = null
    }

    if(id) {
      this.conversationService.getMessages(id).subscribe(
        (data: Conversation) => {

          this.conversation = data

          if (this.conversation.title) {
            this.title = this.conversation.title
          } else {
            let usr = this.conversation.users.filter(usr => usr.id != this.user.id)[0]
            this.title = usr.firstName + ' ' + usr.lastName
          }

          this.avatar = this.conversation.users.filter((u:User)=>u.id != this.user.id)[0].avatar

          this.initChannel(data.id)
          this.initMessageSeenEvent(data.id)
          this.initMessageReaction(data.id)
          this.cdr.detectChanges()
          this.scrollToBottom()

        }
      )
    }

  }

  initChannel(id: any) {
    this.pusherService.subscribeToChannel(`private-conversation.${id}`, `message`, (data: any) => {
      this.conversation.messages.push(data.data)
      this.updateChat.emit(data.data)
      var audio = new Audio('/assets/songs/messageReceived.mp3')
      audio.play()
      this.messageIsSeen(data.data)
      this.cdr.detectChanges()
      this.scrollToBottom()

    })
  }

  messageIsSeen(data:Message) {
    this.conversationService.seenMessage(data).subscribe((data:any)=>{
      let messageRead:Message = data
      this.updateChat.emit(messageRead)
      var foundIndex = this.conversation.messages.findIndex(x => x.id == messageRead.id);
      this.conversation.messages[foundIndex] = {...messageRead,isRead:messageRead.isRead.date};
      this.cdr.markForCheck()
    })
  }

  initMessageSeenEvent(id:any=null) {
    this.pusherService.subscribeToChannel(`private-conversation.${id}`, `message-seen`, (data: any) => {
      let messageRead:Message = data.data
      this.updateChat.emit(messageRead)
      var foundIndex = this.conversation.messages.findIndex(x => x.id == messageRead.id);
      this.conversation.messages[foundIndex] = {...messageRead,isRead:messageRead.isRead.date};
      this.cdr.markForCheck()
    })
  }

  initMessageReaction(id:any=null) {
    this.pusherService.subscribeToChannel(`private-conversation.${id}`, `message-reaction`, (data: any) => {
      let messageRead:Message = data.data
      var foundIndex = this.conversation.messages.findIndex(x => x.id == messageRead.id);
      this.conversation.messages[foundIndex] = {...messageRead,isRead:messageRead.isRead.date};
      this.cdr.markForCheck()
    })
  }

  addUser() {
    this.modalService.show(AddConversationComponent,{initialState:{conversationId:this.conversation.id,type:'user'}}).content.onClose.subscribe(
      (data:any)=>{
        if(data.conversation.title) {
          this.title = data.conversation.title
          this.cdr.markForCheck()
        }
        this.updateConversation.emit(data.conversation);
      }
    )
  }

  createGroup() {
    this.modalService.show(AddConversationComponent,{initialState:{conversationId:null,type:'group'}}).content.onClose.subscribe(
      (data:Conversation)=>{
        this.updateConversation.emit(data);
      }
    )
  }

  sendMessage(type = 'msg', file=null) {

    this.isOpen = false
    if(this.message || file) {
      const message: Message = {
        content: file?file:this.message,
        type: type,
        conversation: { id: this.conversation.id }
      }


      this.conversationService.setMessage(message).subscribe(
        (data: Message) => {
          this.conversation.messages.push(data)
          this.updateChat.emit(data)
          this.message = ""
          var audio = new Audio('/assets/songs/messageSent.mp3')
          audio.play()
          this.cdr.markForCheck()
          this.scrollToBottom()
        }
      )
    }


  }

  onFileSelect($event) {

    const fileSelected: File = $event.target.files[0];
    if (!fileSelected) {
      return;
    }

    const extension = fileSelected.name.split('.')[fileSelected.name.split('.').length -1]

    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      //return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    reader.onload = (_event) => {
      this.sendMessage(mimeType.split('/')[0],reader.result)

      /* this.imgSrc = reader.result;
      this.companyProfileForm.patchValue({
        imageData: reader.result.toString(),
        logoUrl: fileSelected.name
      }) */
      /* $event.target.value = '';
      this.cdr.detectChanges() */
    }
  }

  onMessageReact(type:string, message:Message) {
    this.conversationService.reactionMessage({mid:message.id, type:type, uid:this.user.id}).subscribe((data:Message)=>{
      let messageReaction:Message = data
      var foundIndex = this.conversation.messages.findIndex(x => x.id == messageReaction.id);
      this.conversation.messages[foundIndex] = messageReaction;
      this.reactionToggle = null
      this.cdr.markForCheck()
    })
  }

  onInputMessageFocus() {
    if(this.conversation.messages.length >0) {
      let lastMessage =  this.conversation.messages[this.conversation.messages.length -1]

      if(!lastMessage.isRead && lastMessage.sender.id != this.user.id) {
        this.messageIsSeen(lastMessage)
      }
    }
  }

  scrollToBottom(): void {
    this.chatPS.directiveRef.scrollToBottom()
  }

  onMobilePanelOpen() {
    this.openMobilePanel.emit()
  }

  showLightbox(data) {
    console.log(data);

    const initialState = {
      data: data
    };

    this.modalService.show(ImageModalComponent,{initialState:initialState})
    /* this.selectedImage = [{
      image: this.getHost()+data,
      alt:data,
      title:data
    }]
    this.showFlag = true; */
  }

  closeEventHandler() {
    this.showFlag = false;
    this.selectedImage = []
}
}
