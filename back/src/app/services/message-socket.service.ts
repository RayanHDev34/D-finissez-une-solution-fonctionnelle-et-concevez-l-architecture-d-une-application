import { Injectable, NgZone } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageSocketService {
  private stompClient?: Client;

  private messagesSubject = new Subject<Message[]>();
  messages$ = this.messagesSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  connect(conversationId: number): void {
    if (this.stompClient?.active) {
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      reconnectDelay: 5000,
      debug: message => console.log('[Message WebSocket]', message)
    });

    this.stompClient.onConnect = () => {
      const topic = `/topic/conversations/${conversationId}/messages`;

      console.log('Abonnement au topic :', topic);

      this.stompClient?.subscribe(topic, (message: IMessage) => {
        const messages: Message[] = JSON.parse(message.body);

        console.log('Chat complet reçu via WebSocket :', messages);

        this.ngZone.run(() => {
          this.messagesSubject.next(messages);
        });
      });
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    this.stompClient = undefined;
  }
}