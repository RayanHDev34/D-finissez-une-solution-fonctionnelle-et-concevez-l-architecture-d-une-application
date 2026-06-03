import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly apiUrl = 'http://localhost:8081/api/messages';

  constructor(private http: HttpClient) {}

  findByConversation(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}/conversation/${conversationId}`
    );
  }

  sendMessage(
    conversationId: number,
    senderId: number,
    content: string
  ): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, {
      conversationId,
      senderId,
      content
    });
  }
}