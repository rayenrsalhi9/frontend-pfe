import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import { WelcomeComponent } from "./welcome.component";
import { BlogService } from "@app/views/apps/blog/blog.service";
import { ForumService } from "@app/views/apps/forum/forum.service";
import { ArticleService } from "@app/shared/services/article.service";
import { UserService } from "@app/shared/services/user.service";
import { SurveyService } from "@app/views/apps/survey/survey.service";
import { SecurityService } from "@app/core/security/security.service";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { ModalModule, BsModalService } from "ngx-bootstrap/modal";
import { ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef, Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "utcToLocalTime" })
class MockUtcToLocalTimePipe implements PipeTransform {
  transform(value: any): string {
    return value ? new Date(value).toLocaleString() : "";
  }
}

describe("WelcomeComponent", () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockBlogService: any;
  let mockForumService: any;
  let mockArticleService: any;
  let mockSurveyService: any;
  let mockSecurityService: any;
  let mockUserService: any;

  const mockBlogs = [
    {
      id: "1",
      title: "Blog 1",
      picture: "images/blog1.jpg",
      category: { name: "Tech" },
      createdAt: new Date("2026-05-06"),
      creator: { firstName: "John", lastName: "Doe" },
    },
    {
      id: "2",
      title: "Blog 2",
      picture: "images/blog2.jpg",
      category: { name: "General" },
      createdAt: new Date("2026-05-05"),
      creator: { firstName: "Jane", lastName: "Smith" },
    },
  ];

  const mockForums = [
    {
      id: "1",
      title: "Forum 1",
      category: { name: "Tech" },
      createdAt: new Date("2026-05-06"),
      creator: { firstName: "John", lastName: "Doe" },
      commentsCount: 5,
      reactionsCount: 10,
    },
    {
      id: "2",
      title: "Forum 2",
      category: { name: "General" },
      createdAt: new Date("2026-05-05"),
      creator: { firstName: "Jane", lastName: "Smith" },
      commentsCount: 3,
      reactionsCount: 7,
    },
  ];

  const mockArticles = [
    {
      id: "1",
      title: "Article 1",
      picture: "images/article1.jpg",
      category: { name: "Tech" },
      createdAt: new Date("2026-05-06"),
      creator: { firstName: "John", lastName: "Doe" },
    },
  ];

  const mockSurvey = {
    id: "1",
    title: "Test Survey",
    type: "simple",
  };

  beforeEach(async () => {
    mockBlogService = {
      allBlogs: jasmine.createSpy("allBlogs").and.returnValue(of(mockBlogs)),
    };

    mockForumService = {
      allForums: jasmine.createSpy("allForums").and.returnValue(of(mockForums)),
    };

    mockArticleService = {
      allArticles: jasmine
        .createSpy("allArticles")
        .and.returnValue(of(mockArticles)),
    };

    mockSurveyService = {
      getLatestSurvey: jasmine
        .createSpy("getLatestSurvey")
        .and.returnValue(of(mockSurvey)),
      responseSurvey: jasmine
        .createSpy("responseSurvey")
        .and.returnValue(of({})),
    };

    mockSecurityService = {
      SecurityObject: of({
        user: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          userName: "testuser",
        },
        authorisation: { token: "fake-token" },
      }),
      isGuestUser: () => false,
      isUserAuthenticate: () => true,
    };

    mockUserService = {};

    await TestBed.configureTestingModule({
      declarations: [WelcomeComponent, MockUtcToLocalTimePipe],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        ModalModule.forRoot(),
      ],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: ForumService, useValue: mockForumService },
        { provide: ArticleService, useValue: mockArticleService },
        { provide: SurveyService, useValue: mockSurveyService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: {} },
        BsModalService,
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
  });

  /* ===========================================
   * Basic Component Tests
   * =========================================== */

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should load latest blogs, forums, and articles on init", () => {
    fixture.detectChanges();

    expect(mockBlogService.allBlogs).toHaveBeenCalled();
    expect(mockForumService.allForums).toHaveBeenCalled();
    expect(mockArticleService.allArticles).toHaveBeenCalled();
  });

  /* ===========================================
   * Post Display with Privacy
   * =========================================== */

  it("should display public posts for all users", fakeAsync(() => {
    const publicBlogs = [
      { id: "1", title: "Public Blog", privacy: "public" as const },
      { id: "2", title: "Another Public", privacy: "public" as const },
    ];
    mockBlogService.allBlogs.and.returnValue(of(publicBlogs));

    fixture.detectChanges();
    tick();

    expect(component.latestBlogs.length).toBeGreaterThan(0);
  }));

  it("should set featuredBlog as the first blog from API", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // featuredBlog is latestBlogs[0], i.e. first item from API
    expect(component.featuredBlog).toEqual(mockBlogs[0]);
  }));

  /* ===========================================
   * Authentication-Based Display
   * =========================================== */

  it("should show stats when user is authenticated", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // isAuthenticated$ should emit true
    component.isAuthenticated$.subscribe((val) => {
      expect(val).toBe(true);
    });
  }));

  it("should show user name in hero title when authenticated", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.userName$.subscribe((name) => {
      expect(name).toBe("Test");
    });
  }));

  /* ===========================================
   * Helper Methods
   * =========================================== */

  it("should compute featuredBlog correctly", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // featuredBlog is the first blog
    expect(component.featuredBlog).toEqual(mockBlogs[0]);
  }));

  it("should compute remainingBlogs correctly", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // remainingBlogs is all except first
    expect(component.remainingBlogs.length).toBe(mockBlogs.length - 1);
  }));

  it("should displayName correctly with firstName and lastName", () => {
    const creator = { firstName: "John", lastName: "Doe", userName: "johnd" };
    const result = component.displayName(creator);
    expect(result).toBe("John Doe");
  });

  it("should displayName fallback to userName", () => {
    const creator = { userName: "johnd" };
    const result = component.displayName(creator);
    expect(result).toBe("johnd");
  });

  /* ===========================================
   * Privacy Integration (API-Level)
   * =========================================== */

  it("should call allForums with limit parameter", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockForumService.allForums).toHaveBeenCalledWith({ limit: 5 });
  }));

  it("should call allBlogs with limit parameter", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockBlogService.allBlogs).toHaveBeenCalledWith({ limit: 5 });
  }));

  it("should call allArticles with limit parameter", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockArticleService.allArticles).toHaveBeenCalledWith({ limit: 5 });
  }));

  it("should handle API errors gracefully", fakeAsync(() => {
    mockBlogService.allBlogs.and.returnValue(of(null));
    mockForumService.allForums.and.returnValue(of(null));
    mockArticleService.allArticles.and.returnValue(of(null));

    fixture.detectChanges();
    tick();

    expect(component.articles).toEqual([]);
    expect(component.latestBlogs).toEqual([]);
    expect(component.latestForums).toEqual([]);
  }));

  /* ===========================================
   * Survey Tests
   * =========================================== */

  it("should load latest survey on init", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockSurveyService.getLatestSurvey).toHaveBeenCalled();
    expect(component.survey).toEqual(mockSurvey);
  }));

  it("should handle survey load error", fakeAsync(() => {
    mockSurveyService.getLatestSurvey.and.returnValue(of(null));

    fixture.detectChanges();
    tick();

    expect(component.survey).toBeNull();
  }));

  it("should call surveyAnswer with correct value when answered", fakeAsync(() => {
    const translateService = TestBed.inject(TranslateService);
    spyOn(translateService, "get").and.returnValue(
      of({ SUCCESS: "Thanks!", ERROR: "Failed" }),
    );

    fixture.detectChanges();
    tick();

    component.surveyAnswer(1);
    tick();

    expect(mockSurveyService.responseSurvey).toHaveBeenCalledWith("1", {
      answer: 1,
    });
    flush();
  }));

  it("should load new survey after answering successfully", fakeAsync(() => {
    const translateService = TestBed.inject(TranslateService);
    spyOn(translateService, "get").and.returnValue(
      of({ SUCCESS: "Thanks!", ERROR: "Failed" }),
    );

    fixture.detectChanges();
    tick();
    mockSurveyService.getLatestSurvey.calls.reset();

    component.surveyAnswer(1);
    tick();

    expect(mockSurveyService.getLatestSurvey).toHaveBeenCalled();
    flush();
  }));

  it("should show error toastr when survey answer fails", fakeAsync(() => {
    const translateService = TestBed.inject(TranslateService);
    spyOn(translateService, "get").and.returnValue(
      of({ SUCCESS: "Thanks!", ERROR: "Failed" }),
    );
    mockSurveyService.responseSurvey.and.returnValue(
      throwError(() => new Error("Server error")),
    );
    const toastrSpy = spyOn(component["toastr"], "error");

    fixture.detectChanges();
    tick();

    component.surveyAnswer(1);
    tick();

    expect(toastrSpy).toHaveBeenCalled();
  }));

  it("should show login prompt when user is NOT authenticated", fakeAsync(() => {
    mockSecurityService.SecurityObject = of(null);
    mockSecurityService.isUserAuthenticate = () => false;

    fixture.detectChanges();
    tick();

    component.isAuthenticated$.subscribe((val) => {
      expect(val).toBe(false);
    });
  }));

  it("should set survey to null for invalid survey type", fakeAsync(() => {
    mockSurveyService.getLatestSurvey.and.returnValue(
      of({ id: "1", title: "Bad", type: "unknown" }),
    );

    fixture.detectChanges();
    tick();

    expect(component.survey).toBeNull();
  }));

  it("should call getLatestSurvey on init", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockSurveyService.getLatestSurvey).toHaveBeenCalled();
  }));

  /* ===========================================
   * Normalize Forum
   * =========================================== */

  it("should normalize forum with reactions count", () => {
    const forum = {
      reactionsCount: undefined,
      reactions_count: 5,
      commentsCount: undefined,
      comments_count: 3,
      reactions: [] as any[],
      reactionsUp: [] as any[],
      reactionsDown: [] as any[],
      reactionsHeart: [] as any[],
    };

    const normalized = component.normalizeForum(forum);

    expect(normalized.reactionsCount).toBe(5);
    expect(normalized.commentsCount).toBe(3);
  });

  it("should normalize forum with zero reactions", () => {
    const forum = {
      reactions: [] as any[],
      comments: [] as any[],
    };

    const normalized = component.normalizeForum(forum);

    expect(normalized.reactionsCount).toBe(0);
    expect(normalized.commentsCount).toBe(0);
  });

  /* ===========================================
   * Component Cleanup
   * =========================================== */

  it("should handle ngOnInit lifecycle", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.hostBase).toBeTruthy();
    expect(component.latestBlogs).toBeDefined();
    expect(component.latestForums).toBeDefined();
    expect(component.articles).toBeDefined();
  }));
});
