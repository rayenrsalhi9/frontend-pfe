import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddConversationComponent } from "./add-conversation.component";
import { CommonService } from "@app/shared/services/common.service";
import { ConversationService } from "@app/shared/services/conversation.service";
import { PusherService } from "@app/shared/services/pusher.service";
import { SecurityService } from "@app/core/security/security.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

describe("AddConversationComponent", () => {
  let component: AddConversationComponent;
  let fixture: ComponentFixture<AddConversationComponent>;
  let mockCommonService: any;
  let mockConversationService: any;
  let mockSecurityService: any;
  let mockToastr: any;
  let mockTranslate: any;
  let mockBsModalRef: any;
  let mockPusherService: any;

  const mockCurrentUser = { id: "currentUser", firstName: "Me", lastName: "User" };
  const mockUsers = [
    { id: "u1", firstName: "Alice", lastName: "Smith", email: "alice@test.com", avatar: null },
    { id: "u2", firstName: "Bob", lastName: "Jones", email: "bob@test.com", avatar: null },
  ];

  beforeEach(async () => {
    mockCommonService = {
      getUsersWithClaim: jasmine.createSpy("getUsersWithClaim").and.returnValue(of(mockUsers)),
    };
    mockConversationService = {
      createConversation: jasmine.createSpy("createConversation").and.returnValue(of({ id: "newConv" })),
      conversationAddUser: jasmine.createSpy("conversationAddUser").and.returnValue(of({})),
    };
    mockSecurityService = {
      getUserDetail: jasmine.createSpy("getUserDetail").and.returnValue({ user: mockCurrentUser }),
    };
    mockToastr = { error: jasmine.createSpy("error"), success: jasmine.createSpy("success") };
    mockTranslate = { get: jasmine.createSpy("get").and.returnValue(of("translated")) };
    mockBsModalRef = {
      hide: jasmine.createSpy("hide"),
      setClass: jasmine.createSpy("setClass"),
    };
    mockPusherService = {};

    await TestBed.configureTestingModule({
      declarations: [AddConversationComponent, TranslatePipeMock],
      providers: [
        { provide: CommonService, useValue: mockCommonService },
        { provide: ConversationService, useValue: mockConversationService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: BsModalRef, useValue: mockBsModalRef },
        { provide: PusherService, useValue: mockPusherService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AddConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load users excluding current user on init", () => {
    expect(mockCommonService.getUsersWithClaim).toHaveBeenCalledWith("CHAT_VIEW_CHATS");
    expect(component.users.length).toBe(2);
    expect(component.users.some(u => u.id === "currentUser")).toBeFalse();
  });

  it("filterUsers filters by name", () => {
    component.searchTerm = "Alice";
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].firstName).toBe("Alice");
  });

  it("filterUsers restores full list when search is empty", () => {
    component.searchTerm = "";
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(2);
  });

  it("toggleUser adds and removes from selectedUsers", () => {
    component.toggleUser(mockUsers[0]);
    expect(component.selectedUsers.length).toBe(1);
    component.toggleUser(mockUsers[0]);
    expect(component.selectedUsers.length).toBe(0);
  });

  it("isSelected returns correct state for group type", () => {
    component.type = "group";
    component.selectedUsers = [mockUsers[0]];
    expect(component.isSelected(mockUsers[0])).toBeTrue();
    expect(component.isSelected(mockUsers[1])).toBeFalse();
  });

  it("createConversation (group) calls API with correct payload", () => {
    component.type = "group";
    component.title = "Test Group";
    component.selectedUsers = [mockUsers[0]];
    component.createConversation();
    expect(mockConversationService.createConversation).toHaveBeenCalledWith({
      users: ["u1", "currentUser"],
      title: "Test Group",
      new: true,
    });
  });

  it("createConversation (group) validates at least one member", () => {
    component.type = "group";
    component.selectedUsers = [];
    component.createConversation();
    expect(mockConversationService.createConversation).not.toHaveBeenCalled();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it("createConversation (user) calls conversationAddUser", () => {
    component.type = "user";
    component.conversationId = "conv1";
    component.selectedUser = mockUsers[0];
    component.createConversation();
    expect(mockConversationService.conversationAddUser).toHaveBeenCalledWith({
      conversationId: "conv1",
      title: "",
      selectedUser: mockUsers[0],
    });
  });

  it("createConversation (user) validates selected user", () => {
    component.type = "user";
    component.selectedUser = null;
    component.createConversation();
    expect(mockConversationService.conversationAddUser).not.toHaveBeenCalled();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it("closeConver hides modal", () => {
    component.closeConver();
    expect(mockBsModalRef.hide).toHaveBeenCalled();
  });
});
