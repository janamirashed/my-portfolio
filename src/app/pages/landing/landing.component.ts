import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, AfterViewInit {
    userInput = '';
    showNotification = false;

    navPills = [
        { label: 'Me', message: 'Tell me about yourself', class: 'pill-me', icon: 'smile' },
        { label: 'Projects', message: 'Show me your projects', class: 'pill-projects', icon: 'briefcase' },
        { label: 'Skills', message: 'What are your skills?', class: 'pill-skills', icon: 'layers' },
        { label: 'Fun', message: 'Tell me something fun', class: 'pill-fun', icon: 'party' },
        { label: 'Contact', message: 'How can I contact you?', class: 'pill-contact', icon: 'search' }
    ];

    constructor(private router: Router) { }

    ngOnInit(): void {
        // Show iOS notification popup shortly after website opens
        setTimeout(() => {
            this.showNotification = true;
            setTimeout(() => {
                this.showNotification = false;
            }, 6500);
        }, 800);
    }

    dismissNotification(): void {
        this.showNotification = false;
    }

    ngAfterViewInit(): void {
        // Load the fluid simulation script
        this.loadFluidSimulation();
    }

    private loadFluidSimulation(): void {
        const script = document.createElement('script');
        script.src = 'assets/fluid.js';
        script.async = true;
        script.onload = () => {
            console.log('Fluid script loaded');
            if ((window as any).fluidSimulation) {
                console.log('Calling fluidSimulation()');
                (window as any).fluidSimulation();
            } else {
                console.error('window.fluidSimulation is undefined');
            }
        };
        script.onerror = (e) => console.error('Error loading fluid script', e);
        document.body.appendChild(script);
    }

    navigateToChat(message: string): void {
        this.router.navigate(['/chat'], { queryParams: { message } });
    }

    onSubmit(): void {
        if (this.userInput.trim()) {
            this.navigateToChat(this.userInput.trim());
            this.userInput = '';
        }
    }
}
