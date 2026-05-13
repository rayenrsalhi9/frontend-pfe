import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { Conversation } from "@app/shared/enums/conversation";
import { User } from "@app/shared/enums/user-auth";
import { ConversationService } from "@app/shared/services/conversation.service";
import { environment } from "src/environments/environment";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "nav-messages",
  templateUrl: "./nav-messages.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.header-nav-item]": "true",
  },
})
export class NavMessagesComponent implements OnInit, OnDestroy {
  @Input() dropDirection = "dropdown";
  private destroy$ = new Subject<void>();
  private currentUserId: string | number | undefined;

  conversations: Conversation[] = [];
  isLoading = false;
  momentLang: string = "en";

  constructor(
    private conversationService: ConversationService,
    private securityService: SecurityService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
  ) {}

  get hasUnreadConversations(): boolean {
    return this.conversations.some((c) => this.isUnread(c));
  }

  ngOnInit(): void {
    this.currentUserId = this.securityService.getUserDetail()?.user?.id;
    this.momentLang = this.translateService.currentLang || this.translateService.getDefaultLang() || "en";
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      this.momentLang = event.lang;
      this.cdr.markForCheck();
    });
    this.loadConversations();
  }

  loadConversations() {
    this.isLoading = true;
    this.conversationService
      .getConversations(1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          const allConversations = Array.isArray(data.data) ? data.data : [];
          this.conversations = allConversations.filter(
            (c: Conversation) => !!c.lastMessage
          );
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  isGroupConversation(conversation: Conversation): boolean {
    return !!(conversation.title || (conversation.users && conversation.users.length > 2));
  }

  getConversationAvatars(conversation: Conversation): { url: string; tooltip: string }[] {
    const users = conversation.users || [];
    const result: { url: string; tooltip: string }[] = [];
    const avatarUrl = environment.apiUrl;
    const defaultAvatar = "/assets/images/avatars/thumb-16.jpg";

    if (conversation.title || users.length > 2) {
      for (let i = 0; i < Math.min(users.length, 4); i++) {
        result.push({
          url: users[i].avatar ? avatarUrl + users[i].avatar : defaultAvatar,
          tooltip: (users[i]?.firstName || 'Unknown') + ' ' + (users[i]?.lastName || '')
        });
      }
    } else if (users.length === 2) {
      const otherUser = users.find(u => u.id !== this.currentUserId);
      if (otherUser) {
        result.push({
          url: otherUser.avatar ? avatarUrl + otherUser.avatar : defaultAvatar,
          tooltip: (otherUser?.firstName || 'Unknown') + ' ' + (otherUser?.lastName || '')
        });
      }
    }

    return result;
  }

  getAvatarUrl(user: User | undefined): string {
    if (!user || !user.avatar) {
      return "/assets/images/avatars/thumb-16.jpg";
    }
    return environment.apiUrl + user.avatar;
  }

  getConversationName(conversation: Conversation): string {
    if (conversation.title) {
      return conversation.title;
    }
    const otherUser = this.getOtherUser(conversation);
    if (otherUser) {
      return `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim();
    }
    return "";
  }

  getOtherUser(conversation: Conversation): User | undefined {
    if (!this.currentUserId) return undefined;
    return conversation.users?.find((u) => u.id !== this.currentUserId);
  }

  isUnread(conversation: Conversation): boolean {
    if (!conversation.lastMessage) {
      return false;
    }
    return (
      conversation.lastMessage.isRead == null &&
      conversation.lastMessage.sender?.id !== this.currentUserId
    );
  }

  getLastMessageContent(conversation: Conversation): string {
    if (!conversation.lastMessage) return "";
    if (conversation.lastMessage.type === "reaction") {
      if (conversation.type === "group") {
        const lastContent = (conversation as any).lastContentMessage;
        if (lastContent?.content) return lastContent.content;
        return "";
      }
      const text = (conversation.lastMessage.content || "").split('\n')[0];
      if (conversation.lastMessage.sender?.id === this.currentUserId) {
        if (text.startsWith('Liked')) return 'You liked this message';
        const match = text.match(/React with (.+)/);
        if (match) return 'You reacted with ' + match[1];
        return 'You reacted to a message';
      }
      return text;
    }
    if (conversation.lastMessage.type !== "msg") {
      return this.translateService.instant("MESSAGES.LABELS.FILE_SENT");
    }
    return conversation.lastMessage.content || "";
  }

  openChat(conversation: Conversation): void {
    this.router.navigate(["/apps/chat"], { queryParams: { conversationId: conversation.id } });
  }

  trackByConversationId(index: number, conversation: Conversation): string | number {
    return conversation.id ?? `conversation-${index}`;
  }

  viewAllConversations(): void {
    this.router.navigate(["/apps/chat"]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
