import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UsersConversationComponent } from "./users-conversation.component";
import { ConversationService } from "@app/shared/services/conversation.service";
import { SecurityService } from "@app/core/security/security.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

describe("UsersConversationComponent", () => {
  let component: UsersConversationComponent;
  let fixture: ComponentFixture<UsersConversationComponent>;
  let mockConversationService: any;
  let mockSecurityService: any;
  let mockToastr: any;
  let mockTranslate: any;
  let mockBsModalRef: any;
  let mockModalService: any;

  const mockUser = { id: "user1", firstName: "Test", lastName: "User" };
  const mockMembers = [
    mockUser,
    { id: "u2", firstName: "Alice", lastName: "Smith", email: "alice@test.com" },
    { id: "u3", firstName: "Bob", lastName: "Jones", email: "bob@test.com" },
  ];

  beforeEach(async () => {
    mockConversationService = {
      conversationRemoveUser: jasmine.createSpy("conversationRemoveUser").and.returnValue(of({})),
    };
    mockSecurityService = {
      getUserDetail: jasmine.createSpy("getUserDetail").and.returnValue({ user: mockUser }),
    };
    mockToastr = { error: jasmine.createSpy("error"), success: jasmine.createSpy("success") };
    mockTranslate = { get: jasmine.createSpy("get").and.returnValue(of("translated")) };
    mockBsModalRef = {
      hide: jasmine.createSpy("hide"),
      setClass: jasmine.createSpy("setClass"),
    };
    mockModalService = {
      show: jasmine.createSpy("show").and.returnValue({
        content: { onClose: of(true) },
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [UsersConversationComponent, TranslatePipeMock],
      providers: [
        { provide: ConversationService, useValue: mockConversationService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: BsModalRef, useValue: mockBsModalRef },
        { provide: BsModalService, useValue: mockModalService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(UsersConversationComponent);
    component = fixture.componentInstance;
    component.conversation = { id: "conv1", users: [...mockMembers], title: null } as any;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set currentUserId on init", () => {
    expect(component.currentUserId).toBe("user1");
  });

  it("should set modal class on init", () => {
    expect(mockBsModalRef.setClass).toHaveBeenCalledWith("modal-sm");
  });

  it("should remove user and call API on confirm", () => {
    component.removeUser(mockMembers[1]);
    expect(mockConversationService.conversationRemoveUser).toHaveBeenCalledWith({
      conversationId: "conv1",
      userId: "u2",
    });
    expect(mockToastr.success).toHaveBeenCalled();
    expect(component.conversation.users.length).toBe(2);
    expect(component.conversation.users.find(u => u.id === "u2")).toBeUndefined();
  });

  it("should show error toast when remove fails", () => {
    mockConversationService.conversationRemoveUser.and.returnValue(throwError(() => new Error("fail")));
    component.removeUser(mockMembers[1]);
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it("cancel should hide modal", () => {
    component.cancel();
    expect(mockBsModalRef.hide).toHaveBeenCalled();
  });
});
