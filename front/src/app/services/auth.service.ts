import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'current_user';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === 'client@test.com' && password === 'password') {
      const user: User = {
        id: 1,
        nom: 'Test',
        prenom: 'Client',
        email: 'client@test.com',
        role: 'CUSTOMER'
      };
      
      this.saveUser(user);
      this.router.navigate(['/client/support']);
      return true;
    }

    if (normalizedEmail === 'support@test.com' && password === 'password') {
      const user: User = {
        id: 2,
        nom: 'Test',
        prenom: 'Support',
        email: 'support@test.com',
        role: 'SUPPORT_AGENT'
      };

      this.saveUser(user);
      this.router.navigate(['/support/conversations']);
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as User;
    } catch {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isCustomer(): boolean {
    return this.hasRole('CUSTOMER');
  }

  isSupportAgent(): boolean {
    return this.hasRole('SUPPORT_AGENT');
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}