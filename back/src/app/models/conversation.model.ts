import { User } from "./utilisateur.model";
export type ConversationStatus = 'NEW' | 'IN_PROGRESS' | 'CLOSED';

export interface Conversation {
  conversationId: number;
  customer: User;
  agent?: User;
  status: ConversationStatus;
  createdAt: string;
  closedAt?: string;
}
