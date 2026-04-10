import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Message } from "@app/shared/enums/conversation";
import { PusherService } from "@app/shared/services/pusher.service";
import { ConversationService } from "@app/shared/services/conversation.service";
import { Conversation } from "@app/shared/enums/conversation";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CreateGroupComponent } from "./create-group/create-group.component";
import { SecurityService } from "@app/core/security/security.service";
import { User } from "@app/shared/enums/user-auth";
import { CommonService } from "@app/shared/services/common.service";
import { CommonError } from "@app/shared/enums/common-error";
import { environment } from "src/environments/environment";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "chat",
  templateUrl: "./chat.component.html",
})
export class ChatComponent implements OnInit, OnDestroy {
  users: User[] = [];
  usersTemp: User[] = [];
  filteredUsers: User[] = [];
  conversations: Conversation[] = [];
  conversationsTemp: Conversation[] = [];
  groupConversations: Conversation[] = [];
  groupConversationsTemp: Conversation[] = [];
  selectedId: number | string | null = null;
  oldSelectedId: number | string | null = null;
  mobilePanelOpen: boolean = false;
  user: User;
  bsModalRef: BsModalRef;
  momentLang: any;
  isLoadingConversations: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;

  private destroy$ = new Subject<void>();
  private searchTerm$ = new Subject<string>();
  private currentSearchTerm: string = "";

  constructor(
    private cdr: ChangeDetectorRef,
    private pusherService: PusherService,
    private conversationService: ConversationService,
    private securityService: SecurityService,
    private toastrService: ToastrService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private translateService: TranslateService,
  ) {}

  getHost(): string {
    return environment.apiUrl;
  }

  ngOnInit(): void {
    this.user = this.securityService.getUserDetail().user;
    const currentLang = this.translateService.currentLang;
    this.momentLang = currentLang ? currentLang.split("_")[0] : "en";
    this.getUsers();
    this.initConversations();
    this.initChatChannel();
    this.initSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.oldSelectedId) {
      this.pusherService.unsubscribeFromChannel(
        "private-conversation." + this.oldSelectedId,
      );
    }
    if (this.user) {
      this.pusherService.unsubscribeFromChannel("user." + this.user.id);
    }
  }

  getUsers() {
    this.commonService
      .getUsersWithClaim("CHAT_VIEW_CHATS")
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: User[] | CommonError) => {
          if (this.isCommonError(response)) {
            this.translateService
              .get("CHAT.ERROR.LOAD_USERS_FAILED")
              .subscribe((msg: string) => {
                this.toastrService.error(msg);
              });
            return;
          }
          this.users = response;
          this.usersTemp = response;
          this.filteredUsers = response;
          this.cdr.markForCheck();
        },
        error: () => {
          this.translateService
            .get("CHAT.ERROR.LOAD_USERS_FAILED")
            .subscribe((msg: string) => {
              this.toastrService.error(msg);
            });
        },
      });
  }

  private isCommonError(
    response: User[] | CommonError,
  ): response is CommonError {
    return !Array.isArray(response) && "friendlyMessage" in response;
  }

  initConversations(page: number = 1) {
    this.isLoadingConversations = true;
    this.conversationService
      .getConversations(page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          let safeData: any[] = [];
          if (Array.isArray(response)) {
            safeData = response;
          } else if (response && Array.isArray(response.data)) {
            safeData = response.data;
          } else if (response && typeof response === 'object') {
            safeData = [response];
          }

          const filteredData = safeData.filter(
            (c): c is Conversation => !!c && !!c.id,
          );

          const conversationsWithMessages = filteredData.filter(
            (c) => !!c.lastMessage,
          );

          const oneOnOneConversations = conversationsWithMessages.filter(
            (c) => !c.title && (!c.users || c.users.length <= 2)
          );

          const groupConversations = filteredData.filter(
            (c) => !!c.title || (c.users && c.users.length > 2)
          );

          const dataToUse = this.currentSearchTerm
            ? this.applySearchFilterToConversations(oneOnOneConversations)
            : oneOnOneConversations;

          const groupDataToUse = this.currentSearchTerm
            ? this.applySearchFilterToConversations(groupConversations)
            : groupConversations;

          if (page === 1) {
            this.conversations = dataToUse;
            this.conversationsTemp = oneOnOneConversations;
            this.groupConversations = groupDataToUse;
            this.groupConversationsTemp = groupConversations;
          } else {
            this.conversations = [...this.conversations, ...dataToUse];
            this.conversationsTemp = [
              ...this.conversationsTemp,
              ...oneOnOneConversations,
            ];
            this.groupConversations = [...this.groupConversations, ...groupDataToUse];
            this.groupConversationsTemp = [
              ...this.groupConversationsTemp,
              ...groupConversations,
            ];
          }

          if (response.meta) {
            this.currentPage = response.meta.current_page;
            this.totalPages = response.meta.last_page;
          }

          this.isLoadingConversations = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoadingConversations = false;
          this.translateService
            .get("CHAT.ERROR.LOAD_CONVERSATIONS_FAILED")
            .subscribe((msg: string) => {
              this.toastrService.error(msg);
            });
        },
      });
  }

  loadMoreConversations() {
    if (this.currentPage < this.totalPages && !this.isLoadingConversations) {
      this.initConversations(this.currentPage + 1);
    }
  }

  initChatChannel() {
    this.pusherService.subscribeToChannel(
      "user." + this.user.id,
      "chat-update",
      (data: any) => {
        this.updateChat(data.data);
      },
    );
  }

  /** Wire up the debounced search observable */
  private initSearch() {
    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => this.applySearch(term));
  }

  /** Called from (input) on the search field */
  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.currentSearchTerm = term;
    this.searchTerm$.next(term);
  }

  private applySearch(searchValue: string) {
    this.currentSearchTerm = searchValue;
    if (searchValue) {
      this.conversations = this.conversationsTemp.filter((conver) => {
        if (conver.title) {
          return conver.title.toLowerCase().includes(searchValue.toLowerCase());
        }
        return conver.users?.some((u) => {
          const fullName = `${u.firstName} ${u.lastName}`;
          return (
            fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
            u.email.toLowerCase().includes(searchValue.toLowerCase())
          );
        });
      });
      this.groupConversations = this.groupConversationsTemp.filter((conver) => {
        if (conver.title) {
          return conver.title.toLowerCase().includes(searchValue.toLowerCase());
        }
        return conver.users?.some((u) => {
          const fullName = `${u.firstName} ${u.lastName}`;
          return (
            fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
            u.email.toLowerCase().includes(searchValue.toLowerCase())
          );
        });
      });
      this.users = this.usersTemp.filter((usr) => {
        const fullName = `${usr.firstName} ${usr.lastName}`;
        return (
          fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
          usr.email.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      this.filteredUsers = this.users;
    } else {
      this.users = this.usersTemp;
      this.conversations = this.conversationsTemp;
      this.groupConversations = this.groupConversationsTemp;
      this.filteredUsers = this.usersTemp;
    }
    this.cdr.markForCheck();
  }

  newConversation(data: any) {
    this.conversationService
      .createConversation({ users: [data.id, this.user.id] })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (conversation: Conversation) => {
          const existingIndex = this.conversationsTemp.findIndex(
            (c) => c.id === conversation.id,
          );
          if (existingIndex >= 0) {
            this.conversationsTemp[existingIndex] = conversation;
          } else {
            this.conversationsTemp.unshift(conversation);
          }
          this.conversations = this.currentSearchTerm
            ? this.applySearchFilterToConversations(this.conversationsTemp)
            : [...this.conversationsTemp];
          this.selectChat(conversation);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.translateService
            .get("CHAT.ERROR.CREATE_CONVERSATION_FAILED")
            .subscribe((msg: string) => {
              this.toastrService.error(msg);
            });
        },
      });
  }

  selectChat(item: Conversation) {
    this.selectedId = item.id;
    if (this.oldSelectedId && this.oldSelectedId !== this.selectedId) {
      this.pusherService.unsubscribeFromChannel(
        "private-conversation." + this.oldSelectedId,
      );
    }
    this.oldSelectedId = this.selectedId;
    this.mobilePanelOpen = false;
  }

  createGroup() {
    this.modalService
      .show(CreateGroupComponent, {
        class: "modal-form-container",
      })
      .content.onClose.pipe(takeUntil(this.destroy$))
      .subscribe((data: Conversation) => {
        this.updateConversation(data);
      });
  }

  updateChat(data: Message) {
    const isGroup = !!data.conversation.title || (data.conversation.users && data.conversation.users.length > 2);

    const newConversation = {
      ...this.conversationsTemp.find((c) => c.id === data.conversation.id),
      id: data.conversation.id,
      createdAt: data.conversation.createdAt,
      updatedAt: data.conversation.updatedAt,
      title: data.conversation.title,
      users: data.conversation.users,
      lastMessage: data,
    };

    if (isGroup) {
      const groupUpdatedConversations = this.groupConversationsTemp.filter(
        (c) => c.id !== data.conversation.id,
      );
      groupUpdatedConversations.unshift(newConversation);
      this.groupConversationsTemp = groupUpdatedConversations;

      if (this.currentSearchTerm) {
        this.groupConversations = this.applySearchFilterToConversations(groupUpdatedConversations);
      } else {
        this.groupConversations = groupUpdatedConversations;
      }
    } else {
      let updatedConversations = this.conversationsTemp.filter(
        (c) => c.id !== data.conversation.id,
      );
      updatedConversations.unshift(newConversation);
      this.conversationsTemp = updatedConversations;

      if (this.currentSearchTerm) {
        this.conversations = this.applySearchFilterToConversations(updatedConversations);
      } else {
        this.conversations = updatedConversations;
      }
    }
    this.cdr.markForCheck();
  }

  private applySearchFilterToConversations(
    conversations: Conversation[],
  ): Conversation[] {
    const searchValue = this.getCurrentSearchTerm();
    if (searchValue) {
      return conversations.filter((conver) => {
        if (conver.title) {
          return conver.title.toLowerCase().includes(searchValue.toLowerCase());
        }
        return conver.users?.some((u) => {
          const fullName = `${u.firstName} ${u.lastName}`;
          return (
            fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
            u.email.toLowerCase().includes(searchValue.toLowerCase())
          );
        });
      });
    }
    return conversations;
  }

  private getCurrentSearchTerm(): string {
    return this.currentSearchTerm;
  }

  updateConversation(data: Conversation) {
    const isGroup = !!data.title || (data.users && data.users.length > 2);
    
    let updated = this.conversationsTemp.map((conversation: Conversation) => {
      if (conversation.id === data.id) {
        return {
          ...conversation,
          title: data.title,
          users: data.users,
          lastMessage: data.lastMessage,
        };
      }
      return conversation;
    });

    let groupUpdated = this.groupConversationsTemp.map((conversation: Conversation) => {
      if (conversation.id === data.id) {
        return {
          ...conversation,
          title: data.title,
          users: data.users,
          lastMessage: data.lastMessage,
        };
      }
      return conversation;
    });

    const exists = updated.some((c: Conversation) => c.id === data.id);
    const groupExists = groupUpdated.some((c: Conversation) => c.id === data.id);
    
    if (!exists && !isGroup) {
      updated = [data, ...updated];
    }
    if (!groupExists && isGroup) {
      groupUpdated = [data, ...groupUpdated];
    }

    this.conversationsTemp = updated;
    this.groupConversationsTemp = groupUpdated;

    const dataToUse = this.currentSearchTerm
      ? this.applySearchFilterToConversations(updated)
      : updated;
    const groupDataToUse = this.currentSearchTerm
      ? this.applySearchFilterToConversations(groupUpdated)
      : groupUpdated;
    
    this.conversations = dataToUse;
    this.groupConversations = groupDataToUse;

    this.selectChat(data);
    this.cdr.markForCheck();
  }

  deleteConversation(conversation: Conversation) {
    this.translateService.get("CHAT.DELETE.LABEL").subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        class: "modal-confirm-custom",
        initialState: {
          title: translations.TITLE,
          message: translations.MESSAGE,
          button: {
            cancel: translations.BUTTON.CANCEL,
            confirm: translations.BUTTON.CONFIRM,
          },
        },
      });
      this.bsModalRef.content.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {
            this.conversationService
              .deleteConversation(conversation.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.pusherService.unsubscribeFromChannel(
                    "private-conversation." + conversation.id,
                  );
                  this.initConversations();
                  this.translateService
                    .get("CHAT.DELETE.TOAST.CONVERSATION_DELETED_SUCCESSFULLY")
                    .subscribe((msg: string) =>
                      this.toastrService.success(msg),
                    );
                  if (this.selectedId === conversation.id) {
                    this.selectedId = null;
                  }
                },
                error: () => {
                  this.translateService
                    .get("CHAT.ERROR.DELETE_CONVERSATION_FAILED")
                    .subscribe((msg: string) => this.toastrService.error(msg));
                },
              });
          }
        });
    });
  }

  onMobilePanelToggleOpen() {
    this.mobilePanelOpen = true;
  }

  getParticipantNames(users: User[]): string {
    const otherUsers = users.filter((u) => u.id !== this.user.id);
    if (otherUsers.length <= 2) {
      return otherUsers.map((u) => `${u.firstName} ${u.lastName}`).join(", ");
    }
    return `${otherUsers[0].firstName} ${otherUsers[0].lastName} +${otherUsers.length - 1}`;
  }

  getAvatarUrl(user: User): string {
    return user.avatar ? this.getHost() + user.avatar : "/assets/images/avatars/thumb-16.jpg";
  }

  getConversationAvatars(conversation: Conversation): { url: string; tooltip: string }[] {
    const users = conversation.users || [];
    const result: { url: string; tooltip: string }[] = [];
    const avatarUrl = this.getHost();
    const defaultAvatar = "/assets/images/avatars/thumb-16.jpg";
    
    if (conversation.title || users.length > 2) {
      for (let i = 0; i < Math.min(users.length, 4); i++) {
        result.push({
          url: users[i].avatar ? avatarUrl + users[i].avatar : defaultAvatar,
          tooltip: `${users[i].firstName} ${users[i].lastName}`
        });
      }
    } else if (users.length === 2) {
      const otherUser = users.find(u => u.id !== this.user.id);
      if (otherUser) {
        result.push({
          url: otherUser.avatar ? avatarUrl + otherUser.avatar : defaultAvatar,
          tooltip: `${otherUser.firstName} ${otherUser.lastName}`
        });
      }
    }
    
    return result;
  }

  isGroupConversation(conversation: Conversation): boolean {
    return !!(conversation.title || (conversation.users && conversation.users.length > 2));
  }

  getOtherUser(conversation: Conversation): User | null {
    if (!conversation.users || conversation.users.length !== 2) return null;
    return conversation.users.find(u => u.id !== this.user.id) || null;
  }

  isUnreadMessage(conversation: Conversation): boolean {
    if (!conversation.lastMessage) {
      return false;
    }
    return (
      conversation.lastMessage.isRead == null &&
      conversation.lastMessage.sender?.id !== this.user.id
    );
  }
}
