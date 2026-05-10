import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConversationComponent } from "./conversation.component";
import { ConversationService } from "@app/shared/services/conversation.service";
import { PusherService } from "@app/shared/services/pusher.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

describe("ConversationComponent", () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let mockConversationService: any;
  let mockPusherService: any;
  let mockModalService: any;
  let mockToastr: any;
  let mockTranslate: any;

  const mockUser = { id: "user1", firstName: "Test", lastName: "User" };
  const mockUsers = [
    mockUser,
    { id: "u2", firstName: "Alice", lastName: "Smith", avatar: "alice.jpg" },
  ];

  const mockConversation = {
    id: "conv1",
    title: null,
    users: mockUsers,
    messages: [
      { id: "m1", content: "Hello", type: "msg", sender: { id: "u2", firstName: "Alice", lastName: "Smith", avatar: "alice.jpg" }, reactions: [] as any[], createdAt: "2026-01-01", isRead: { date: "2026-01-02" } },
      { id: "m2", content: "Hi back", type: "msg", sender: { id: "user1" }, reactions: [] as any[], createdAt: "2026-01-01" },
      { id: "m3", content: "Last word", type: "msg", sender: { id: "u2" }, reactions: [] as any[], createdAt: "2026-01-03" },
    ],
  };

  beforeEach(async () => {
    mockConversationService = {
      getMessages: jasmine.createSpy("getMessages").and.returnValue(of(mockConversation)),
      setMessage: jasmine.createSpy("setMessage").and.returnValue(of({
        id: "m3", content: "New msg", type: "msg",
        sender: { id: "user1" }, reactions: [],
        conversation: { id: "conv1" },
      })),
      seenMessage: jasmine.createSpy("seenMessage").and.returnValue(of({
        id: "m1", isRead: { date: "2026-01-02" },
      })),
      reactionMessage: jasmine.createSpy("reactionMessage").and.returnValue(of({
        id: "m1", content: "Hello", type: "msg",
        sender: { id: "u2" }, reactions: [{ type: "like" }],
      })),
    };
    mockPusherService = {
      subscribeToChannel: jasmine.createSpy("subscribeToChannel"),
      unsubscribeFromChannel: jasmine.createSpy("unsubscribeFromChannel"),
    };
    mockModalService = {
      show: jasmine.createSpy("show").and.returnValue({
        content: { onClose: of({ conversation: { id: "conv1", title: "Updated", users: mockUsers } }) },
      }),
    };
    mockToastr = {
      error: jasmine.createSpy("error"),
      success: jasmine.createSpy("success"),
    };
    mockTranslate = {
      get: jasmine.createSpy("get").and.returnValue(of("translated")),
    };

    await TestBed.configureTestingModule({
      declarations: [ConversationComponent, TranslatePipeMock],
      providers: [
        { provide: ConversationService, useValue: mockConversationService },
        { provide: PusherService, useValue: mockPusherService },
        { provide: BsModalService, useValue: mockModalService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: TranslateService, useValue: mockTranslate },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    component.user = mockUser as any;
    fixture.detectChanges();
  });

  // ─── LIFECYCLE ───────────────────────────────────────────

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch conversation when chatId input changes", () => {
    component.chatId = "conv1";
    expect(mockConversationService.getMessages).toHaveBeenCalledWith("conv1");
  });

  it("should set title from other user name when no conversation title", () => {
    component.chatId = "conv1";
    expect(component.title).toBe("Alice Smith");
  });

  it("should subscribe to Pusher channels after loading", () => {
    component.chatId = "conv1";
    expect(mockPusherService.subscribeToChannel).toHaveBeenCalledWith("private-conversation.conv1", "message", jasmine.any(Function));
    expect(mockPusherService.subscribeToChannel).toHaveBeenCalledWith("private-conversation.conv1", "message-seen", jasmine.any(Function));
    expect(mockPusherService.subscribeToChannel).toHaveBeenCalledWith("private-conversation.conv1", "message-reaction", jasmine.any(Function));
  });

  it("should display error toast when load fails", () => {
    mockConversationService.getMessages.and.returnValue(throwError(() => new Error("fail")));
    component.chatId = "conv2";
    expect(mockToastr.error).toHaveBeenCalled();
  });

  // ─── SENDING MESSAGES ─────────────────────────────────────

  it("should send text message via API", () => {
    component.conversation = mockConversation as any;
    component.message = "Test message";
    component.sendMessage();
    expect(mockConversationService.setMessage).toHaveBeenCalled();
  });

  it("should not send empty message", () => {
    component.conversation = mockConversation as any;
    component.message = "   ";
    component.sendMessage();
    expect(mockConversationService.setMessage).not.toHaveBeenCalled();
  });

  it("should not send while already sending", () => {
    component.conversation = mockConversation as any;
    component.message = "Test";
    component.isSending = true;
    component.sendMessage();
    expect(mockConversationService.setMessage).not.toHaveBeenCalled();
  });

  it("should clear message input after successful send", () => {
    component.conversation = mockConversation as any;
    component.message = "Test";
    component.sendMessage();
    expect(component.message).toBe("");
  });

  it("should show error toast on send failure", () => {
    mockConversationService.setMessage.and.returnValue(throwError(() => new Error("fail")));
    component.conversation = mockConversation as any;
    component.message = "Test";
    component.sendMessage();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  // ─── REACTIONS ────────────────────────────────────────────

  it("should toggle reaction picker", () => {
    component.handleEmojiBar();
    expect(component.isOpen).toBeTrue();
    component.handleEmojiBar();
    expect(component.isOpen).toBeFalse();
  });

  it("should send reaction via API", () => {
    component.conversation = mockConversation as any;
    component.user = mockUser as any;
    const message = { id: "m1" } as any;
    component.onMessageReact("like", message);
    expect(mockConversationService.reactionMessage).toHaveBeenCalledWith({ mid: "m1", type: "like", uid: "user1" });
  });

  // ─── SEEN STATUS ──────────────────────────────────────────

  it("should mark last message as seen on input focus", fakeAsync(() => {
    component.conversation = JSON.parse(JSON.stringify(mockConversation));
    component.user = { ...mockUser } as any;
    (component.conversation.messages as any[]).push({ id: "m4", content: "New", type: "msg", sender: { id: "u2" }, reactions: [], createdAt: "2026-01-04" });
    component.onInputMessageFocus();
    tick();
    expect(mockConversationService.seenMessage).toHaveBeenCalled();
  }));

  // ─── MODALS ───────────────────────────────────────────────

  it("should emit deleteConversation when delete is clicked", () => {
    spyOn(component.deleteConversation, "emit");
    component.conversation = mockConversation as any;
    component.onDeleteConversation();
    expect(component.deleteConversation.emit).toHaveBeenCalledWith(mockConversation as any);
  });

  it("should open update conversation modal", () => {
    component.conversation = mockConversation as any;
    component.handleUpdateChat();
    expect(mockModalService.show).toHaveBeenCalled();
  });

  // ─── UTILITY METHODS ──────────────────────────────────────

  it("getReactionSummary returns empty for no reactions", () => {
    expect(component.getReactionSummary([])).toBe("");
    expect(component.getReactionSummary(null)).toBe("");
    expect(component.getReactionSummary(undefined as any)).toBe("");
  });

  it("getReactionSummary formats multiple reactions with counts", () => {
    const reactions = [
      { type: "like" },
      { type: "like" },
      { type: "heart" },
    ];
    const summary = component.getReactionSummary(reactions);
    expect(summary).toContain("👍");
    expect(summary).toContain("❤️");
  });

  it("isSenderRemoved returns true when sender not in current users", () => {
    component.conversation = {
      users: [mockUser],
    } as any;
    expect(component.isSenderRemoved("removedUserId")).toBeTrue();
  });

  it("isSenderRemoved returns false when sender is in current users", () => {
    component.conversation = {
      users: [mockUser, { id: "u2" }],
    } as any;
    expect(component.isSenderRemoved("u2")).toBeFalse();
  });

  it("isGroupConversation returns true for conversations with title", () => {
    component.conversation = { title: "Group", users: [mockUser, { id: "u2" }, { id: "u3" }] } as any;
    expect(component.isGroupConversation).toBeTrue();
  });

  it("isGroupConversation returns true for conversations with >2 users", () => {
    component.conversation = { title: null, users: [mockUser, { id: "u2" }, { id: "u3" }] } as any;
    expect(component.isGroupConversation).toBeTrue();
  });
});
