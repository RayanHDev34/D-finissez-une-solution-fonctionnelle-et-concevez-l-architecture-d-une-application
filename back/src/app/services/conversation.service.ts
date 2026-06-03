import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private readonly apiUrl = 'http://localhost:8081/api/conversations';

  private customerConversationsSubject = new BehaviorSubject<Conversation[]>([]);
  customerConversations$ = this.customerConversationsSubject.asObservable();

  private supportConversationsSubject = new BehaviorSubject<Conversation[]>([]);
  supportConversations$ = this.supportConversationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  findByCustomer(customerId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(
      `${this.apiUrl}/customer/${customerId}`
    ).pipe(
      tap(conversations => {
        this.customerConversationsSubject.next(conversations);
      })
    );
  }

  findForSupport(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(
      `${this.apiUrl}/support`
    ).pipe(
      tap(conversations => {
        this.supportConversationsSubject.next(conversations);
      })
    );
  }

  createConversation(customerId: number): Observable<Conversation> {
    return this.http.post<Conversation>(
      `${this.apiUrl}/customer/${customerId}`,
      {}
    ).pipe(
      tap(newConversation => {
        const current = this.customerConversationsSubject.value;

        this.customerConversationsSubject.next([
          newConversation,
          ...current
        ]);
      })
    );
  }

  assignAgent(conversationId: number, agentId: number): Observable<Conversation> {
    return this.http.put<Conversation>(
      `${this.apiUrl}/${conversationId}/assign/${agentId}`,
      {}
    ).pipe(
      tap(updatedConversation => {
        this.updateSupportConversation(updatedConversation);
      })
    );
  }

  closeConversation(conversationId: number): Observable<Conversation> {
    return this.http.put<Conversation>(
      `${this.apiUrl}/${conversationId}/close`,
      {}
    ).pipe(
      tap(updatedConversation => {
        this.updateSupportConversation(updatedConversation);
        this.updateCustomerConversation(updatedConversation);
      })
    );
  }

  findById(conversationId: number): Observable<Conversation> {
    return this.http.get<Conversation>(
      `${this.apiUrl}/${conversationId}`
    );
  }

  private updateCustomerConversation(updatedConversation: Conversation): void {
    const current = this.customerConversationsSubject.value;

    const updated = current.map(conversation =>
      conversation.conversationId === updatedConversation.conversationId
        ? updatedConversation
        : conversation
    );

    this.customerConversationsSubject.next(updated);
  }

  private updateSupportConversation(updatedConversation: Conversation): void {
    const current = this.supportConversationsSubject.value;

    const updated = current.map(conversation =>
      conversation.conversationId === updatedConversation.conversationId
        ? updatedConversation
        : conversation
    );

    this.supportConversationsSubject.next(updated);
  }
}