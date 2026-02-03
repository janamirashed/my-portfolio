import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'chat', component: ChatComponent },
    { path: '**', redirectTo: '' }
];
