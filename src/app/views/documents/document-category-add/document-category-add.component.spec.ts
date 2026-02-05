import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCategoryAddComponent } from './document-category-add.component';

describe('DocumentCategoryAddComponent', () => {
  let component: DocumentCategoryAddComponent;
  let fixture: ComponentFixture<DocumentCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCategoryAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
