import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription, catchError, finalize, of, tap } from 'rxjs';

import { Conversation } from '../../../models/conversation.model';
import { ConversationService } from '../../../services/conversation.service';
import { ConversationSocketService } from '../../../services/conversation-socket.service';
import { AuthService } from '../../../services/auth.service';
import { AppHeaderComponent } from '../../../components/app-header/app-header.component';

@Component({
  selector: 'app-client-support',
  standalone: true,
  imports: [CommonModule, RouterModule, AppHeaderComponent],
  templateUrl: './client-support.component.html',
  styleUrl: './client-support.component.scss'
})
export class ClientSupportComponent implements OnInit, OnDestroy {
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  conversations$ = this.conversationsSubject.asObservable();

  isLoading = true;
  errorMessage = '';

  private socketSubscription?: Subscription;
  private currentCustomerId!: number;

  constructor(
    private conversationService: ConversationService,
    private conversationSocketService: ConversationSocketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user || user.role !== 'CUSTOMER') {
      this.router.navigate(['/login']);
      return;
    }

    this.currentCustomerId = user.id;

    this.loadConversations(user.id);
    this.listenToConversationUpdates();
  }

  ngOnDestroy(): void {
    this.socketSubscription?.unsubscribe();
    this.conversationSocketService.disconnect();
  }

  startConversation(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.conversationService.createConversation(user.id)
      .pipe(
        tap(conversation => {
          this.upsertConversation(conversation);

          this.router.navigate([
            '/client/support',
            conversation.conversationId
          ]);
        }),
        catchError(error => {
          console.error('Erreur création conversation', error);
          this.errorMessage = 'Impossible de créer une conversation.';
          return of(null);
        })
      )
      .subscribe();
  }

  private loadConversations(customerId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.conversationService.findByCustomer(customerId)
      .pipe(
        tap(conversations => {
          console.log('Conversations client chargées', conversations);
          this.conversationsSubject.next(conversations);
        }),
        catchError(error => {
          console.error('Erreur chargement conversations client', error);
          this.errorMessage = 'Impossible de charger vos conversations.';
          this.conversationsSubject.next([]);
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  private listenToConversationUpdates(): void {
    this.conversationSocketService.connect();

    this.socketSubscription = this.conversationSocketService.conversation$
      .pipe(
        tap(conversation => {
          console.log('Conversation reçue côté client via WebSocket', conversation);
          this.upsertConversation(conversation);
        })
      )
      .subscribe();
  }

  private upsertConversation(updatedConversation: Conversation): void {
    if (!this.isMyConversation(updatedConversation)) {
      return;
    }

    const currentConversations = this.conversationsSubject.value;

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

  private isMyConversation(conversation: Conversation): boolean {
    return conversation.customer?.id === this.currentCustomerId
      || conversation.customer?.id === this.currentCustomerId;
  }
}