import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService, Message, MessageContent } from '../../services/portfolio.service';

interface ChatMessage {
    text: string;
    type: 'sent' | 'received';
    time: string;
    status?: 'delivered' | 'read';
    isLink?: boolean;
    linkUrl?: string;
    isPhotoCluster?: boolean;
    photos?: string[];
    photoUrl?: string;
    reaction?: string;
    showPicker?: boolean;
}

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    messages: ChatMessage[] = [];
    userInput = '';
    isTyping = false;
    showPhonePopup = false;
    showSuggestions = false;
    showScrollBtn = false;

    // Lightbox state
    showLightbox = false;
    lightboxImage = '';

    // Avatar preview modal state
    showAvatarModal = false;

    // iOS Menu state
    showIosMenu = false;
    menuImage = '';
    menuRepoUrl: string | null = null;

    // iOS Photos Viewer state
    showPhotoViewer = false;
    activePhotoCluster: string[] = [];
    activePhotoIndex = 0;
    activeRepoUrl: string | null = null;

    // Per-photo reactions map (photo URL -> emoji string)
    photoReactions: Record<string, string> = {};
    showViewerReactionPicker = false;

    quickReplies = [
        { label: 'More', message: 'Tell me more' },
        { label: 'Projects', message: 'Show projects' },
        { label: 'Skills', message: 'Your skills' },
        { label: 'Contact', message: 'Contact info' }
    ];

    isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    availableReactionsWithIcons = [
        { emoji: '❤️', icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/2764-fe0f.png' },
        { emoji: '👍', icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/1f44d.png' },
        { emoji: '👎', icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/1f44e.png' },
        { emoji: '😂', icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/1f602.png' },
        { emoji: '‼️', icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/203c-fe0f.png' },
        { emoji: '❓', icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/2753.png' }
    ];

    private isAtBottom = true;

    private shouldScroll = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private portfolioService: PortfolioService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) { }

    getReactionIcon(emoji: string): string {
        const found = this.availableReactionsWithIcons.find(r => r.emoji === emoji);
        return found ? found.icon : 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/2764-fe0f.png';
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const initialMessage = params['message'];
            if (initialMessage) {
                this.addMessage(initialMessage, 'sent');
                this.showTypingThenRespond(initialMessage);
            }
        });
    }

    ngAfterViewChecked(): void {
        // Scroll handled directly in methods with timeouts
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    addMessage(text: string, type: 'sent' | 'received', options?: Partial<ChatMessage>): void {
        const time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const message: ChatMessage = {
            text: this.formatText(text),
            type,
            time,
            status: type === 'sent' ? 'delivered' : undefined,
            ...options
        };

        this.messages = [...this.messages, message];
        this.cdr.detectChanges();

        // Force scroll down when new message happens
        setTimeout(() => this.scrollToBottom(), 50);
    }

    formatText(text: string): string {
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        const emojiMap: Record<string, string> = {
            '❤️': '2764-fe0f',
            '👍': '1f44d',
            '👎': '1f44e',
            '😂': '1f602',
            '‼️': '203c-fe0f',
            '❓': '2753',
            '👋': '1f44b',
            '🚀': '1f680',
            '✨': '2728',
            '💻': '1f4bb',
            '🎨': '1f3a8',
            '💌': '1f48c',
            '😊': '1f60a',
            '🔥': '1f525',
            '🎉': '1f389',
            '😁': '1f601',
            '😃': '1f603',
            '😀': '1f600',
            '😍': '1f60d',
            '🤔': '1f914',
            '😎': '1f60e',
            '🙌': '1f64c',
            '💼': '1f4bc',
            '📚': '1f4da',
            '🎓': '1f393',
            '☕': '2615'
        };

        for (const [emoji, code] of Object.entries(emojiMap)) {
            const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${code}.png`;
            const imgTag = `<img src="${url}" class="apple-emoji-inline" alt="${emoji}" />`;
            formatted = formatted.split(emoji).join(imgTag);
        }

        return formatted;
    }

    showTypingThenRespond(userMessage: string): void {
        this.showSuggestions = false;

        // Initial delay before typing helper appears
        setTimeout(() => {
            this.isTyping = true;
            this.cdr.detectChanges();
            this.scrollToBottom();

            // Typing duration
            setTimeout(() => {
                const responses = this.portfolioService.getResponse(userMessage);
                this.sendMessagesSequentially(responses);
            }, 800 + Math.random() * 400);
        }, 300);
    }

    sendMessagesSequentially(messages: Message[]): void {
        let index = 0;

        const sendNext = () => {
            if (index >= messages.length) {
                // Mark all sent messages as read
                this.messages = this.messages.map(m => {
                    if (m.type === 'sent' && m.status === 'delivered') {
                        return { ...m, status: 'read' as const };
                    }
                    return m;
                });
                this.showSuggestions = true;
                this.cdr.detectChanges();
                this.scrollToBottom();
                return;
            }

            this.isTyping = false;
            const msg = messages[index];

            if (typeof msg === 'string') {
                this.addMessage(msg, 'received');
            } else {
                const content = msg as MessageContent;
                if (content.type === 'link') {
                    this.addMessage(content.text!, 'received', {
                        isLink: true,
                        linkUrl: content.url
                    });
                } else if (content.type === 'photo-cluster') {
                    const isExternalUrl = content.url?.startsWith('http://') || content.url?.startsWith('https://');
                    this.addMessage('', 'received', {
                        isPhotoCluster: true,
                        photos: content.photos,
                        photoUrl: !isExternalUrl ? content.url : undefined,
                        linkUrl: isExternalUrl ? content.url : undefined
                    });
                }
            }

            index++;

            if (index < messages.length) {
                // Pause before next message
                setTimeout(() => {
                    this.isTyping = true;
                    this.cdr.detectChanges();
                    this.scrollToBottom();

                    setTimeout(() => {
                        sendNext();
                    }, 500 + Math.random() * 400);
                }, 300);
            } else {
                sendNext();
            }
        };

        sendNext();
    }
    // ... skipped ...
    scrollToBottom(): void {
        if (this.messagesContainer) {
            // Force scroll to specific value to ensure it sticks
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
            this.showScrollBtn = false;
        }
    }

    sendMessage(): void {
        if (!this.userInput.trim()) return;

        this.addMessage(this.userInput, 'sent');
        const message = this.userInput;
        this.userInput = '';
        this.showTypingThenRespond(message);
    }

    onQuickReply(message: string): void {
        this.addMessage(message, 'sent');
        this.showTypingThenRespond(message);
    }

    openPhonePopup(): void {
        this.showPhonePopup = true;
    }

    closePhonePopup(): void {
        this.showPhonePopup = false;
    }

    openAvatarPreview(): void {
        this.showAvatarModal = true;
    }

    closeAvatarPreview(): void {
        this.showAvatarModal = false;
    }

    // iOS Menu methods
    openIosMenu(photo: string, url: string | null | undefined): void {
        this.menuImage = photo;
        this.menuRepoUrl = url || null;
        this.showIosMenu = true;
    }

    closeIosMenu(): void {
        this.showIosMenu = false;
    }

    openLightbox(): void {
        this.lightboxImage = this.menuImage;
        this.showLightbox = true;
        this.closeIosMenu();
    }

    closeLightbox(): void {
        this.showLightbox = false;
    }

    toggleReactionPicker(event: Event, message: ChatMessage): void {
        event.stopPropagation();

        // Close other pickers
        this.messages.forEach(m => {
            if (m !== message) m.showPicker = false;
        });

        message.showPicker = !message.showPicker;
    }

    react(event: Event, message: ChatMessage, reaction: string): void {
        event.stopPropagation();
        if (message.reaction === reaction) {
            message.reaction = undefined;
        } else {
            message.reaction = reaction;
        }
        message.showPicker = false;
    }

    @HostListener('document:click')
    closeAllPickers(): void {
        this.messages.forEach(m => m.showPicker = false);
    }

    openRepo(): void {
        if (this.menuRepoUrl) {
            window.open(this.menuRepoUrl, '_blank');
        }
        this.closeIosMenu();
    }

    getClusterClass(photosLength: number): string {
        if (photosLength === 1) return 'photo-cluster-1';
        if (photosLength === 2) return 'photo-cluster-2';
        if (photosLength === 3) return 'photo-cluster-3';
        return 'photo-cluster-4';
    }

    onScroll(event: Event): void {
        const element = event.target as HTMLElement;
        const atBottom = Math.abs((element.scrollHeight - element.scrollTop) - element.clientHeight) < 50;
        this.isAtBottom = atBottom;
        this.showScrollBtn = !atBottom;
    }

    // iOS Photos Viewer Methods
    openPhotoViewer(photos: string[] | string | undefined, startIndex: number = 0, repoUrl?: string | null): void {
        if (!photos) return;
        if (typeof photos === 'string') {
            this.activePhotoCluster = [photos];
        } else {
            this.activePhotoCluster = photos;
        }
        this.activePhotoIndex = startIndex >= 0 && startIndex < this.activePhotoCluster.length ? startIndex : 0;
        this.activeRepoUrl = repoUrl || null;
        this.showPhotoViewer = true;
    }

    closePhotoViewer(): void {
        this.showPhotoViewer = false;
        this.showViewerReactionPicker = false;
    }

    nextPhoto(): void {
        if (this.activePhotoIndex < this.activePhotoCluster.length - 1) {
            this.activePhotoIndex++;
            this.showViewerReactionPicker = false;
        }
    }

    prevPhoto(): void {
        if (this.activePhotoIndex > 0) {
            this.activePhotoIndex--;
            this.showViewerReactionPicker = false;
        }
    }

    selectPhoto(index: number): void {
        if (index >= 0 && index < this.activePhotoCluster.length) {
            this.activePhotoIndex = index;
            this.showViewerReactionPicker = false;
        }
    }

    getCurrentPhotoReaction(): string | undefined {
        const currentPhoto = this.activePhotoCluster[this.activePhotoIndex];
        return currentPhoto ? this.photoReactions[currentPhoto] : undefined;
    }

    toggleViewerReactionPicker(event: Event): void {
        event.stopPropagation();
        this.showViewerReactionPicker = !this.showViewerReactionPicker;
    }

    reactToCurrentPhoto(event: Event, emoji: string): void {
        event.stopPropagation();
        const currentPhoto = this.activePhotoCluster[this.activePhotoIndex];
        if (!currentPhoto) return;

        if (this.photoReactions[currentPhoto] === emoji) {
            delete this.photoReactions[currentPhoto];
        } else {
            this.photoReactions[currentPhoto] = emoji;
        }
        this.showViewerReactionPicker = false;
    }

    openRepoFromViewer(): void {
        if (this.activeRepoUrl) {
            window.open(this.activeRepoUrl, '_blank');
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvents(event: KeyboardEvent): void {
        if (!this.showPhotoViewer) return;
        if (event.key === 'ArrowRight') {
            this.nextPhoto();
        } else if (event.key === 'ArrowLeft') {
            this.prevPhoto();
        } else if (event.key === 'Escape') {
            this.closePhotoViewer();
        }
    }
}
