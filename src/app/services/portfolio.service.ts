import { Injectable } from '@angular/core';

export interface MessageContent {
    type: 'text' | 'link' | 'photo-cluster';
    text?: string;
    url?: string;
    photos?: string[];
    wide?: boolean;
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
            "I'm Jana, a Computer & Systems Engineering student at Alexandria University, with a strong focus on software development and a growing interest in AI and machine learning.\n\nI enjoy building full-stack applications, working with Java and Spring Boot, and turning ideas into clean, practical user experiences.\n\nI've also been exploring machine learning and computer vision through hands-on projects, combining software engineering with AI to build interactive applications.\n\nI care about writing maintainable code, designing intuitive interfaces, and understanding how things work under the hood.",
            { type: 'photo-cluster', photos: ['jana1.jpeg', 'jana2.jpeg'] },
            'Want to explore my projects, skills, or experience?'
        ],

        skills: [
            "**Programming:**\nC++, Java, Python, JavaScript, TypeScript, HTML & CSS\n\n**Backend & Web:**\nSpring Boot, Angular, React, REST APIs, Tailwind CSS\n\n**AI & Computer Vision:**\nMachine Learning, Deep Learning, TensorFlow/Keras, OpenCV, MediaPipe, YOLO\n\n**Databases & Tools:**\nMySQL, PostgreSQL, Git, GitHub, Docker\n\n**Software Engineering:**\nObject-Oriented Programming, Design Patterns, API Development, Debugging\n\n**Soft Skills:**\nProblem Solving, Team Collaboration, Communication, Adaptability, Attention to Detail, Continuous Learning",
            "I'm continuously expanding this stack as I explore AI/ML alongside software engineering."
        ],

        projects: [
            "Here's a look at some of the projects I've built:",
            "**Gesture Object Vision**\nAn interactive computer-vision application that combines hand-gesture recognition and real-time object detection. Built with TensorFlow/Keras, MediaPipe, YOLO, OpenCV, FastAPI, and React, with a web dashboard for interacting with the models in real time.",
            {
                type: 'photo-cluster',
                photos: ['gesture.png', 'gesture2.png', 'gesture3.png'],
                url: 'https://github.com/janamirashed/gesture-obj-vision'
            },
            "**UNIverse \u2014 University Management System**\nA full-stack university management platform built with Spring Boot and Angular, featuring role-based workflows for students, faculty, and administrators, including course registration, grade management, and announcements.",
            {
                type: 'photo-cluster',
                photos: ['universe.png', 'universe1.png', 'universe2.png', 'universe3.png'],
                url: 'https://github.com/janamirashed/UNIverse'
            },
            "**Jaryn Mail \u2014 Webmail Application**\nA full-featured webmail application designed around clean architecture and software design patterns, supporting email composition, drafts, folders, search, filtering, and file attachments.",
            {
                type: 'photo-cluster',
                photos: ['jaryn.png', 'jaryn1.png', 'jaryn2.png', 'jaryn3.png'],
                url: 'https://github.com/janamirashed/email-app'
            },
            "**Paint Web App**\nAn interactive graphics application with custom drawing tools, shape transformations, undo/redo functionality, and JSON/XML project export.",
            {
                type: 'photo-cluster',
                photos: ['paint.png', 'paint1.png'],
                wide: true,
                url: 'https://github.com/janamirashed/paint-app'
            },
            "**Producer-Consumer Simulator**\nAn interactive visualization of the classic Producer-Consumer concurrency problem, with real-time process visualization and controls for experimenting with concurrent execution.",
            {
                type: 'photo-cluster',
                photos: ['prod-cons.png'],
                wide: true,
                url: 'https://github.com/janamirashed/producer-consumer-app'
            },
            "These are just some highlights. Tap any project above to browse its gallery and source code, or check out more of my work on GitHub.",
            { type: 'link', text: 'View more projects on GitHub', url: 'https://github.com/janamirashed?tab=repositories' }
        ],

        experience: [
            "Here's a snapshot of my academic journey and background 🎓",
            "**Academic Background & Certifications:**\n\n🏛️ **Alexandria University**: B.Sc. in Computer Science and Engineering (CGPA: 3.73)\n\n☕ **IBM Java Developer:** Intensive training covering core Java, Spring Framework, Hibernate, RESTful APIs, Docker, and CI/CD practices.\n\n☁️ **AWS Cloud Foundations:** Core cloud infrastructure, EC2, S3, RDS, IAM security, and serverless compute.",
            "**What I bring to a team:**\nA strong foundation in clean architecture, hands-on experience with design patterns, and an eagerness to solve complex engineering challenges collaboratively.",
            "I'm always excited to take on new software engineering opportunities and collaborations! ✨"
        ],

        contact: [
            "I'd love to hear from you! 💌",
            "Whether you're reaching out about an opportunity, collaboration, my projects, or just want to talk tech, feel free to get in touch.\n\n**Email:** [janarashed23010359@gmail.com](mailto:janarashed23010359@gmail.com)\n**Phone:** [+20 115 190 0187](tel:+201151900187)\n**Location:** Alexandria, Egypt",
            { type: 'link', text: 'LinkedIn: Jana Rashed', url: 'https://linkedin.com/in/jana-rashed' },
            { type: 'link', text: 'GitHub: janamirashed', url: 'https://github.com/janamirashed' },
            "Thanks for stopping by! I look forward to connecting! 😊"
        ],

        fun: [
            'A few things about me ✨:',
            "I like turning ideas into things you can actually interact with, especially projects involving cameras, AI, and web interfaces 📸\n\nI enjoy figuring out why something works, not just making it work.\n\nI'm particularly interested in the intersection of software engineering and AI, so my projects often combine both.\n\nI also have a soft spot for clean, modern interfaces, I like when something is technically solid and pleasant to use.\n\nAnd yes, I'll probably end up experimenting with a new technology just because I was curious about how it works ☕",
            'What would you like to explore? 🚀'
        ],

        default: [
            "Thanks for reaching out! 👋",
            "I can help answer questions about my work and experience. Here are a few things you can explore:\n\n• **About me:** My background, studies, and what I love building\n• **Skills:** Tech stack, Spring Boot, Angular, and cloud tools\n• **Projects:** Featured applications with photos and GitHub repos\n• **Contact:** Direct email, phone, LinkedIn, and GitHub links",
            "Feel free to tap one of the quick replies below or type whatever is on your mind!"
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
                "Of course! What would you like to know?",
                "I can tell you more about:\n\n• **My Projects** — what I've built and the technologies behind them\n• **My Skills** — the tools and technologies I work with\n• **About Me** — my interests and what I enjoy building\n• **Getting in Touch** — ways to connect with me",
                "Pick a topic and let's dive in."
            ];
        }

        return this.responses['default'];
    }
}
