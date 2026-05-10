import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavMessagesComponent } from "./nav-messages.component";
import { ConversationService } from "@app/shared/services/conversation.service";
import { SecurityService } from "@app/core/security/security.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ChangeDetectorRef, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

@Pipe({ name: "amTimeAgo" })
class MockAmTimeAgoPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: "amLocale" })
class MockAmLocalePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { of } from "rxjs";

describe("NavMessagesComponent", () => {
  let component: NavMessagesComponent;
  let fixture: ComponentFixture<NavMessagesComponent>;
  let mockConversationService: any;
  let mockSecurityService: any;
  let mockRouter: any;
  let mockTranslateService: any;
  let mockCdr: any;

  const mockUser = { id: "user1", firstName: "Test", lastName: "User" };
  const mockConversations = [
    {
      id: "c1",
      title: null,
      users: [
        mockUser,
        { id: "u2", firstName: "Alice", lastName: "Smith", avatar: "alice.jpg" },
      ],
      lastMessage: { id: "m1", content: "Hi", type: "msg", sender: { id: "u2" }, createdAt: "2026-01-01", isRead: null },
    },
    {
      id: "c2",
      title: "Dev Team",
      users: [
        mockUser,
        { id: "u2" },
        { id: "u3", firstName: "Charlie", lastName: "Brown", avatar: null },
        { id: "u4", firstName: "Diana", lastName: "Prince", avatar: null },
        { id: "u5", firstName: "Eve", lastName: "Adams", avatar: null },
      ],
      lastMessage: { id: "m2", content: "Hello", type: "msg", sender: { id: "u2" }, createdAt: "2026-01-02", isRead: { date: "2026-01-03" } },
    },
    {
      id: "c3",
      title: null,
      users: [mockUser, { id: "u6" }],
      lastMessage: null,
    },
  ];

  beforeEach(async () => {
    mockConversationService = {
      getConversations: jasmine.createSpy("getConversations").and.returnValue(of({ data: mockConversations })),
    };
    mockSecurityService = {
      getUserDetail: jasmine.createSpy("getUserDetail").and.returnValue({ user: mockUser }),
    };
    mockRouter = {
      navigate: jasmine.createSpy("navigate"),
    };
    mockTranslateService = {
      currentLang: "en",
      getDefaultLang: jasmine.createSpy("getDefaultLang").and.returnValue("en"),
      instant: jasmine.createSpy("instant").and.returnValue("translated"),
      onLangChange: of({ lang: "fr" }),
    };
    mockCdr = {
      markForCheck: jasmine.createSpy("markForCheck"),
    };

    await TestBed.configureTestingModule({
      declarations: [NavMessagesComponent, TranslatePipeMock, MockAmTimeAgoPipe, MockAmLocalePipe],
      providers: [
        { provide: ConversationService, useValue: mockConversationService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ChangeDetectorRef, useValue: mockCdr },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(NavMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load conversations with lastMessage only", () => {
    expect(mockConversationService.getConversations).toHaveBeenCalledWith(1, 10);
    expect(component.conversations.length).toBe(2);
    expect(component.conversations.find(c => c.id === "c3")).toBeUndefined();
  });

  it("isGroupConversation returns true when title exists", () => {
    expect(component.isGroupConversation(mockConversations[1] as any)).toBeTrue();
  });

  it("isGroupConversation returns true when >2 users", () => {
    const conv = { title: null, users: [mockUser, { id: "u2" }, { id: "u3" }] } as any;
    expect(component.isGroupConversation(conv)).toBeTrue();
  });

  it("isGroupConversation returns false for 1-on-1 without title", () => {
    expect(component.isGroupConversation(mockConversations[0] as any)).toBeFalse();
  });

  it("getConversationAvatars returns up to 4 avatars for groups", () => {
    const avatars = component.getConversationAvatars(mockConversations[1] as any);
    expect(avatars.length).toBe(4);
    expect(avatars[0].tooltip).toBe("Test User");
  });

  it("getConversationAvatars returns single avatar for 1-on-1", () => {
    const avatars = component.getConversationAvatars(mockConversations[0] as any);
    expect(avatars.length).toBe(1);
    expect(avatars[0].tooltip).toBe("Alice Smith");
  });

  it("getConversationName returns title for groups", () => {
    expect(component.getConversationName(mockConversations[1] as any)).toBe("Dev Team");
  });

  it("getConversationName returns other user name for 1-on-1", () => {
    expect(component.getConversationName(mockConversations[0] as any)).toBe("Alice Smith");
  });

  it("isUnread returns true for unread received message", () => {
    expect(component.isUnread(mockConversations[0] as any)).toBeTrue();
  });

  it("isUnread returns false when message is read", () => {
    expect(component.isUnread(mockConversations[1] as any)).toBeFalse();
  });

  it("isUnread returns false when no lastMessage", () => {
    expect(component.isUnread(mockConversations[2] as any)).toBeFalse();
  });

  it("hasUnreadConversations returns true when any conversation is unread", () => {
    expect(component.hasUnreadConversations).toBeTrue();
  });

  it("getLastMessageContent returns content for msg type", () => {
    expect(component.getLastMessageContent(mockConversations[0] as any)).toBe("Hi");
  });

  it("openChat navigates to chat with conversationId", () => {
    component.openChat(mockConversations[0] as any);
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/apps/chat"], { queryParams: { conversationId: "c1" } });
  });

  it("viewAllConversations navigates to chat", () => {
    component.viewAllConversations();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/apps/chat"]);
  });
});
