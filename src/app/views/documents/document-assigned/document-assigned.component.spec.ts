import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ChangeDetectorRef, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { DocumentAssignedComponent } from "./document-assigned.component";
import { DocumentAssignedService } from "@app/shared/services/document-assigned.service";
import { CommonService } from "@app/shared/services/common.service";
import { CategoryService } from "@app/shared/services/category.service";
import { OverlayPanel } from "@app/shared/preview/overlay-panel/overlay-panel.service";

@Pipe({ name: "utcToLocalTime" })
class MockUtcToLocalTimePipe implements PipeTransform {
  transform(value: any): string {
    return value ? String(value) : "";
  }
}

describe("DocumentAssignedComponent", () => {
  let component: DocumentAssignedComponent;
  let fixture: ComponentFixture<DocumentAssignedComponent>;
  let mockAssignedService: any;
  let mockCommonService: any;
  let mockCategoryService: any;
  let mockOverlay: any;

  const mockDocs: any[] = [
    { id: "1", name: "Assigned Doc 1", url: "documents/doc1.pdf", categoryName: "Cat A", createdByName: "User 1", createdByEmail: "u1@test.com", createdDate: new Date("2026-05-01"), isAllowDownload: true },
    { id: "2", name: "Assigned Doc 2", url: "documents/doc2.pdf", categoryName: "Cat B", createdByName: "User 2", createdByEmail: "u2@test.com", createdDate: new Date("2026-05-02"), isAllowDownload: false },
  ];

  beforeEach(async () => {
    mockAssignedService = {
      getDocuments: jasmine.createSpy("getDocuments").and.returnValue(of(new HttpResponse({ body: mockDocs, headers: new HttpHeaders({ totalCount: "2" }) }))),
    };

    mockCommonService = {
      downloadDocument: jasmine.createSpy("downloadDocument").and.returnValue(of({ type: 4, body: new Blob() })),
      addDocumentAuditTrail: jasmine.createSpy("addDocumentAuditTrail").and.returnValue(of({})),
    };

    mockCategoryService = {
      getAllCategoriesForDropDown: jasmine.createSpy("getAllCategoriesForDropDown").and.returnValue(of([])),
    };

    mockOverlay = {
      open: jasmine.createSpy("open"),
    };

    await TestBed.configureTestingModule({
      declarations: [DocumentAssignedComponent, MockUtcToLocalTimePipe],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: DocumentAssignedService, useValue: mockAssignedService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: OverlayPanel, useValue: mockOverlay },
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentAssignedComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load assigned documents on init", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);

    expect(mockAssignedService.getDocuments).toHaveBeenCalled();
    expect(component.rows.length).toBe(2);
  }));

  it("should call onCategoryChange and reload", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockAssignedService.getDocuments.calls.reset();

    component.onCategoryChange("cat1");
    tick(350);

    expect(mockAssignedService.getDocuments).toHaveBeenCalled();
    expect(component.documentResource.categoryId).toBe("cat1");
  }));

  it("should call onNameChange and reload", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockAssignedService.getDocuments.calls.reset();

    const event = { target: { value: "search" } };
    component.onNameChange(event);
    tick(350);

    expect(mockAssignedService.getDocuments).toHaveBeenCalled();
    expect(component.documentResource.name).toBe("search");
  }));

  it("should call onTagChange and reload", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockAssignedService.getDocuments.calls.reset();

    const event = { target: { value: "tag1" } };
    component.onTagChange(event);
    tick(350);

    expect(mockAssignedService.getDocuments).toHaveBeenCalled();
    expect(component.documentResource.metaTags).toBe("tag1");
  }));

  it("should open overlay on onDocumentView", () => {
    fixture.detectChanges();
    component.onDocumentView(mockDocs[0]);

    expect(mockOverlay.open).toHaveBeenCalled();
  });

  it("should call downloadDocument on commonService", () => {
    fixture.detectChanges();
    component.downloadDocument(mockDocs[0]);

    expect(mockCommonService.downloadDocument).toHaveBeenCalledWith("1", false);
  });

  it("should not have editDocument or deleteDocument methods (dead code removed)", () => {
    expect((component as any).editDocument).toBeUndefined();
    expect((component as any).deleteDocument).toBeUndefined();
  });
});
