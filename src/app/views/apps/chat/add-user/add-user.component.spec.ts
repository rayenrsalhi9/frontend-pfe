import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddUserComponent } from "./add-user.component";
import { CommonService } from "@app/shared/services/common.service";
import { ConversationService } from "@app/shared/services/conversation.service";
import { SecurityService } from "@app/core/security/security.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

describe("AddUserComponent", () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let mockCommonService: any;
  let mockConversationService: any;
  let mockSecurityService: any;
  let mockToastr: any;
  let mockTranslate: any;
  let mockBsModalRef: any;

  const mockUsers = [
    { id: "u1", firstName: "Alice", lastName: "Smith" },
    { id: "u2", firstName: "Bob", lastName: "Jones" },
    { id: "u3", firstName: "Charlie", lastName: "Brown" },
  ];

  beforeEach(async () => {
    mockCommonService = {
      getUsersWithClaim: jasmine.createSpy("getUsersWithClaim").and.returnValue(of(mockUsers)),
    };
    mockConversationService = {
      conversationAddUser: jasmine.createSpy("conversationAddUser").and.returnValue(of({ conversation: {} })),
    };
    mockSecurityService = {
      getUserDetail: jasmine.createSpy("getUserDetail").and.returnValue({ user: { id: "currentUser" } }),
    };
    mockToastr = { error: jasmine.createSpy("error"), success: jasmine.createSpy("success") };
    mockTranslate = { get: jasmine.createSpy("get").and.returnValue(of("translated")) };
    mockBsModalRef = { hide: jasmine.createSpy("hide") };

    await TestBed.configureTestingModule({
      declarations: [AddUserComponent, TranslatePipeMock],
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

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    component.currentMembers = [{ id: "u1" } as any];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load users excluding current members and current user", () => {
    expect(component.users.length).toBe(2);
    expect(component.users.some((u) => u.id === "u1")).toBeFalse();
  });

  it("should call conversationAddUser API", () => {
    component.selectedUser = { id: "u2", firstName: "Bob", lastName: "Jones" } as any;
    component.conversationId = "conv1";
    component.addUser();
    expect(mockConversationService.conversationAddUser).toHaveBeenCalledWith({
      conversationId: "conv1",
      selectedUser: { id: "u2", firstName: "Bob", lastName: "Jones" },
    });
  });

  it("should handle error response", () => {
    mockConversationService.conversationAddUser.and.returnValue(throwError(() => new Error("fail")));
    component.selectedUser = { id: "u2" } as any;
    component.addUser();
    expect(mockToastr.error).toHaveBeenCalled();
  });
});
