import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ChatComponent } from "./chat.component";
import { ConversationService } from "@app/shared/services/conversation.service";
import { CommonService } from "@app/shared/services/common.service";
import { PusherService } from "@app/shared/services/pusher.service";
import { SecurityService } from "@app/core/security/security.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError, Subject } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "amTimeAgo" })
class MockAmTimeAgoPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: "amLocale" })
class MockAmLocalePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

describe("ChatComponent", () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockConversationService: any;
  let mockCommonService: any;
  let mockPusherService: any;
  let mockSecurityService: any;
  let mockModalService: any;
  let mockToastrService: any;
  let mockTranslateService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockUser = { id: "user1", firstName: "Test", lastName: "User", avatar: null, email: "test@example.com" };
  const mockUsers = [
    { id: "u3", firstName: "Charlie", lastName: "Brown", email: "charlie@test.com" },
    { id: "u2", firstName: "Alice", lastName: "Smith", email: "alice@test.com" },
    { id: "u1", firstName: "Bob", lastName: "Jones", email: "bob@test.com" },
  ];

  const mockConversations = [
    { id: "c1", title: null, users: [mockUser, { id: "u2", firstName: "Alice", lastName: "Smith", email: "alice@test.com" }], lastMessage: { id: "m1", content: "Hi", type: "msg", sender: { id: "u2" }, createdAt: "2026-01-01" } },
    { id: "c2", title: "Dev Team", users: [mockUser, { id: "u2", firstName: "Alice", lastName: "Smith", email: "alice@test.com" }, { id: "u3", firstName: "Charlie", lastName: "Brown", email: "charlie@test.com" }], lastMessage: { id: "m2", content: "Hello", type: "msg", sender: { id: "u2" }, createdAt: "2026-01-02" } },
  ];

  const mockQueryParamsSubject = new Subject<any>();

  beforeEach(async () => {
    mockConversationService = {
      getConversations: jasmine.createSpy("getConversations").and.returnValue(of({ data: mockConversations, meta: { current_page: 1, per_page: 20, total: 2, last_page: 1 } })),
      createConversation: jasmine.createSpy("createConversation").and.returnValue(of(mockConversations[0])),
      deleteConversation: jasmine.createSpy("deleteConversation").and.returnValue(of({})),
    };
    mockCommonService = {
      getUsersWithClaim: jasmine.createSpy("getUsersWithClaim").and.returnValue(of(mockUsers)),
    };
    mockPusherService = {
      subscribeToChannel: jasmine.createSpy("subscribeToChannel"),
      unsubscribeFromChannel: jasmine.createSpy("unsubscribeFromChannel"),
    };
    mockSecurityService = {
      getUserDetail: jasmine.createSpy("getUserDetail").and.returnValue({ user: mockUser }),
    };
    mockModalService = {
      show: jasmine.createSpy("show").and.returnValue({ content: { onClose: of(true) } }),
    };
    mockToastrService = {
      error: jasmine.createSpy("error"),
      success: jasmine.createSpy("success"),
    };
    mockTranslateService = {
      get: jasmine.createSpy("get").and.callFake((key: string) => {
        if (key === "CHAT.DELETE.LABEL") {
          return of({ TITLE: "Title", MESSAGE: "Message", BUTTON: { CANCEL: "Cancel", CONFIRM: "Confirm" } });
        }
        return of("translated");
      }),
      currentLang: "en",
    };
    mockActivatedRoute = {
      queryParams: mockQueryParamsSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      declarations: [ChatComponent, TranslatePipeMock, MockAmTimeAgoPipe, MockAmLocalePipe],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ConversationService, useValue: mockConversationService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: PusherService, useValue: mockPusherService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: BsModalService, useValue: mockModalService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── INITIALIZATION ───────────────────────────────────────

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load users with CHAT_VIEW_CHATS claim on init", () => {
    expect(mockCommonService.getUsersWithClaim).toHaveBeenCalledWith("CHAT_VIEW_CHATS");
  });

  it("should load conversations on init", () => {
    expect(mockConversationService.getConversations).toHaveBeenCalledWith(1);
  });

  it("should subscribe to user channel on init", () => {
    expect(mockPusherService.subscribeToChannel).toHaveBeenCalledWith("user." + mockUser.id, "chat-update", jasmine.any(Function));
  });

  // ─── USER LOADING & SORTING ──────────────────────────────

  it("should sort users alphabetically by firstName lastName", () => {
    expect(component.usersTemp.length).toBe(3);
    expect(component.usersTemp[0].firstName).toBe("Alice");
    expect(component.usersTemp[1].firstName).toBe("Bob");
    expect(component.usersTemp[2].firstName).toBe("Charlie");
  });

  it("should display error toast when loading users fails", () => {
    mockCommonService.getUsersWithClaim.and.returnValue(throwError(() => new Error("fail")));
    component.getUsers();
    expect(mockToastrService.error).toHaveBeenCalled();
  });

  // ─── CONVERSATION MANAGEMENT ──────────────────────────────

  it("should separate 1-on-1 and group conversations", () => {
    expect(component.conversations.length).toBe(1);
    expect(component.conversations[0].id).toBe("c1");
    expect(component.groupConversations.length).toBe(1);
    expect(component.groupConversations[0].id).toBe("c2");
  });

  it("should create new conversation when clicking user", () => {
    component.newConversation(mockUsers[0]);
    expect(mockConversationService.createConversation).toHaveBeenCalled();
  });

  it("should prevent duplicate creation while pending", () => {
    const user = mockUsers[0];
    const createSubject = new Subject<any>();
    mockConversationService.createConversation.and.returnValue(createSubject.asObservable());
    component.newConversation(user);
    component.newConversation(user);
    expect(mockConversationService.createConversation).toHaveBeenCalledTimes(1);
    createSubject.next({ id: "new1" });
    createSubject.complete();
  });

  it("should handle conversation creation error", () => {
    mockConversationService.createConversation.and.returnValue(throwError(() => new Error("fail")));
    component.newConversation(mockUsers[0]);
    expect(mockToastrService.error).toHaveBeenCalled();
  });

  // ─── SEARCH ──────────────────────────────────────────────

  it("should filter users by search term", fakeAsync(() => {
    (component as any).applySearch("Alice");
    tick();
    expect(component.users.length).toBe(1);
    expect(component.users[0].firstName).toBe("Alice");
  }));

  it("should restore full lists when search is cleared", fakeAsync(() => {
    (component as any).applySearch("Alice");
    tick();
    (component as any).applySearch("");
    tick();
    expect(component.users.length).toBe(3);
    expect(component.conversations.length).toBe(1);
  }));

  // ─── REAL-TIME UPDATES ────────────────────────────────────

  it("should update conversation list on new message", () => {
    const message = {
      id: "m3",
      content: "New msg",
      type: "msg",
      sender: { id: "u2" },
      conversation: { id: "c1", users: [mockUser, { id: "u2" }] },
    };
    component.updateChat(message as any);
    expect(component.conversationsTemp[0].lastMessage).toBeDefined();
  });

  it("should move updated conversation to top", () => {
    const message = {
      id: "m3",
      content: "Latest",
      type: "msg",
      sender: { id: "u2" },
      conversation: { id: "c1", users: [mockUser, { id: "u2" }] },
    };
    component.updateChat(message as any);
    expect(component.conversationsTemp[0].id).toBe("c1");
  });

  // ─── CONVERSATION SELECTION ─────────────────────────────

  it("should select conversation and update URL", () => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");
    component.selectChat(mockConversations[0] as any);
    expect(component.selectedId).toBe("c1");
    expect(router.navigate).toHaveBeenCalledWith([], { queryParams: { conversationId: "c1" }, queryParamsHandling: "merge" });
  });

  it("should unsubscribe from previous channel when selecting different conversation", () => {
    component.oldSelectedId = "c1";
    component.selectChat({ id: "c2" } as any);
    expect(mockPusherService.unsubscribeFromChannel).toHaveBeenCalledWith("private-conversation.c1");
  });

  // ─── CONVERSATION DELETION ──────────────────────────────

  it("should show confirm modal before deleting", () => {
    component.deleteConversation(mockConversations[0] as any);
    expect(mockModalService.show).toHaveBeenCalled();
  });

  it("should unsubscribe from deleted conversation channel", () => {
    spyOn(window, "confirm").and.returnValue(true);
    component.deleteConversation(mockConversations[0] as any);
    expect(mockPusherService.unsubscribeFromChannel).toHaveBeenCalledWith("private-conversation.c1");
  });

  it("should clear selectedId if deleted conversation is selected", () => {
    component.selectedId = "c1";
    component.deleteConversation(mockConversations[0] as any);
    expect(component.selectedId).toBeNull();
  });

  // ─── UTILITY METHODS ──────────────────────────────────────

  it("isGroupConversation returns true for conversations with title", () => {
    expect(component.isGroupConversation({ title: "Group", users: [mockUser, { id: "u2" }] } as any)).toBeTrue();
  });

  it("isGroupConversation returns true for conversations with >2 users", () => {
    expect(component.isGroupConversation({ title: null, users: [mockUser, { id: "u2" }, { id: "u3" }, { id: "u4" }] } as any)).toBeTrue();
  });

  it("isGroupConversation returns false for 1-on-1 without title", () => {
    expect(component.isGroupConversation({ title: null, users: [mockUser, { id: "u2" }] } as any)).toBeFalse();
  });

  it("getParticipantNames formats names for 2 users excluding current", () => {
    const name = component.getParticipantNames([mockUser, { id: "u2", firstName: "Alice", lastName: "Smith" } as any]);
    expect(name).toBe("Alice Smith");
  });

  it("getConversationAvatars returns up to 4 avatars for groups", () => {
    const users = [
      mockUser,
      { id: "u2", firstName: "A", lastName: "B", avatar: null },
      { id: "u3", firstName: "C", lastName: "D", avatar: null },
      { id: "u4", firstName: "E", lastName: "F", avatar: null },
      { id: "u5", firstName: "G", lastName: "H", avatar: null },
    ];
    const avatars = component.getConversationAvatars({ title: "Big Group", users } as any);
    expect(avatars.length).toBe(4);
  });

  it("isUnreadMessage detects unread received messages", () => {
    const conv = { lastMessage: { isRead: null, sender: { id: "u2" } } } as any;
    expect(component.isUnreadMessage(conv)).toBeTrue();
  });

  it("isUnreadMessage returns false when no lastMessage", () => {
    expect(component.isUnreadMessage({} as any)).toBeFalse();
  });

  it("isUnreadMessage returns false when message is from current user", () => {
    const conv = { lastMessage: { isRead: null, sender: { id: mockUser.id } } } as any;
    expect(component.isUnreadMessage(conv)).toBeFalse();
  });
});
