import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  finalize,
  of,
  shareReplay,
  takeUntil,
  tap
} from 'rxjs';

import { Conversation } from '../../../models/conversation.model';
import { Message } from '../../../models/message.model';
import { ConversationService } from '../../../services/conversation.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';
import { MessageSocketService } from '../../../services/message-socket.service';

@Component({
  selector: 'app-support-chat-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './support-chat-detail.component.html',
  styleUrl: './support-chat-detail.component.scss'
})
export class SupportChatDetailComponent implements OnInit, OnDestroy {
  conversation$!: Observable<Conversation | null>;

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  newMessage = '';
  isLoadingMessages = true;
  errorMessage = '';

  private conversationId!: number;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private messageSocketService: MessageSocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.conversationId = Number(this.route.snapshot.paramMap.get('id'));

    this.initConversation();
    this.loadMessages(this.conversationId);
    this.listenToMessages(this.conversationId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.messageSocketService.disconnect();
  }

  sendMessage(conversation: Conversation): void {
    const user = this.authService.getCurrentUser();
    const content = this.newMessage.trim();

    if (!user || !content || conversation.status === 'CLOSED') {
      return;
    }

    this.messageService
      .sendMessage(conversation.conversationId, user.id, content)
      .pipe(
        tap(() => {
          this.newMessage = '';
        }),
        catchError(error => {
          console.error('Erreur envoi message support', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  closeConversation(conversation: Conversation): void {
    this.conversationService.closeConversation(conversation.conversationId)
      .pipe(
        tap(() => {
          this.initConversation();
        }),
        catchError(error => {
          console.error('Erreur fermeture conversation', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initConversation(): void {
    this.conversation$ = this.conversationService.findById(this.conversationId).pipe(
      catchError(error => {
        console.error('Conversation introuvable', error);
        this.router.navigate(['/support/conversations']);
        return of(null);
      }),
      shareReplay(1)
    );
  }

  private loadMessages(conversationId: number): void {
    this.isLoadingMessages = true;
    this.errorMessage = '';

    this.messageService.findByConversation(conversationId)
      .pipe(
        tap(messages => {
          console.log('Messages chargés :', messages);
          this.messagesSubject.next(messages);
        }),
        catchError(error => {
          console.error('Erreur chargement messages', error);
          this.errorMessage = 'Impossible de charger les messages.';
          this.messagesSubject.next([]);
          return of([]);
        }),
        finalize(() => {
          this.isLoadingMessages = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private listenToMessages(conversationId: number): void {
    this.messageSocketService.connect(conversationId);

    this.messageSocketService.messages$
      .pipe(
        tap(messages => {
          console.log('Chat complet reçu via WebSocket :', messages);
          this.messagesSubject.next(messages);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}