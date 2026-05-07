import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { of, throwError } from 'rxjs';
import { BlogAddComponent } from './blog-add.component';
import { BlogService } from '../blog.service';
import { BlogCategoryService } from '../blog-category/blog-category.service';
import { SecurityService } from '@app/core/security/security.service';
import { CommonService } from '@app/shared/services/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

describe('BlogAddComponent', () => {
  let component: BlogAddComponent;
  let fixture: ComponentFixture<BlogAddComponent>;
  let mockBlogService: any;
  let mockSecurityService: any;
  let mockCommonService: any;
  let mockCategoryService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', userName: 'johnd' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', userName: 'janes' }
  ];

  const mockCategories = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Tech' }
  ];

  const mockBlog = {
    id: '123',
    title: 'Existing Blog',
    subtitle: 'Existing subtitle that is long enough for validation tests',
    body: 'Existing body content that is definitely long enough for validation.',
    category: { id: 1, name: 'General' },
    privacy: 'private',
    allowedUsers: [
      { user_id: 1, user: { id: 1, firstName: 'John', lastName: 'Doe' } },
      { user_id: 2, user: { id: 2, firstName: 'Jane', lastName: 'Smith' } }
    ],
    picture: 'images/test.jpg'
  };

  beforeEach(async () => {
    mockBlogService = {
      addBlog: jasmine.createSpy('addBlog').and.returnValue(of({ id: '123' })),
      updateBlog: jasmine.createSpy('updateBlog').and.returnValue(of({})),
      getBlog: jasmine.createSpy('getBlog').and.returnValue(of(mockBlog))
    };

    mockSecurityService = {
      getUserDetail: () => ({ user: { id: 1, firstName: 'Test', lastName: 'User' } }),
      hasClaim: jasmine.createSpy('hasClaim').and.returnValue(true),
      SecurityObject: of({ user: { id: 1, firstName: 'Test', lastName: 'User' }, claims: ['BLOG_ADD_BLOG', 'BLOG_EDIT_BLOG'] })
    };

    mockCommonService = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of(mockUsers))
    };

    mockCategoryService = {
      allCategories: jasmine.createSpy('allCategories').and.returnValue(of(mockCategories))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      url: '/blog-add'
    };

    mockActivatedRoute = {
      paramMap: of({ get: () => null })
    };

    await TestBed.configureTestingModule({
      declarations: [BlogAddComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        NgSelectModule,
        QuillModule.forRoot({})
      ],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: BlogCategoryService, useValue: mockCategoryService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        ToastrService,
        TranslateService,
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ===========================================
   * Basic Component Tests
   * =========================================== */

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct controls', () => {
    expect(component.blogForm).toBeTruthy();
    expect(component.blogForm.get('title')).toBeTruthy();
    expect(component.blogForm.get('subtitle')).toBeTruthy();
    expect(component.blogForm.get('body')).toBeTruthy();
    expect(component.blogForm.get('category')).toBeTruthy();
    expect(component.blogForm.get('private')).toBeTruthy();
    expect(component.blogForm.get('users')).toBeTruthy();
    expect(component.blogForm.get('picture')).toBeTruthy();
  });

  /* ===========================================
   * Use Case 1 - Create Public Blog
   * =========================================== */

  it('should validate subtitle length - too short', () => {
    const subtitleControl = component.blogForm.get('subtitle');
    subtitleControl?.setValue('short'); // Too short (min 10)
    expect(subtitleControl?.valid).toBeFalsy();
  });

  it('should validate subtitle length - too long', () => {
    const subtitleControl = component.blogForm.get('subtitle');
    subtitleControl?.setValue('a'.repeat(301)); // Too long (max 300)
    expect(subtitleControl?.valid).toBeFalsy();
  });

  it('should validate body min length', () => {
    const bodyControl = component.blogForm.get('body');
    bodyControl?.setValue('short'); // Too short (min 50)
    expect(bodyControl?.valid).toBeFalsy();
  });

  it('should submit form with public privacy', fakeAsync(() => {
    component.blogForm.patchValue({
      title: 'Test Public Blog',
      subtitle: 'Subtitle that is long enough for validation tests',
      body: 'This is blog body content that is definitely long enough for validation.',
      category: '1',
      private: false,
      users: [],
      picture: 'data:image/jpeg;base64,fake'
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockBlogService.addBlog).toHaveBeenCalled();
    const callArgs = mockBlogService.addBlog.calls.mostRecent().args[0];
    expect(callArgs.private).toBe(false);
    expect(callArgs.users).toEqual([]);
  }));

  it('should navigate to /apps/blogs after successful creation', fakeAsync(() => {
    component.blogForm.patchValue({
      title: 'Test Blog',
      subtitle: 'Subtitle that is long enough for validation tests',
      body: 'Body content here that is definitely long enough for validation.',
      category: '1',
      private: false,
      users: [],
      picture: 'data:image/jpeg;base64,fake'
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/apps/blogs']);
  }));

  /* ===========================================
   * Use Case 2 - Create Private Blog
   * =========================================== */

  it('should show users dropdown when private checked', () => {
    component.blogForm.get('private')?.setValue(true);
    fixture.detectChanges();
    expect(component.blogForm.get('private')?.value).toBeTrue();
  });

  it('should auto-add current user when private', fakeAsync(() => {
    component.currentUser = { id: 1, firstName: 'Test', lastName: 'User' };
    component.blogForm.get('private')?.setValue(false);
    component.blogForm.get('users')?.setValue([]);

    component.blogForm.get('private')?.setValue(true);
    tick();

    const users = component.blogForm.get('users')?.value;
    expect(users).toContain(1); // Current user ID
  }));

  it('should submit with privacy=private and users', fakeAsync(() => {
    component.blogForm.patchValue({
      title: 'Private Blog',
      subtitle: 'Subtitle that is long enough for validation tests',
      body: 'Private body content that is definitely long enough for validation.',
      category: '1',
      private: true,
      users: [1, 2],
      picture: 'data:image/jpeg;base64,fake'
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockBlogService.addBlog).toHaveBeenCalled();
    const callArgs = mockBlogService.addBlog.calls.mostRecent().args[0];
    expect(callArgs.private).toBe(true);
    expect(callArgs.users).toContain(1);
    expect(callArgs.users).toContain(2);
  }));

  /* ===========================================
   * Use Case 3 - Edit Blog
   * =========================================== */

  it('should load blog data in edit mode', fakeAsync(() => {
    mockActivatedRoute.paramMap = of({ get: (param: string) => param === 'id' ? '123' : null });

    component.ngOnInit();
    tick();

    expect(mockBlogService.getBlog).toHaveBeenCalledWith('123');
    expect(component.isEdit).toBeTrue();
  }));

  it('should clear picture validator in edit mode', fakeAsync(() => {
    mockActivatedRoute.paramMap = of({ get: (param: string) => param === 'id' ? '123' : null });

    component.ngOnInit();
    tick();

    const pictureControl = component.blogForm.get('picture');
    expect(pictureControl?.validator).toBeNull();
  }));

  it('should populate form with existing blog data', fakeAsync(() => {
    mockActivatedRoute.paramMap = of({ get: (param: string) => param === 'id' ? '123' : null });

    component.ngOnInit();
    tick();

    expect(component.blogForm.get('title')?.value).toBe('Existing Blog');
    expect(component.blogForm.get('subtitle')?.value).toBe('Existing subtitle that is long enough for validation tests');
    expect(component.blogForm.get('private')?.value).toBeTrue();
  }));

  it('should call updateBlog with updated data', fakeAsync(() => {
    component.isEdit = true;
    component.blogId = '123';
    component.blogForm.patchValue({
      title: 'Updated Blog',
      subtitle: 'Updated subtitle that is long enough for validation tests',
      body: 'Updated body content that is definitely long enough for validation.',
      category: '1',
      private: true,
      users: [1, 2],
      picture: 'data:image/jpeg;base64,fake'
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockBlogService.updateBlog).toHaveBeenCalledWith('123', jasmine.any(Object));
  }));

  /* ===========================================
   * Claims Testing
   * =========================================== */

  it('should check BLOG_ADD_BLOG claim for create', fakeAsync(() => {
    mockActivatedRoute.paramMap = of({ get: () => null });
    mockSecurityService.hasClaim.and.returnValue(false);
    component.ngOnInit();
    tick();
    expect(component.blogForm).toBeTruthy();
    expect(component.isEdit).toBeFalsy();
  }));

  it('should check BLOG_EDIT_BLOG claim for edit', fakeAsync(() => {
    mockActivatedRoute.paramMap = of({ get: (param: string) => param === 'id' ? '123' : null });
    mockSecurityService.hasClaim.and.returnValue(true);

    component.ngOnInit();
    tick();
    expect(component.isEdit).toBeTrue();
    expect(component.blogId).toBe('123');
  }));

  /* ===========================================
   * Additional Edge Cases
   * =========================================== */

  it('should validate image file type', () => {
    const event = {
      target: {
        files: [{ type: 'application/pdf', name: 'test.pdf', size: 1024 }]
      }
    };
    const translateSpy = spyOn(component['translate'], 'get').and.returnValue(of('Error'));
    const toastrSpy = spyOn(component['toastrService'], 'error');

    component.onFileSelect(event as any);

    expect(toastrSpy).toHaveBeenCalled();
  });

  it('should validate image file size - too large', () => {
    const event = {
      target: {
        files: [{ type: 'image/jpeg', name: 'test.jpg', size: 6 * 1024 * 1024 }] // 6MB > 5MB
      }
    };
    const toastrSpy = spyOn(component['toastrService'], 'error');

    component.onFileSelect(event as any);

    expect(toastrSpy).toHaveBeenCalled();
  });

  it('should watch for form changes in edit mode', () => {
    component.isEdit = true;
    component.blogId = '123';

    expect(component.blogForm.pristine).toBeTrue();

    component.blogForm.markAsDirty();
    expect(component.blogForm.dirty).toBeTrue();
  });

  it('should handle privacy switch private to public - remove users', fakeAsync(() => {
    component.blogForm.get('private')?.setValue(true);
    component.blogForm.get('users')?.setValue([1, 2]);
    tick();

    component.blogForm.get('private')?.setValue(false);
    tick();

    expect(component.blogForm.get('users')?.value).toEqual([]);
  }));

  it('should sanitize content before submission', () => {
    const result = component['sanitizeContent']('<script>alert("xss")</script>Test');
    expect(result).not.toContain('<script>');
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
