import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { BsModalRef } from "ngx-bootstrap/modal";

import { ArticlesCategoryAddComponent } from "./articles-category-add.component";

describe("ArticlesCategoryAddComponent", () => {
  let component: ArticlesCategoryAddComponent;
  let fixture: ComponentFixture<ArticlesCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      declarations: [ArticlesCategoryAddComponent],
      providers: [BsModalRef],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
