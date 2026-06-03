import { User } from "./utilisateur.model";

export interface Message {
  id: number;
  conversationId: number;
  sender: User;
  content: string;
  sentAt: string;
  read: boolean;
}