import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UpdateConversationComponent } from "./update-conversation.component";
import { ConversationService } from "@app/shared/services/conversation.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

describe("UpdateConversationComponent", () => {
  let component: UpdateConversationComponent;
  let fixture: ComponentFixture<UpdateConversationComponent>;
  let mockConversationService: any;
  let mockToastr: any;
  let mockTranslate: any;
  let mockBsModalRef: any;

  beforeEach(async () => {
    mockConversationService = {
      updateConversation: jasmine.createSpy("updateConversation").and.returnValue(of({})),
    };
    mockToastr = { error: jasmine.createSpy("error"), success: jasmine.createSpy("success") };
    mockTranslate = { get: jasmine.createSpy("get").and.returnValue(of("translated")) };
    mockBsModalRef = { hide: jasmine.createSpy("hide") };

    await TestBed.configureTestingModule({
      declarations: [UpdateConversationComponent, TranslatePipeMock],
      providers: [
        { provide: ConversationService, useValue: mockConversationService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: BsModalRef, useValue: mockBsModalRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(UpdateConversationComponent);
    component = fixture.componentInstance;
    component.conversation = { id: "conv1", title: "Original Title" } as any;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with conversation title", () => {
    expect(component.originalTitle).toBe("Original Title");
  });

  it("should detect when title has changed", () => {
    component.conversation.title = "New Title";
    component.onTitleChange();
    expect(component.hasTitleChanged).toBeTrue();
  });

  it("should call updateConversation API", () => {
    component.conversation.title = "Updated Title";
    component.updateConversation();
    expect(mockConversationService.updateConversation).toHaveBeenCalledWith("conv1", { title: "Updated Title" });
  });

  it("should not update with empty title", () => {
    component.conversation.title = "";
    component.updateConversation();
    expect(mockConversationService.updateConversation).not.toHaveBeenCalled();
  });
});
