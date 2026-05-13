import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { DocumentInfo } from "@app/shared/enums/document-info";
import { DocumentResource } from "@app/shared/enums/document-resource";
import { DocumentService } from "./document.service";

describe("DocumentService", () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService, CommonHttpErrorService],
    });

    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("updateDocument", () => {
    it("should send PUT request to document/{id}", () => {
      const doc: DocumentInfo = { id: "123", name: "Test", description: "Desc", categoryId: "cat1", url: "file.pdf", documentMetaDatas: [] };

      service.updateDocument(doc).subscribe();

      const req = httpMock.expectOne("document/123");
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(doc);
      req.flush(doc);
    });

    it("should filter out empty metatags before sending", () => {
      const doc: DocumentInfo = {
        id: "123", name: "Test", description: "Desc", categoryId: "cat1", url: "file.pdf",
        documentMetaDatas: [{ metatag: "keep" }, { metatag: "" }, { metatag: "also-keep" }],
      };

      service.updateDocument(doc).subscribe();

      const req = httpMock.expectOne("document/123");
      expect(req.request.body.documentMetaDatas).toEqual([{ metatag: "keep" }, { metatag: "also-keep" }]);
      req.flush(doc);
    });
  });

  describe("addDocument", () => {
    it("should send POST with FormData", () => {
      const doc: DocumentInfo = {
        name: "New Doc",
        categoryId: "cat1",
        description: "Desc",
        fileData: new File(["test"], "test.pdf"),
        extension: "pdf",
        documentMetaDatas: [],
        documentUserPermissions: [],
      };

      service.addDocument(doc).subscribe();

      const req = httpMock.expectOne("document");
      expect(req.request.method).toBe("POST");
      expect(req.request.body instanceof FormData).toBeTrue();
      expect(req.request.body.get("name")).toBe("New Doc");
      expect(req.request.body.get("categoryId")).toBe("cat1");
      expect(req.request.body.get("extension")).toBe("pdf");
      req.flush("new-id-123");
    });

    it("should filter out empty metatags before sending", () => {
      const doc: DocumentInfo = {
        name: "New Doc", categoryId: "cat1", description: "Desc",
        fileData: new File(["test"], "test.pdf"),
        documentMetaDatas: [{ metatag: "good" }, { metatag: "" }],
        documentUserPermissions: [],
      };

      service.addDocument(doc).subscribe();

      const req = httpMock.expectOne("document");
      const formData = req.request.body as FormData;
      const parsedMetas = JSON.parse(formData.get("documentMetaDatas") as string);
      expect(parsedMetas).toEqual([{ metatag: "good" }]);
      req.flush("id");
    });
  });

  describe("deleteDocument", () => {
    it("should send DELETE request to document/{id}", () => {
      service.deleteDocument("456").subscribe();

      const req = httpMock.expectOne("document/456");
      expect(req.request.method).toBe("DELETE");
      req.flush(null);
    });
  });

  describe("getDocument", () => {
    it("should send GET request to document/{id}", () => {
      service.getDocument("789").subscribe();

      const req = httpMock.expectOne("document/789");
      expect(req.request.method).toBe("GET");
      req.flush({ id: "789" } as DocumentInfo);
    });
  });

  describe("getDocuments", () => {
    it("should send GET with query params", () => {
      const resource: DocumentResource = Object.assign(new DocumentResource(), {
        fields: "", orderBy: "createdDate desc", createDate: "2026-05-01",
        pageSize: 10, skip: 0, searchQuery: "", categoryId: "cat1", name: "test", metaTags: "", id: "",
      });

      service.getDocuments(resource).subscribe();

      const req = httpMock.expectOne((r) => r.url === "documents");
      expect(req.request.method).toBe("GET");
      expect(req.request.params.get("categoryId")).toBe("cat1");
      expect(req.request.params.get("name")).toBe("test");
      expect(req.request.params.get("pageSize")).toBe("10");
      expect(req.request.params.get("skip")).toBe("0");
      expect(req.request.params.get("createDateString")).toBeTruthy();
      req.flush([]);
    });
  });

  describe("getDocumentByExtension", () => {
    it("should send GET request to dashboard/extension", () => {
      const mockResponse = [{ name: "pdf" }, { name: "docx" }];
      service.getDocumentByExtension().subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne("dashboard/extension");
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });
  });

  describe("documentTransaction", () => {
    it("should send GET request to dashboard/transactions", () => {
      const mockResponse = [{ id: "1", name: "Doc1" }];
      service.documentTransaction().subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne("dashboard/transactions");
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });
  });
});
