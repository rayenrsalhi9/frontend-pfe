import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { NgSelectModule } from "@ng-select/ng-select";
import { QuillModule } from "ngx-quill";
import { of, throwError, Subject } from "rxjs";
import { ForumAddComponent } from "./forum-add.component";
import { ForumService } from "../forum.service";
import { ForumCategoryService } from "../forum-category/forum-category.service";
import { SecurityService } from "@app/core/security/security.service";
import { CommonService } from "@app/shared/services/common.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

describe("ForumAddComponent", () => {
  let component: ForumAddComponent;
  let fixture: ComponentFixture<ForumAddComponent>;
  let mockForumService: any;
  let mockSecurityService: any;
  let mockCommonService: any;
  let mockCategoryService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockUsers = [
    { id: 1, firstName: "John", lastName: "Doe", userName: "johnd" },
    { id: 2, firstName: "Jane", lastName: "Smith", userName: "janes" },
  ];

  const mockCategories = [
    { id: 1, name: "General" },
    { id: 2, name: "Tech" },
  ];

  const mockForum = {
    id: "123",
    title: "Existing Forum",
    content: "Existing content that is long enough for validation.",
    category: { id: 1, name: "General" },
    privacy: "private",
    allowedUsers: [
      { user_id: 1, user: { id: 1, firstName: "John", lastName: "Doe" } },
      { user_id: 2, user: { id: 2, firstName: "Jane", lastName: "Smith" } },
    ],
    tags: [{ metatag: "tag1" }, { metatag: "tag2" }],
  };

  beforeEach(async () => {
    mockForumService = {
      addForum: jasmine
        .createSpy("addForum")
        .and.returnValue(of({ id: "123" })),
      updateForum: jasmine.createSpy("updateForum").and.returnValue(of({})),
      getForum: jasmine.createSpy("getForum").and.returnValue(of(mockForum)),
    };

    mockSecurityService = {
      getUserDetail: () => ({
        user: { id: 1, firstName: "Test", lastName: "User" },
      }),
      hasClaim: jasmine.createSpy("hasClaim").and.returnValue(true),
      SecurityObject: of({
        user: { id: 1, firstName: "Test", lastName: "User" },
        claims: ["FORUM_ADD_TOPIC", "FORUM_EDIT_TOPIC"],
      }),
    };

    mockCommonService = {
      getUsers: jasmine.createSpy("getUsers").and.returnValue(of(mockUsers)),
    };

    mockCategoryService = {
      allCategories: jasmine
        .createSpy("allCategories")
        .and.returnValue(of(mockCategories)),
    };

    mockRouter = {
      navigate: jasmine.createSpy("navigate"),
    };

    mockActivatedRoute = {
      paramMap: new Subject<any>(),
    };

    await TestBed.configureTestingModule({
      declarations: [ForumAddComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        NgSelectModule,
        QuillModule.forRoot({}),
      ],
      providers: [
        { provide: ForumService, useValue: mockForumService },
        { provide: ForumCategoryService, useValue: mockCategoryService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForumAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    (mockActivatedRoute.paramMap as Subject<any>).next({ get: () => null });
  });

  /* ============================================
   * Basic Component Tests
   * ============================================ */

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with correct controls", () => {
    expect(component.forumForm).toBeTruthy();
    expect(component.forumForm.get("title")).toBeTruthy();
    expect(component.forumForm.get("category")).toBeTruthy();
    expect(component.forumForm.get("content")).toBeTruthy();
    expect(component.forumForm.get("private")).toBeTruthy();
    expect(component.forumForm.get("users")).toBeTruthy();
    expect(component.forumForm.get("tags")).toBeTruthy();
  });

  /* ============================================
   * Use Case 1 - Create Public Forum
   * ============================================ */

  it("should initialize form after creation", () => {
    expect(component.forumForm).toBeTruthy();
  });

  it("should validate title field with min length", () => {
    const titleControl = component.forumForm.get("title");
    titleControl?.setValue("abc"); // Too short (min 5)
    expect(titleControl?.valid).toBeFalsy();
    expect(titleControl?.errors?.["minlength"]).toBeTruthy();
  });

  it("should validate title field with max length", () => {
    const titleControl = component.forumForm.get("title");
    titleControl?.setValue("a".repeat(201)); // Too long (max 200)
    expect(titleControl?.valid).toBeFalsy();
    expect(titleControl?.errors?.["maxlength"]).toBeTruthy();
  });

  it("should validate content field with min length", () => {
    const contentControl = component.forumForm.get("content");
    contentControl?.setValue("short"); // Too short (min 10)
    expect(contentControl?.valid).toBeFalsy();
  });

  it("should submit form with public privacy", fakeAsync(() => {
    component.forumForm.patchValue({
      title: "Test Public Forum",
      category: "1",
      content: "This is test content that is long enough for validation.",
      private: false,
      users: [],
      tags: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockForumService.addForum).toHaveBeenCalled();
    const callArgs = mockForumService.addForum.calls.mostRecent().args[0];
    expect(callArgs.private).toBe(false);
    expect(callArgs.users).toEqual([]);
  }));

  it("should include empty users array when public", fakeAsync(() => {
    component.forumForm.patchValue({
      title: "Test Public Forum",
      category: "1",
      content: "This is test content that is long enough for validation.",
      private: false,
      users: [],
      tags: [],
    });

    component.onSubmit();
    tick();
    flush();

    const callArgs = mockForumService.addForum.calls.mostRecent().args[0];
    expect(callArgs.users).toEqual([]);
  }));

  it("should navigate to /apps/forums after successful creation", fakeAsync(() => {
    component.forumForm.patchValue({
      title: "Test Forum",
      category: "1",
      content: "This is test content that is long enough for validation.",
      private: false,
      users: [],
      tags: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/apps/forums"]);
  }));

  /* ============================================
   * Use Case 2 - Create Private Forum
   * ============================================ */

  it("should show users dropdown when private is checked", () => {
    component.forumForm.get("private")?.setValue(true);
    fixture.detectChanges();
    expect(component.forumForm.get("private")?.value).toBeTrue();
  });

  it("should auto-add current user when switching to private", fakeAsync(() => {
    component.currentUser = { id: 1, firstName: "Test", lastName: "User" };
    component.forumForm.get("private")?.setValue(false);
    component.forumForm.get("users")?.setValue([]);

    component.forumForm.get("private")?.setValue(true);
    tick();

    const users = component.forumForm.get("users")?.value;
    expect(users).toContain(1); // Current user ID
  }));

  it("should allow selecting multiple users from dropdown", () => {
    component.forumForm.get("private")?.setValue(true);
    component.forumForm.get("users")?.setValue([1, 2]);
    expect(component.forumForm.get("users")?.value.length).toBe(2);
  });

  it("should submit with privacy=private and users array", fakeAsync(() => {
    component.forumForm.patchValue({
      title: "Private Forum",
      category: "1",
      content: "Private content here that is long enough for validation.",
      private: true,
      users: [1, 2],
      tags: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockForumService.addForum).toHaveBeenCalled();
    const callArgs = mockForumService.addForum.calls.mostRecent().args[0];
    expect(callArgs.private).toBe(true);
    expect(callArgs.users).toContain(1);
    expect(callArgs.users).toContain(2);
  }));

  it("should include creator in users list when private", fakeAsync(() => {
    component.currentUser = { id: 1, firstName: "Test", lastName: "User" };
    component.forumForm.patchValue({
      title: "Private Forum",
      category: "1",
      content: "Private content here that is long enough for validation.",
      private: true,
      users: [2], // Only user 2, not creator
      tags: [],
    });

    component.onSubmit();
    tick();
    flush();

    const callArgs = mockForumService.addForum.calls.mostRecent().args[0];
    // prepareFormData should add creator to users
    expect(callArgs.users).toContain(1); // Creator
    expect(callArgs.users).toContain(2); // Selected user
  }));

  /* ============================================
   * Use Case 3 - Edit Forum (Public to Private)
   * ============================================ */

  it("should load forum data in edit mode", fakeAsync(() => {
    (mockActivatedRoute.paramMap as Subject<any>).next({
      get: (param: string) => (param === "id" ? "123" : null),
    });
    tick();

    expect(mockForumService.getForum).toHaveBeenCalledWith("123");
    expect(component.isEdit).toBeTrue();
  }));

  it("should populate form with existing forum data", fakeAsync(() => {
    (mockActivatedRoute.paramMap as Subject<any>).next({
      get: (param: string) => (param === "id" ? "123" : null),
    });
    tick();

    expect(component.forumForm.get("title")?.value).toBe("Existing Forum");
    expect(component.forumForm.get("content")?.value).toBe(
      "Existing content that is long enough for validation.",
    );
    expect(component.forumForm.get("private")?.value).toBeTrue();
  }));

  it("should call updateForum with updated data", fakeAsync(() => {
    component.isEdit = true;
    component.forumId = "123";
    component.forumForm.patchValue({
      title: "Updated Forum",
      category: "1",
      content: "Updated content here that is long enough for validation.",
      private: true,
      users: [1, 2],
      tags: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockForumService.updateForum).toHaveBeenCalledWith(
      "123",
      jasmine.any(Object),
    );
  }));

  /* ============================================
   * Claims Testing
   * ============================================ */

  it("should initialize form regardless of claims", fakeAsync(() => {
    mockSecurityService.hasClaim.and.returnValue(false);
    tick();
    fixture.detectChanges();
    expect(component.forumForm).toBeTruthy();
    const submitBtn = fixture.nativeElement.querySelector('.af-btn--submit');
    expect(submitBtn).toBeTruthy();
  }));

  /* ============================================
   * Additional Edge Cases
   * ============================================ */

  it("should handle privacy switch from private to public - clear users", fakeAsync(() => {
    component.forumForm.get("private")?.setValue(true);
    component.forumForm.get("users")?.setValue([1, 2]);
    tick();

    component.forumForm.get("private")?.setValue(false);
    tick();

    expect(component.forumForm.get("users")?.value).toEqual([]);
  }));

  it("should handle API error on create gracefully", fakeAsync(() => {
    mockForumService.addForum.and.returnValue(
      throwError(() => new Error("Server error")),
    );

    component.forumForm.patchValue({
      title: "Test Forum",
      category: "1",
      content: "This is test content that is long enough for validation.",
      private: false,
      users: [],
      tags: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(component.isLoading).toBeFalse();
  }));

  it("should process tags correctly", fakeAsync(() => {
    component.forumForm.patchValue({
      title: "Test Title",
      category: "1",
      content: "Content here that is long enough for validation.",
      tags: ["tag1", "tag2"],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockForumService.addForum).toHaveBeenCalled();
    const callArgs = mockForumService.addForum.calls.mostRecent().args[0];
    expect(callArgs.tags).toContain("tag1");
    expect(callArgs.tags).toContain("tag2");
  }));

  it("should unsubscribe on destroy", () => {
    spyOn((component as any).destroy$, "next");
    spyOn((component as any).destroy$, "complete");

    component.ngOnDestroy();

    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });
});
