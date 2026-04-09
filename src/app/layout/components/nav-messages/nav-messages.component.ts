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
  private currentUser: User | null = null;

  conversations: Conversation[] = [];
  isLoading = false;
  momentLang: string = "en";

  constructor(
    private conversationService: ConversationService,
    private securityService: SecurityService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations() {
    this.isLoading = true;
    this.conversationService
      .getConversations(1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          const allConversations = data.data || [];
          
          this.conversations = allConversations.filter(
            (c: Conversation) => !!c.lastMessage && (!c.title && (!c.users || c.users.length <= 2))
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
    const currentUserId = this.securityService.getUserDetail()?.user?.id;
    if (!currentUserId) return undefined;
    return conversation.users?.find((u) => u.id !== currentUserId);
  }

  isUnread(conversation: Conversation): boolean {
    if (!conversation.lastMessage) {
      return false;
    }
    const currentUserId = this.securityService.getUserDetail()?.user?.id;
    return (
      conversation.lastMessage.isRead == null &&
      conversation.lastMessage.sender?.id !== currentUserId
    );
  }

  getLastMessageTime(createdAt: Date | string | undefined): string {
    if (!createdAt) return "";
    return createdAt as string;
  }

  getLastMessageContent(conversation: Conversation): string {
    if (!conversation.lastMessage) return "";
    if (conversation.lastMessage.type !== "msg") {
      return "File sent";
    }
    return conversation.lastMessage.content || "";
  }

  openChat(conversation: Conversation): void {
    this.router.navigate(["/apps/chat"]);
  }

  viewAllConversations(): void {
    this.router.navigate(["/apps/chat"]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
