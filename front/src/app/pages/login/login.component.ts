import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = '';

    const success = this.authService.login(this.email, this.password);

    if (!success) {
      this.errorMessage = 'Email ou mot de passe incorrect.';
    }
  }

  loginAsClient(): void {
    this.email = 'client@test.com';
    this.password = 'password';
    this.onSubmit();
  }

  loginAsSupport(): void {
    this.email = 'support@test.com';
    this.password = 'password';
    this.onSubmit();
  }
}