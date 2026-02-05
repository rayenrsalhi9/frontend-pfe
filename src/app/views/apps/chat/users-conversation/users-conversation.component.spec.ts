import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersConversationComponent } from './users-conversation.component';

describe('UsersConversationComponent', () => {
  let component: UsersConversationComponent;
  let fixture: ComponentFixture<UsersConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersConversationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
