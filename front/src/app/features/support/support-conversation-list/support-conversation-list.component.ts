import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription, catchError, finalize, of, tap } from 'rxjs';

import { AppHeaderComponent } from '../../../components/app-header/app-header.component';
import { Conversation } from '../../../models/conversation.model';
import { ConversationService } from '../../../services/conversation.service';
import { ConversationSocketService } from '../../../services/conversation-socket.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-support-conversation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AppHeaderComponent],
  templateUrl: './support-conversation-list.component.html',
  styleUrl: './support-conversation-list.component.scss'
})
export class SupportConversationListComponent implements OnInit, OnDestroy {
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  conversations$ = this.conversationsSubject.asObservable();
  currentAgentId!: number;
  isLoading = true;
  errorMessage = '';

  private socketSubscription?: Subscription;

  constructor(
    private conversationService: ConversationService,
    private conversationSocketService: ConversationSocketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const user = this.authService.getCurrentUser();

  if (!user || user.role !== 'SUPPORT_AGENT') {
    this.router.navigate(['/login']);
    return;
  }

  this.currentAgentId = this.getUserId(user)!;

  console.log('Agent connecté ID :', this.currentAgentId);

  this.loadConversations();
  this.listenToConversationUpdates();
}

  ngOnDestroy(): void {
    this.socketSubscription?.unsubscribe();
    this.conversationSocketService.disconnect();
  }
private loadConversations(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.conversationService.findForSupport().pipe(
    tap(conversations => {
      console.log('Toutes les conversations support :', conversations);

      const visibleConversations = conversations.filter(conversation =>
        this.isConversationVisible(conversation)
      );

      console.log('Conversations visibles pour moi :', visibleConversations);

      this.conversationsSubject.next(visibleConversations);
    }),
    catchError(error => {
      console.error('Erreur chargement conversations support', error);
      this.errorMessage = 'Impossible de charger les conversations.';
      this.conversationsSubject.next([]);
      return of([]);
    }),
    finalize(() => {
      this.isLoading = false;
    })
  ).subscribe();
}
  private listenToConversationUpdates(): void {
    this.conversationSocketService.connect();

    this.socketSubscription = this.conversationSocketService.conversation$.pipe(
      tap(conversation => {
        console.log('Conversation reçue via WebSocket', conversation);
        this.upsertConversation(conversation);
      })
    ).subscribe();
  }

  private upsertConversation(updatedConversation: Conversation): void {
  const currentConversations = this.conversationsSubject.value;

  const isVisible =
    !updatedConversation.agent ||
    updatedConversation.agent.id === this.currentAgentId;

  if (!isVisible) {
    const filteredConversations = currentConversations.filter(
      conversation =>
        conversation.conversationId !== updatedConversation.conversationId
    );

    this.conversationsSubject.next(filteredConversations);
    return;
  }

  const exists = currentConversations.some(
    conversation => conversation.conversationId === updatedConversation.conversationId
  );

  if (!exists) {
    this.conversationsSubject.next([
      updatedConversation,
      ...currentConversations
    ]);
    return;
  }

  const updatedConversations = currentConversations.map(conversation =>
    conversation.conversationId === updatedConversation.conversationId
      ? updatedConversation
      : conversation
  );

  this.conversationsSubject.next(updatedConversations);
}
  takeConversation(conversation: Conversation): void {
  const user = this.authService.getCurrentUser();

  if (!user) {
    this.router.navigate(['/login']);
    return;
  }

  this.conversationService
    .assignAgent(conversation.conversationId, user.id)
    .pipe(
      tap(updatedConversation => {
        this.upsertConversation(updatedConversation);

        this.router.navigate([
          '/support/conversations',
          updatedConversation.conversationId
        ]);
      }),
      catchError(error => {
        console.error('Erreur assignation conversation', error);
        this.errorMessage = 'Impossible de prendre cette conversation.';
        return of(null);
      })
    )
    .subscribe();
}
private getUserId(user: any): number | undefined {
  return user?.id ?? user?.utilisateurId;
}

private isConversationVisible(conversation: Conversation): boolean {
  const agentId = this.getUserId(conversation.agent);

  return !conversation.agent || agentId === this.currentAgentId;
}
}