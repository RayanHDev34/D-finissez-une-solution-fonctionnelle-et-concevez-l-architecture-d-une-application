import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportConversationListComponent } from './support-conversation-list.component';

describe('SupportConversationListComponent', () => {
  let component: SupportConversationListComponent;
  let fixture: ComponentFixture<SupportConversationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportConversationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportConversationListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
