import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesCategoryAddComponent } from './articles-category-add.component';

describe('ArticlesCategoryAddComponent', () => {
  let component: ArticlesCategoryAddComponent;
  let fixture: ComponentFixture<ArticlesCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesCategoryAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
