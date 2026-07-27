import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
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
    showNotification1 = false;
    showNotification2 = false;

    navPills = [
        { label: 'Me', message: 'Tell me about yourself', class: 'pill-me', icon: 'smile' },
        { label: 'Projects', message: 'Show me your projects', class: 'pill-projects', icon: 'briefcase' },
        { label: 'Skills', message: 'What are your skills?', class: 'pill-skills', icon: 'layers' },
        { label: 'Fun', message: 'Tell me something fun', class: 'pill-fun', icon: 'party' },
        { label: 'Contact', message: 'How can I contact you?', class: 'pill-contact', icon: 'search' }
    ];

    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Show 1st notification banner shortly after landing
        setTimeout(() => {
            this.showNotification1 = true;
            this.cdr.detectChanges();
        }, 400);

        // Show 2nd notification banner 500ms after
        setTimeout(() => {
            this.showNotification2 = true;
            this.cdr.detectChanges();
        }, 900);

        // Auto hide after 12 seconds if not clicked
        setTimeout(() => {
            this.showNotification1 = false;
            this.showNotification2 = false;
            this.cdr.detectChanges();
        }, 12000);
    }

    dismissNotification(num: number): void {
        if (num === 1) this.showNotification1 = false;
        if (num === 2) this.showNotification2 = false;
        this.cdr.detectChanges();
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
