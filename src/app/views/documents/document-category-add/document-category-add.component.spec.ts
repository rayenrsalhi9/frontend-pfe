import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BsModalRef } from "ngx-bootstrap/modal";

import { DocumentCategoryAddComponent } from "./document-category-add.component";

describe("DocumentCategoryAddComponent", () => {
  let component: DocumentCategoryAddComponent;
  let fixture: ComponentFixture<DocumentCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentCategoryAddComponent],
      providers: [BsModalRef],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
