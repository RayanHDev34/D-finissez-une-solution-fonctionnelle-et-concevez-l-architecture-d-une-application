import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationSocketService {
  private stompClient?: Client;

  private conversationSubject = new Subject<Conversation>();
  conversation$ = this.conversationSubject.asObservable();

  connect(): void {
    if (this.stompClient?.active) {
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      reconnectDelay: 5000,
      debug: message => console.log('[WebSocket]', message)
    });

    this.stompClient.onConnect = () => {
      console.log('WebSocket connecté');

      this.stompClient?.subscribe('/topic/support/conversations', (message: IMessage) => {
        const conversation: Conversation = JSON.parse(message.body);
        this.conversationSubject.next(conversation);
      });
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient?.deactivate();
  }
}