import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportChatDetailComponent } from './support-chat-detail.component';

describe('SupportChatDetailComponent', () => {
  let component: SupportChatDetailComponent;
  let fixture: ComponentFixture<SupportChatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportChatDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportChatDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
