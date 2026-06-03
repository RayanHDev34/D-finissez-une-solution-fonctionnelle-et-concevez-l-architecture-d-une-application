import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'client/support',
    loadComponent: () =>
      import('./features/client/client-support/client-support.component')
        .then(m => m.ClientSupportComponent)
  },
  {
    path: 'client/support/:id',
    loadComponent: () =>
      import('./features/client/client-chat-detail/client-chat-detail.component')
        .then(m => m.ClientChatDetailComponent)
  },

  {
    path: 'support/conversations',
    loadComponent: () =>
      import('./features/support/support-conversation-list/support-conversation-list.component')
        .then(m => m.SupportConversationListComponent)
  },
  {
    path: 'support/conversations/:id',
    loadComponent: () =>
      import('./features/support/support-chat-detail/support-chat-detail.component')
        .then(m => m.SupportChatDetailComponent)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];