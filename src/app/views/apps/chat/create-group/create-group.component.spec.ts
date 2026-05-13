import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreateGroupComponent } from "./create-group.component";
import { CommonService } from "@app/shared/services/common.service";
import { ConversationService } from "@app/shared/services/conversation.service";
import { SecurityService } from "@app/core/security/security.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

describe("CreateGroupComponent", () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;
  let mockCommonService: any;
  let mockConversationService: any;
  let mockSecurityService: any;
  let mockToastr: any;
  let mockTranslate: any;
  let mockBsModalRef: any;

  const mockUsers = [
    { id: "u1", firstName: "Alice", lastName: "Smith", email: "alice@test.com" },
    { id: "u2", firstName: "Bob", lastName: "Jones", email: "bob@test.com" },
  ];

  beforeEach(async () => {
    mockCommonService = {
      getUsersWithClaim: jasmine.createSpy("getUsersWithClaim").and.returnValue(of(mockUsers)),
    };
    mockConversationService = {
      createConversation: jasmine.createSpy("createConversation").and.returnValue(of({ id: "newGroup" })),
    };
    mockSecurityService = {
      getUserDetail: jasmine.createSpy("getUserDetail").and.returnValue({ user: { id: "currentUser" } }),
    };
    mockToastr = { error: jasmine.createSpy("error"), success: jasmine.createSpy("success") };
    mockTranslate = { get: jasmine.createSpy("get").and.returnValue(of("translated")) };
    mockBsModalRef = { hide: jasmine.createSpy("hide") };

    await TestBed.configureTestingModule({
      declarations: [CreateGroupComponent, TranslatePipeMock],
      providers: [
        { provide: CommonService, useValue: mockCommonService },
        { provide: ConversationService, useValue: mockConversationService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: BsModalRef, useValue: mockBsModalRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load users excluding current user", () => {
    expect(mockCommonService.getUsersWithClaim).toHaveBeenCalledWith("CHAT_VIEW_CHATS");
    expect(component.users.length).toBe(2);
  });

  it("should validate group name is required", () => {
    component.groupName = "";
    component.selectedUsers = new Set([mockUsers[0]]);
    component.createGroup();
    expect(mockConversationService.createConversation).not.toHaveBeenCalled();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it("should validate at least one member is selected", () => {
    component.groupName = "My Group";
    component.selectedUsers = new Set();
    component.createGroup();
    expect(mockConversationService.createConversation).not.toHaveBeenCalled();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it("should call createConversation with correct payload", () => {
    component.groupName = "Test Group";
    component.selectedUsers = new Set([mockUsers[0]]);
    component.createGroup();
    expect(mockConversationService.createConversation).toHaveBeenCalledWith({
      users: ["u1", "currentUser"],
      title: "Test Group",
      new: true,
    });
  });

  it("should show success toast on creation", () => {
    component.groupName = "Test";
    component.selectedUsers = new Set([mockUsers[0]]);
    component.createGroup();
    expect(mockToastr.success).toHaveBeenCalled();
    expect(mockBsModalRef.hide).toHaveBeenCalled();
  });
});
