import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { NgSelectModule } from "@ng-select/ng-select";
import { of, BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentAddComponent } from "./document-add.component";
import { DocumentService } from "@app/shared/services/document.service";
import { DocumentPermissionService } from "@app/shared/services/document-permission.service";
import { CommonService } from "@app/shared/services/common.service";
import { CategoryService } from "@app/shared/services/category.service";

describe("DocumentAddComponent", () => {
  let component: DocumentAddComponent;
  let fixture: ComponentFixture<DocumentAddComponent>;
  let mockDocumentService: any;
  let mockPermissionService: any;
  let mockCommonService: any;
  let mockCategoryService: any;
  let mockRouter: any;

  const paramMapSubject = new BehaviorSubject({ get: () => null });

  beforeEach(async () => {
    mockDocumentService = {
      addDocument: jasmine.createSpy("addDocument").and.returnValue(of("new-id")),
      updateDocument: jasmine.createSpy("updateDocument").and.returnValue(of({})),
      getDocument: jasmine.createSpy("getDocument").and.returnValue(of({
        id: "edit-id", name: "Existing", description: "Existing desc", categoryId: "cat1", url: "file.pdf",
        documentMetaDatas: [],
      })),
    };

    mockPermissionService = {
      getDocumentPermission: jasmine.createSpy("getDocumentPermission").and.returnValue(of([])),
    };

    mockCommonService = {
      getUsersForDropdown: jasmine.createSpy("getUsersForDropdown").and.returnValue(of([])),
      getRolesForDropdown: jasmine.createSpy("getRolesForDropdown").and.returnValue(of([])),
      addDocumentAuditTrail: jasmine.createSpy("addDocumentAuditTrail").and.returnValue(of({})),
    };

    mockCategoryService = {
      getAllCategoriesForDropDown: jasmine.createSpy("getAllCategoriesForDropDown").and.returnValue(of([])),
    };

    mockRouter = {
      navigate: jasmine.createSpy("navigate"),
    };

    await TestBed.configureTestingModule({
      declarations: [DocumentAddComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: DocumentPermissionService, useValue: mockPermissionService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentAddComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should initialize form on creation", () => {
    fixture.detectChanges();
    expect(component.documentForm).toBeDefined();
    expect(component.documentForm.get("name")).toBeDefined();
    expect(component.documentForm.get("categoryId")).toBeDefined();
    expect(component.documentForm.get("description")).toBeDefined();
  });

  it("should require name field", () => {
    fixture.detectChanges();
    const nameControl = component.documentForm.get("name");
    expect(nameControl?.valid).toBeFalse();
    expect(nameControl?.hasError("required")).toBeTrue();
  });

  it("should require categoryId field", () => {
    fixture.detectChanges();
    const catControl = component.documentForm.get("categoryId");
    expect(catControl?.valid).toBeFalse();
    expect(catControl?.hasError("required")).toBeTrue();
  });

  it("should initialize role and user permission form groups", () => {
    fixture.detectChanges();
    expect(component.rolePermissionFormGroup.get("isAllowDownload")).toBeDefined();
    expect(component.userPermissionFormGroup.get("isAllowDownload")).toBeDefined();
  });

  it("should call addDocument in saveDocument when not edit mode", () => {
    fixture.detectChanges();
    component.documentForm.patchValue({
      name: "New Doc",
      categoryId: "cat1",
      description: "New Desc",
    });

    component.saveDocument();

    expect(mockDocumentService.addDocument).toHaveBeenCalled();
  });

  it("should navigate to /document/list after successful add", fakeAsync(() => {
    fixture.detectChanges();
    component.documentForm.patchValue({
      name: "New Doc",
      categoryId: "cat1",
      description: "New Desc",
    });

    component.saveDocument();
    tick();
    flush();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/document/list"]);
  }));

  it("should load document for edit via loadDocumentForEdit", fakeAsync(() => {
    fixture.detectChanges();
    const doc = { id: "edit-id", name: "Edit Doc", description: "Edit Desc", categoryId: "cat1", url: "edit.pdf", documentMetaDatas: [] };
    mockDocumentService.getDocument.and.returnValue(of(doc));
    mockPermissionService.getDocumentPermission.and.returnValue(of([]));

    component.loadDocumentForEdit("edit-id");
    tick();

    expect(mockDocumentService.getDocument).toHaveBeenCalledWith("edit-id");
    expect(component.documentForm.get("name").value).toBe("Edit Doc");
  }));

  it("should build document object with permissions", () => {
    fixture.detectChanges();
    component.documentForm.patchValue({
      name: "Test Doc",
      categoryId: "cat1",
      description: "Test Desc",
    });

    component.selectedRoles = [{ id: "role1", name: "Admin" }];
    component.rolePermissionFormGroup.patchValue({ isAllowDownload: true });
    component.selectedUsers = [{ id: "user1", firstName: "John", lastName: "Doe" }];
    component.userPermissionFormGroup.patchValue({ isAllowDownload: false });

    const doc = component.buildDocumentObject();

    expect(doc.name).toBe("Test Doc");
    expect(doc.documentRolePermissions).toBeDefined();
    expect(doc.documentRolePermissions?.length).toBe(1);
    expect(doc.documentRolePermissions?.[0].roleId).toBe("role1");
    expect((doc.documentRolePermissions?.[0] as any).isAllowDownload).toBeTrue();
    expect(doc.documentUserPermissions?.length).toBe(1);
    expect(doc.documentUserPermissions?.[0].userId).toBe("user1");
    expect((doc.documentUserPermissions?.[0] as any).isAllowDownload).toBeFalse();
  });

  it("should handle file upload via fileInput.files reference", () => {
    fixture.detectChanges();
    const file = new File(["content"], "document.pdf", { type: "application/pdf" });
    const fileList = { length: 1, 0: file } as unknown as FileList;

    component.upload(fileList);

    expect(component.fileData).toBe(file);
    expect(component.extension).toBe("pdf");
  });
});
