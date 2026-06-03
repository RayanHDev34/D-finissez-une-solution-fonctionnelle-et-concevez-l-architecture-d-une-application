import 'zone.js';
(window as any).global = window;
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
