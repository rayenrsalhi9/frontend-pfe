import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ChangeDetectorRef, Component, Input, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BsModalService } from "ngx-bootstrap/modal";
import { of, Subject } from "rxjs";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { DocumentListComponent } from "./document-list.component";
import { DocumentService } from "@app/shared/services/document.service";
import { CommonService } from "@app/shared/services/common.service";
import { CategoryService } from "@app/shared/services/category.service";
import { OverlayPanel } from "@app/shared/preview/overlay-panel/overlay-panel.service";

@Pipe({ name: "utcToLocalTime" })
class MockUtcToLocalTimePipe implements PipeTransform {
  transform(value: any): string {
    return value ? String(value) : "";
  }
}

describe("DocumentListComponent", () => {
  let component: DocumentListComponent;
  let fixture: ComponentFixture<DocumentListComponent>;
  let mockDocumentService: any;
  let mockCommonService: any;
  let mockCategoryService: any;
  let mockOverlay: any;
  let mockModalService: any;

  const mockDocs: any[] = [
    { id: "1", name: "Doc 1", url: "doc1.pdf", categoryName: "Cat A", createdByName: "User 1", createdByEmail: "u1@test.com", createdDate: new Date("2026-05-01"), isAllowDownload: true },
    { id: "2", name: "Doc 2", url: "doc2.pdf", categoryName: "Cat B", createdByName: "User 2", createdByEmail: "u2@test.com", createdDate: new Date("2026-05-02"), isAllowDownload: false },
  ];

  beforeEach(async () => {
    mockDocumentService = {
      getDocuments: jasmine.createSpy("getDocuments").and.returnValue(of(new HttpResponse({ body: mockDocs, headers: new HttpHeaders({ totalCount: "2" }) }))),
      deleteDocument: jasmine.createSpy("deleteDocument").and.returnValue(of({})),
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

    mockModalService = {
      show: jasmine.createSpy("show").and.returnValue({
        content: { onClose: of(true) },
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [DocumentListComponent, MockUtcToLocalTimePipe],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: OverlayPanel, useValue: mockOverlay },
        { provide: BsModalService, useValue: mockModalService },
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load documents on init", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);

    expect(mockDocumentService.getDocuments).toHaveBeenCalled();
    expect(component.rows.length).toBe(2);
  }));

  it("should call onCategoryChange and reload", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockDocumentService.getDocuments.calls.reset();

    component.onCategoryChange("cat1");
    tick(350);

    expect(mockDocumentService.getDocuments).toHaveBeenCalled();
    expect(component.documentResource.categoryId).toBe("cat1");
  }));

  it("should call onNameChange and reload", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockDocumentService.getDocuments.calls.reset();

    const event = { target: { value: "search-term" } };
    component.onNameChange(event);
    tick(350);

    expect(mockDocumentService.getDocuments).toHaveBeenCalled();
    expect(component.documentResource.name).toBe("search-term");
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

  it("should show delete modal on deleteDocument", fakeAsync(() => {
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, "get").and.returnValue(of({ TITLE: "Delete", MESSAGE: "Sure?", BUTTON: { CANCEL: "No", CONFIRM: "Yes" } }));

    fixture.detectChanges();
    component.deleteDocument(mockDocs[0]);
    tick();
    flush();

    expect(mockModalService.show).toHaveBeenCalled();
  }));

  it("should call deleteDocument service after confirm", fakeAsync(() => {
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, "get").and.returnValue(of({ TITLE: "Delete", MESSAGE: "Sure?", BUTTON: { CANCEL: "No", CONFIRM: "Yes" } }));

    fixture.detectChanges();
    component.deleteDocument(mockDocs[0]);
    tick();
    flush();

    expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith("1");
  }));
});
