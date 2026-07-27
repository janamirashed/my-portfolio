import { Injectable } from '@angular/core';

export interface MessageContent {
    type: 'text' | 'link' | 'photo-cluster';
    text?: string;
    url?: string;
    photos?: string[];
}

export type Message = string | MessageContent;

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    readonly name = 'Jana Mohamed Rashed';
    readonly title = 'Software Engineer';

    private responses: Record<string, Message[]> = {
        about: [
            'Hey there! :)',
            "I'm Jana, a Computer Science and Engineering student at Alexandria University.",
            'I specialize in **full-stack web development** using Spring Boot & Angular.',
            "I'm experienced in building scalable applications with clean architecture and design patterns!",
            "I'm passionate about collaborative development and creating user-centric solutions!",
            'Currently living in Alexandria, Egypt'
        ],

        skills: [
            "Here's my tech stack:",
            '**Programming Languages:**\nC/C++, Java, HTML, CSS, JavaScript, TypeScript',
            '**Frameworks:**\nSpring Boot, Angular, Tailwind CSS',
            '**Databases:**\nMySQL',
            '**Technical Skills:**\n• Object-oriented programming\n• Design patterns (Command, Strategy, Factory, Builder, Observer, Proxy)\n• Git/GitHub version control\n• API development & debugging\n• Agile practices',
            '**Certifications:**\n• IBM Java Developer - Full-stack Java development\n• AWS Cloud Foundations - EC2, S3, RDS, Lambda'
        ],

        projects: [
            'Here are my featured projects:',
            '**UNIverse**\nA full-stack University Management System built with Spring Boot and Angular. Features role-based modules for students, faculty, and administrators.',
            {
                type: 'photo-cluster',
                photos: ['universe3.png', 'universe2.png', 'universe1.png', 'universe.png'],
                url: 'https://github.com/esraaabdelhaye/UNIverse'
            },
            '**Jaryn Mail Web App**\nA full-stack Email Application with send, receive, drafts, and attachments. Built with strong focus on design patterns.',
            {
                type: 'photo-cluster',
                photos: ['jaryn2.png', 'jaryn1.png', 'jaryn.png'],
                url: 'https://github.com/janamirashed/email-app'
            },
            '**Paint Web App**\nInteractive canvas application with shape tools, selection & transformation controls, undo/redo history, and JSON/XML exports.',
            {
                type: 'photo-cluster',
                photos: ['paint.png'],
                url: 'https://github.com/janamirashed/paint-app'
            },
            '**Producer-Consumer App**\nInteractive simulation of the Producer-Consumer problem with drag-and-drop canvas and real-time visualization.',
            {
                type: 'photo-cluster',
                photos: ['prod-cons.png'],
                url: 'https://github.com/janamirashed/producer-consumer-app'
            }
        ],

        experience: [
            'My journey so far:',
            '**Education**\nBachelor of Computer Science and Engineering\nAlexandria University | CGPA: 3.73',
            '**IBM Java Developer**\nComprehensive professional certificate covering core programming, Spring Framework, Hibernate, RESTful APIs, Docker, and CI/CD practices.',
            '**AWS Cloud Foundations**\nCore services (EC2, S3, RDS, Lambda), cloud architecture principles, security, IAM, and cost management.',
            '**What I bring:**\n• Strong foundation in clean architecture\n• Experience with design patterns\n• Collaborative team player\n• Problem-solving mindset',
            'Open to exciting opportunities!'
        ],

        contact: [
            "Let's connect!",
            { type: 'link', text: 'janarashed23010359@gmail.com', url: 'mailto:janarashed23010359@gmail.com' },
            { type: 'link', text: 'LinkedIn Profile', url: 'https://linkedin.com/in/jana-rashed' },
            { type: 'link', text: 'GitHub Profile', url: 'https://github.com/janamirashed' },
            '**Phone:** +20 1151900187',
            "Feel free to reach out anytime! I'm always happy to chat about tech, projects, or potential collaborations."
        ],

        fun: [
            'Some things about me:',
            'I love exploring new technologies and design patterns',
            'Problem-solving is my favorite challenge',
            'I thrive in collaborative team environments',
            'Always striving for clean, scalable code',
            'Passionate about creating user-centric solutions',
            'Currently diving deeper into cloud technologies',
            'What would you like to know more about?'
        ],

        default: [
            'That\'s interesting! Feel free to ask me about:',
            '• Who I am and my background\n• My tech stack and skills\n• Projects I\'ve built\n• My education and certifications\n• How to get in touch',
            'What would you like to know?'
        ]
    };

    getResponse(message: string): Message[] {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('project') || lowerMessage.includes('built') || lowerMessage.includes('portfolio')) {
            return this.responses['projects'];
        }
        if (lowerMessage.includes('about') || lowerMessage.includes('yourself') || lowerMessage.includes('who')) {
            return this.responses['about'];
        }
        if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack') || lowerMessage.includes('work with')) {
            return this.responses['skills'];
        }
        if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('career') || lowerMessage.includes('job')) {
            return this.responses['experience'];
        }
        if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('connect') || lowerMessage.includes('hire')) {
            return this.responses['contact'];
        }
        if (lowerMessage.includes('fun') || lowerMessage.includes('hobby') || lowerMessage.includes('free time') || lowerMessage.includes('interest')) {
            return this.responses['fun'];
        }
        if (lowerMessage.includes('more') || lowerMessage.includes('tell me')) {
            return [
                'What specifically would you like to know more about?',
                '• My projects and work\n• Technologies I use\n• My background\n• How to connect',
                'Just ask!'
            ];
        }

        return this.responses['default'];
    }
}
