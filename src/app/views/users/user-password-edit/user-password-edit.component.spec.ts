import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordEditComponent } from './user-password-edit.component';

describe('UserPasswordEditComponent', () => {
  let component: UserPasswordEditComponent;
  let fixture: ComponentFixture<UserPasswordEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPasswordEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
