import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PerfectScrollbarComponent } from "ngx-perfect-scrollbar";
import { PusherService } from "@app/shared/services/pusher.service";
import { ConversationService } from "@app/shared/services/conversation.service";
import { Conversation, Message } from "@app/shared/enums/conversation";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AddConversationComponent } from "../add-conversation/add-conversation.component";
import { AddUserComponent } from "../add-user/add-user.component";
import { CreateGroupComponent } from "../create-group/create-group.component";
import { environment } from "src/environments/environment";
import { User } from "@app/shared/enums/user-auth";
import { UpdateConversationComponent } from "../update-conversation/update-conversation.component";
import { ImageModalComponent } from "../image-modal/image-modal.component";
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { UsersConversationComponent } from "../users-conversation/users-conversation.component";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "conversation",
  templateUrl: "./conversation.component.html",
  styleUrls: ["./conversation.component.scss"],
  host: { "[class.conversation]": "true" },
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild("chatPS") chatPS: PerfectScrollbarComponent;

  conversation: Conversation;
  message: string = "";
  title: string;
  avatar: string;

  private _id: number | string;
  isOpen: boolean = false;
  isScrolled: boolean = false;
  reactionToggle: any = null;

  showFlag: boolean = false;
  selectedImage: any = [];
  isSending: boolean = false;

  private destroy$ = new Subject<void>();
  private chatLoadCancel$ = new Subject<void>();

  @Input() set chatId(id: number | string) {
    this.fetchChatDetail(id as string);
    this._id = id;
  }

  @Input() user: User;

  get chatId(): number | string {
    return this._id;
  }

  get isGroupConversation(): boolean {
    return (
      (this.conversation?.title != null && this.conversation?.title !== "") ||
      this.conversation?.users?.length > 2
    );
  }

  @Output() updateChat = new EventEmitter<Message>();
  @Output() updateConversation = new EventEmitter<Conversation>();
  @Output() openMobilePanel = new EventEmitter<void>();

  public bsModalRef: BsModalRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private pusherService: PusherService,
    private conversationService: ConversationService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chatLoadCancel$.next();
    this.chatLoadCancel$.complete();
    if (this._id) {
      this.pusherService.unsubscribeFromChannel(
        `private-conversation.${this._id}`,
      );
    }
  }

  getHost() {
    return environment.apiUrl;
  }

  handleUpdateChat() {
    const initialState = { conversation: Object.assign({}, this.conversation) };
    this.modalService.show(UpdateConversationComponent, { initialState });
  }

  handleShowUsers() {
    const initialState = { conversation: Object.assign({}, this.conversation) };
    this.modalService.show(UsersConversationComponent, { initialState });
  }

  handleEmojiBar() {
    this.isOpen = !this.isOpen;
  }

  ngAfterViewChecked() {
    if (!this.isScrolled) {
      this.scrollToBottom();
      this.isScrolled = true;
    }
  }

  handlerRactionToggle(message: Message) {
    this.reactionToggle =
      this.reactionToggle !== null && this.reactionToggle === message.id
        ? null
        : message.id;
  }

  handleSelection(event: any) {
    this.message = this.message
      ? this.message + event.emoji.native
      : event.emoji.native;
  }

  fetchChatDetail(id: string) {
    if (id == null) {
      this.conversation = null;
      this.message = "";
      if (this._id) {
        this.pusherService.unsubscribeFromChannel(
          `private-conversation.${this._id}`,
        );
      }
      return;
    }

    if (this._id && this._id !== id) {
      this.pusherService.unsubscribeFromChannel(
        `private-conversation.${this._id}`,
      );
    }

    this.isScrolled = false;

    this.chatLoadCancel$.next();

    this.conversationService
      .getMessages(id)
      .pipe(takeUntil(this.chatLoadCancel$), takeUntil(this.destroy$))
      .subscribe({
        next: (data: Conversation) => {
          this.conversation = data;

          if (this.conversation.title) {
            this.title = this.conversation.title;
          } else {
            const usr = this.conversation.users.find(
              (u) => u.id !== this.user.id,
            );
            this.title = usr ? `${usr.firstName} ${usr.lastName}` : "";
          }

          const otherUser = this.conversation.users.find(
            (u: User) => u.id !== this.user.id,
          );
          this.avatar = otherUser ? otherUser.avatar : null;

          this.initChannel(data.id);
          this.initMessageSeenEvent(data.id);
          this.initMessageReaction(data.id);
          this.cdr.detectChanges();
          this.scrollToBottom();
        },
        error: () => {
          this.conversation = null;
          this.translate
            .get("CHAT.ERROR.LOAD_MESSAGES_FAILED")
            .subscribe((msg: string) => {
              this.toastr.error(msg);
            });
          this.cdr.markForCheck();
        },
      });
  }

  initChannel(id: any) {
    this.pusherService.subscribeToChannel(
      `private-conversation.${id}`,
      `message`,
      (data: any) => {
        this.conversation.messages.push(data.data);
        this.updateChat.emit(data.data);
        this.playAudio("/assets/songs/messageReceived.mp3");
        this.messageIsSeen(data.data);
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
    );
  }

  messageIsSeen(data: Message) {
    this.conversationService
      .seenMessage(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        const messageRead: Message = res;
        this.updateChat.emit(messageRead);
        const idx = this.conversation.messages.findIndex(
          (x) => x.id === messageRead.id,
        );
        if (idx > -1) {
          this.conversation.messages[idx] = {
            ...messageRead,
            isRead: messageRead.isRead.date,
          };
        }
        this.cdr.markForCheck();
      });
  }

  initMessageSeenEvent(id: any = null) {
    this.pusherService.subscribeToChannel(
      `private-conversation.${id}`,
      `message-seen`,
      (data: any) => {
        const messageRead: Message = data.data;
        this.updateChat.emit(messageRead);
        const idx = this.conversation.messages.findIndex(
          (x) => x.id === messageRead.id,
        );
        if (idx > -1) {
          this.conversation.messages[idx] = {
            ...messageRead,
            isRead: messageRead.isRead.date,
          };
        }
        this.cdr.markForCheck();
      },
    );
  }

  initMessageReaction(id: any = null) {
    this.pusherService.subscribeToChannel(
      `private-conversation.${id}`,
      `message-reaction`,
      (data: any) => {
        const messageRead: Message = data.data;
        const idx = this.conversation.messages.findIndex(
          (x) => x.id === messageRead.id,
        );
        if (idx > -1) {
          this.conversation.messages[idx] = {
            ...messageRead,
            isRead: messageRead.isRead.date,
          };
        }
        this.cdr.markForCheck();
      },
    );
  }

  addUser() {
    this.modalService
      .show(AddUserComponent, {
        class: "modal-form-container",
        initialState: {
          conversationId: this.conversation.id,
          currentMembers: this.conversation.users,
        },
      })
      .content.onClose.pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data.conversation) {
          if (data.conversation.title) {
            this.title = data.conversation.title;
          }
          if (data.conversation.users) {
            this.conversation.users = data.conversation.users;
          }
          this.cdr.markForCheck();
        }
        this.updateConversation.emit(data.conversation);
      });
  }

  createGroup() {
    this.modalService
      .show(CreateGroupComponent, {
        class: "modal-form-container",
      })
      .content.onClose.pipe(takeUntil(this.destroy$))
      .subscribe((data: Conversation) => {
        this.updateConversation.emit(data);
      });
  }

  openNewConversation() {
    this.modalService
      .show(AddConversationComponent, {
        class: "modal-form-container",
        initialState: {
          type: "user",
        },
      })
      .content.onClose.pipe(takeUntil(this.destroy$))
      .subscribe((data: Conversation) => {
        if (data && data.id) {
          this.updateConversation.emit(data);
        }
      });
  }

  sendMessage(type = "msg", file = null) {
    if (this.isSending) {
      return;
    }

    this.isOpen = false;

    const trimmedMessage = this.message ? this.message.trim() : null;

    if (!trimmedMessage && !file) {
      return;
    }

    this.isSending = true;

    const message: Message = {
      content: file ? file : trimmedMessage,
      type: type,
      conversation: { id: this.conversation.id },
    };

    this.conversationService
      .setMessage(message)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Message) => {
          this.conversation.messages.push(data);
          this.updateChat.emit(data);
          this.message = "";
          this.isSending = false;
          this.playAudio("/assets/songs/messageSent.mp3");
          this.cdr.markForCheck();
          this.scrollToBottom();
        },
        error: () => {
          this.isSending = false;
          this.translate
            .get("CHAT.ERROR.SEND_MESSAGE_FAILED")
            .subscribe((msg: string) => {
              this.toastr.error(msg);
            });
          this.cdr.markForCheck();
        },
      });
  }

  onFileSelect($event: Event) {
    const fileSelected: File = ($event.target as HTMLInputElement).files[0];
    if (!fileSelected) {
      return;
    }

    const mimeType = fileSelected.type;
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    reader.onload = () => {
      this.sendMessage(mimeType.split("/")[0], reader.result);
    };
  }

  onMessageReact(type: string, message: Message) {
    this.conversationService
      .reactionMessage({ mid: message.id, type: type, uid: this.user.id })
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Message) => {
        const idx = this.conversation.messages.findIndex(
          (x) => x.id === data.id,
        );
        if (idx > -1) {
          this.conversation.messages[idx] = data;
        }
        this.reactionToggle = null;
        this.cdr.markForCheck();
      });
  }

  onInputMessageFocus() {
    if (this.conversation && this.conversation.messages.length > 0) {
      const lastMessage =
        this.conversation.messages[this.conversation.messages.length - 1];
      if (
        lastMessage &&
        !lastMessage.isRead &&
        lastMessage.sender?.id !== this.user.id
      ) {
        this.messageIsSeen(lastMessage);
      }
    }
  }

  scrollToBottom(): void {
    try {
      this.chatPS.directiveRef.scrollToBottom();
    } catch (e) {}
  }

  onMobilePanelOpen() {
    this.openMobilePanel.emit();
  }

  showLightbox(data: string) {
    const initialState = { data: data };
    this.modalService.show(ImageModalComponent, { initialState });
  }

  closeEventHandler() {
    this.showFlag = false;
    this.selectedImage = [];
  }

  getReactionSummary(reactions: any[]): string {
    if (!reactions || reactions.length === 0) {
      return "";
    }

    const counts: { [key: string]: number } = {};
    const icons: { [key: string]: string } = {
      heart: "❤️",
      like: "👍",
      dislike: "👎",
    };

    for (const reaction of reactions) {
      const type = reaction.type || reaction;
      counts[type] = (counts[type] || 0) + 1;
    }

    const parts: string[] = [];
    for (const [type, count] of Object.entries(counts)) {
      const icon = icons[type] || type;
      parts.push(`${count > 1 ? count : ""}${icon}`);
    }

    return parts.join(" ");
  }

  private playAudio(src: string) {
    try {
      const audio = new Audio(src);
      audio.play().catch(() => {});
    } catch (e) {}
  }
}
