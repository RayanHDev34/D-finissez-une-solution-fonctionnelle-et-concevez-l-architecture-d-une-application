export type UserRole = 'CUSTOMER' | 'SUPPORT_AGENT';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
}