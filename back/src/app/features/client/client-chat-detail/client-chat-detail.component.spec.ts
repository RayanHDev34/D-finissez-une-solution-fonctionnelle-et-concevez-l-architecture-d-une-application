import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChatDetailComponent } from './client-chat-detail.component';

describe('ClientChatDetailComponent', () => {
  let component: ClientChatDetailComponent;
  let fixture: ComponentFixture<ClientChatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientChatDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientChatDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
