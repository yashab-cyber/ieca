// IECA - Indian Error Cyber Army JavaScript
// Main functionality and features

// Global variables and configuration
const CONFIG = {
    adminCredentials: {
        email: 'yashabalam707@gmail.com',
        password: '@Ethicalhacker07'
    },
    chatResponses: {
        greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        services: ['services', 'service', 'what do you do', 'offerings', 'help'],
        join: ['join', 'membership', 'how to join', 'application', 'career'],
        contact: ['contact', 'reach', 'phone', 'email', 'address'],
        training: ['training', 'course', 'certification', 'learn', 'education'],
        security: ['security', 'hacking', 'penetration', 'cyber', 'protection']
    },
    autoResponses: {
        greetings: {
            message: "Hello! Welcome to IECA (Indian Error Cyber Army). I'm here to help you with information about our cybersecurity services and membership opportunities. How can I assist you today?",
            actions: ['Our Services', 'How to Join', 'Contact Info']
        },
        services: {
            message: "IECA offers comprehensive cybersecurity services including:\n\n🛡️ Penetration Testing\n🚨 Incident Response\n🔍 Threat Intelligence\n🎓 Training & Certification\n🏢 Consulting Services\n🔒 Secure Development\n\nWould you like more details about any specific service?",
            actions: ['Join IECA', 'Contact Info', 'Training Programs']
        },
        join: {
            message: "Joining IECA is an honor! We're looking for passionate cybersecurity professionals to protect Digital India.\n\nRequirements:\n✓ Age: 18-65 years\n✓ Indian citizenship\n✓ Cybersecurity background\n✓ Strong ethical standards\n\nReady to apply? Click 'Apply Now' or scroll to our application form!",
            actions: ['Apply Now', 'Our Services', 'Contact Info']
        },
        contact: {
            message: "Get in touch with IECA:\n\n🚨 Emergency: security@ieca.in\n💼 Business: contact@ieca.in\n🎓 Training: training@ieca.in\n👨‍💻 Founder: yashabalam707@gmail.com\n🌐 Website: ieca.zehrasec.com\n\nOur team responds within 24 hours for general inquiries and immediately for security emergencies.",
            actions: ['Our Services', 'Join IECA', 'Training Programs']
        },
        training: {
            message: "IECA Training Programs:\n\n🎯 Ethical Hacking Courses\n🔒 Security Awareness Training\n📜 Professional Certifications\n🏢 Corporate Workshops\n🔬 Advanced Security Research\n\nOur training is designed by industry experts and covers the latest cybersecurity trends and techniques.",
            actions: ['Join IECA', 'Contact Info', 'Our Services']
        },
        security: {
            message: "IECA provides world-class cybersecurity solutions:\n\n🛡️ 24/7 threat monitoring\n⚡ Rapid incident response\n🔍 Advanced threat intelligence\n🏢 Critical infrastructure protection\n🎓 Security training and awareness\n\nWe've successfully protected 1000+ systems and neutralized countless threats to keep Digital India safe.",
            actions: ['Join Our Team', 'Contact Us', 'Learn More']
        },
        default: {
            message: "Thank you for your interest in IECA! We're India's premier cybersecurity organization protecting digital infrastructure.\n\nI can help you with:\n• Information about our services\n• Membership and career opportunities\n• Training and certification programs\n• Contact details\n\nWhat would you like to know?",
            actions: ['Our Services', 'Join IECA', 'Contact Info']
        }
    }
};

// Utility functions
const utils = {
    // Generate unique ID
    generateId: () => Math.random().toString(36).substr(2, 9),
    
    // Format date and time
    formatDateTime: (date = new Date()) => {
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate Indian phone number
    validatePhone: (phone) => {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/\D/g, ''));
    },
    
    // Sanitize input to prevent XSS
    sanitizeInput: (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    // Show notification
    showNotification: (message, type = 'info', duration = 5000) => {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('.notification-icon');
        const messageEl = notification.querySelector('.notification-message');
        
        // Set content
        messageEl.textContent = message;
        
        // Set icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        icon.textContent = icons[type] || icons.info;
        
        // Apply styles
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        // Auto hide
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
};

// Data storage (using localStorage for persistence)
const storage = {
    // Save data
    save: (key, data) => {
        try {
            localStorage.setItem(`ieca_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },
    
    // Load data
    load: (key) => {
        try {
            const data = localStorage.getItem(`ieca_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    },
    
    // Remove data
    remove: (key) => {
        try {
            localStorage.removeItem(`ieca_${key}`);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
};

// Matrix rain animation
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.init();
        this.animate();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        this.hamburger?.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            });
        });
        
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        });
        
        // Smooth scrolling for anchor links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
}

// Chat system
class ChatSystem {
    constructor() {
        this.chatWidget = document.getElementById('chatWidget');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatClose = document.getElementById('chatClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatBadge = document.getElementById('chatBadge');
        this.quickActions = document.querySelectorAll('.quick-action');
        
        this.isOpen = false;
        this.messageHistory = storage.load('chat_history') || [];
        
        this.init();
    }
    
    init() {
        // Load previous messages
        this.loadMessageHistory();
        
        // Event listeners
        this.chatToggle?.addEventListener('click', () => this.toggleChat());
        this.chatClose?.addEventListener('click', () => this.closeChat());
        this.chatSend?.addEventListener('click', () => this.sendMessage());
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Quick actions
        this.quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.dataset.action;
                this.handleQuickAction(actionType);
            });
        });
        
        // Show initial badge
        this.updateBadge(1);
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            this.chatInput?.focus();
            this.updateBadge(0);
        }
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('active');
    }
    
    sendMessage() {
        const message = this.chatInput?.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Generate bot response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response.message, 'bot', response.actions);
        }, 1000);
    }
    
    addMessage(content, type, actions = []) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Handle multiline content
        const lines = content.split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            messageContent.appendChild(p);
        });
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageEl.appendChild(messageContent);
        messageEl.appendChild(messageTime);
        
        // Add action buttons for bot messages
        if (type === 'bot' && actions.length > 0) {
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'message-actions';
            actionsContainer.style.marginTop = '0.5rem';
            
            actions.forEach(action => {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'quick-action';
                actionBtn.textContent = action;
                actionBtn.addEventListener('click', () => {
                    this.handleActionClick(action);
                });
                actionsContainer.appendChild(actionBtn);
            });
            
            messageEl.appendChild(actionsContainer);
        }
        
        this.chatMessages?.appendChild(messageEl);
        this.chatMessages?.scrollTo(0, this.chatMessages.scrollHeight);
        
        // Save to history
        this.messageHistory.push({
            content,
            type,
            timestamp: Date.now(),
            actions
        });
        
        this.saveMessageHistory();
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for different categories
        for (const [category, keywords] of Object.entries(CONFIG.chatResponses)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return CONFIG.autoResponses[category] || CONFIG.autoResponses.default;
            }
        }
        
        return CONFIG.autoResponses.default;
    }
    
    handleQuickAction(action) {
        const responses = {
            services: CONFIG.autoResponses.services,
            join: CONFIG.autoResponses.join,
            contact: CONFIG.autoResponses.contact
        };
        
        const response = responses[action] || CONFIG.autoResponses.default;
        this.addMessage(response.message, 'bot', response.actions);
    }
    
    handleActionClick(action) {
        switch (action) {
            case 'Our Services':
                document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'Join IECA':
            case 'Apply Now':
                document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'Contact Info':
            case 'Contact Us':
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'Training Programs':
                this.addMessage(CONFIG.autoResponses.training.message, 'bot', CONFIG.autoResponses.training.actions);
                break;
            default:
                this.addMessage(`You clicked: ${action}. How can I help you further?`, 'bot');
        }
    }
    
    updateBadge(count) {
        if (this.chatBadge) {
            this.chatBadge.textContent = count;
            this.chatBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    loadMessageHistory() {
        this.messageHistory.forEach(msg => {
            if (msg.type === 'bot') {
                // Only show the welcome message on first load
                const existingMessages = this.chatMessages?.children.length || 0;
                if (existingMessages <= 1) {
                    return; // Skip loading old bot messages except welcome
                }
            }
        });
    }
    
    saveMessageHistory() {
        // Keep only last 50 messages
        if (this.messageHistory.length > 50) {
            this.messageHistory = this.messageHistory.slice(-50);
        }
        storage.save('chat_history', this.messageHistory);
    }
}

// Form validation and submission
class FormHandler {
    constructor() {
        this.joinForm = document.getElementById('joinForm');
        this.contactForm = document.getElementById('contactForm');
        this.applications = storage.load('applications') || [];
        this.contacts = storage.load('contacts') || [];
        
        this.init();
    }
    
    init() {
        this.joinForm?.addEventListener('submit', (e) => this.handleJoinSubmit(e));
        this.contactForm?.addEventListener('submit', (e) => this.handleContactSubmit(e));
        
        // Real-time validation
        this.setupRealTimeValidation();
    }
    
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Specific validations
        switch (fieldName) {
            case 'email':
            case 'contactEmail':
                if (value && !utils.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                if (value && !utils.validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid Indian phone number';
                }
                break;
                
            case 'age':
                const age = parseInt(value);
                if (value && (age < 18 || age > 65)) {
                    isValid = false;
                    errorMessage = 'Age must be between 18 and 65 years';
                }
                break;
                
            case 'fullName':
            case 'contactName':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
        }
        
        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    showFieldError(field, message) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            field.classList.toggle('error', !!message);
        }
    }
    
    clearError(field) {
        this.showFieldError(field, '');
    }
    
    async handleJoinSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const formData = new FormData(this.joinForm);
        const data = Object.fromEntries(formData.entries());
        
        let isValid = true;
        const requiredFields = ['fullName', 'email', 'phone', 'age', 'location', 'experience', 'skills', 'motivation'];
        
        requiredFields.forEach(fieldName => {
            const field = this.joinForm.querySelector(`[name="${fieldName}"]`);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Check terms acceptance
        const termsCheckbox = this.joinForm.querySelector('#terms');
        if (!termsCheckbox.checked) {
            this.showFieldError(termsCheckbox, 'You must accept the terms and conditions');
            isValid = false;
        }
        
        if (!isValid) {
            utils.showNotification('Please fix the errors and try again', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.joinForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        submitBtn.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.style.display = 'block';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create application record
            const application = {
                id: utils.generateId(),
                ...data,
                status: 'pending',
                submittedAt: Date.now(),
                submittedDate: utils.formatDateTime()
            };
            
            // Save application
            this.applications.push(application);
            storage.save('applications', this.applications);
            
            // Send confirmation email (simulated)
            this.sendConfirmationEmail(application);
            
            // Show success message
            utils.showNotification('Application submitted successfully! Check your email for confirmation.', 'success', 7000);
            
            // Reset form
            this.joinForm.reset();
            
            // Track submission for admin
            this.trackAdminNotification('new_application', application);
            
        } catch (error) {
            console.error('Submission error:', error);
            utils.showNotification('Submission failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
        }
    }
    
    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        let isValid = true;
        ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(fieldName => {
            const field = this.contactForm.querySelector(`[name="${fieldName}"]`);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            utils.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Create contact record
            const contact = {
                id: utils.generateId(),
                ...data,
                submittedAt: Date.now(),
                submittedDate: utils.formatDateTime(),
                status: 'new'
            };
            
            // Save contact
            this.contacts.push(contact);
            storage.save('contacts', this.contacts);
            
            // Show success message
            utils.showNotification('Message sent successfully! We\'ll respond within 24 hours.', 'success');
            
            // Reset form
            this.contactForm.reset();
            
            // Track for admin
            this.trackAdminNotification('new_contact', contact);
            
        } catch (error) {
            console.error('Contact submission error:', error);
            utils.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    }
    
    sendConfirmationEmail(application) {
        // Email template (simulated)
        const emailContent = this.generateEmailTemplate(application);
        
        // Save email log
        const emailLog = {
            id: utils.generateId(),
            to: application.email,
            subject: 'IECA Application Confirmation',
            content: emailContent,
            sentAt: Date.now(),
            sentDate: utils.formatDateTime(),
            type: 'confirmation'
        };
        
        const emails = storage.load('emails') || [];
        emails.push(emailLog);
        storage.save('emails', emails);
        
        console.log('Confirmation email sent:', emailLog);
    }
    
    generateEmailTemplate(application) {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border: 2px solid #00ff41; border-radius: 8px;">
            <div style="background: rgba(0, 255, 65, 0.1); padding: 2rem; text-align: center; border-bottom: 1px solid #00ff41;">
                <h1 style="color: #00ff41; margin: 0; text-shadow: 0 0 10px #00ff41;">IECA</h1>
                <p style="margin: 0.5rem 0 0; color: #cccccc;">Indian Error Cyber Army</p>
            </div>
            
            <div style="padding: 2rem;">
                <h2 style="color: #00ff41;">Application Confirmation</h2>
                
                <p>Dear ${application.fullName},</p>
                
                <p>Thank you for your interest in joining IECA (Indian Error Cyber Army). We have successfully received your application and are excited to review your qualifications.</p>
                
                <div style="background: rgba(0, 255, 65, 0.1); padding: 1rem; border-radius: 8px; margin: 1.5rem 0;">
                    <h3 style="color: #00ff41; margin-top: 0;">Application Details:</h3>
                    <p><strong>Application ID:</strong> ${application.id}</p>
                    <p><strong>Name:</strong> ${application.fullName}</p>
                    <p><strong>Email:</strong> ${application.email}</p>
                    <p><strong>Experience Level:</strong> ${application.experience}</p>
                    <p><strong>Submitted Date:</strong> ${application.submittedDate}</p>
                    <p><strong>Status:</strong> Under Review</p>
                </div>
                
                <h3 style="color: #00ff41;">What's Next?</h3>
                <ol style="color: #cccccc;">
                    <li><strong>Review Process:</strong> Our team will carefully review your application within 24-48 hours</li>
                    <li><strong>Background Verification:</strong> We'll verify your credentials and experience</li>
                    <li><strong>Interview:</strong> Qualified candidates will be contacted for a technical interview</li>
                    <li><strong>Onboarding:</strong> Successful candidates will receive onboarding instructions</li>
                </ol>
                
                <div style="background: rgba(0, 102, 204, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #0066cc; margin: 1.5rem 0;">
                    <h4 style="color: #0066cc; margin-top: 0;">Important Notes:</h4>
                    <ul style="color: #cccccc;">
                        <li>Keep this email for your records</li>
                        <li>You can use your Application ID for any follow-up queries</li>
                        <li>We'll update you at each stage of the review process</li>
                        <li>For urgent queries, contact us at: recruitment@ieca.in</li>
                    </ul>
                </div>
                
                <p>We appreciate your commitment to protecting Digital India and look forward to potentially welcoming you to our elite team of cybersecurity professionals.</p>
                
                <p>Best regards,<br>
                <strong>IECA Recruitment Team</strong><br>
                Indian Error Cyber Army</p>
            </div>
            
            <div style="background: rgba(0, 255, 65, 0.05); padding: 1rem; text-align: center; border-top: 1px solid rgba(0, 255, 65, 0.2); font-size: 0.9rem; color: #888888;">
                <p>This is an automated message from IECA. Please do not reply to this email.</p>
                <p>© 2024 Indian Error Cyber Army. All rights reserved.</p>
                <p>Built with ❤️ for India's Digital Security</p>
            </div>
        </div>
        `;
    }
    
    trackAdminNotification(type, data) {
        const notifications = storage.load('admin_notifications') || [];
        notifications.push({
            id: utils.generateId(),
            type,
            data,
            timestamp: Date.now(),
            read: false
        });
        storage.save('admin_notifications', notifications);
    }
}

// Admin system
class AdminSystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentSession = null;
        this.adminModal = document.getElementById('adminModal');
        this.adminLoginForm = document.getElementById('adminLoginForm');
        
        this.init();
    }
    
    init() {
        // Check for existing session
        this.checkSession();
        
        // Setup admin trigger (typing "IECA")
        this.setupAdminTrigger();
        
        // Setup login form
        this.adminLoginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Setup modal close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Close modal on outside click
        this.adminModal?.addEventListener('click', (e) => {
            if (e.target === this.adminModal) {
                this.closeModal();
            }
        });
    }
    
    setupAdminTrigger() {
        let triggerSequence = '';
        const targetSequence = 'IECA';
        
        document.addEventListener('keydown', (e) => {
            if (e.key.toUpperCase() === e.key && e.key.match(/[A-Z]/)) {
                triggerSequence += e.key;
                
                if (triggerSequence.length > targetSequence.length) {
                    triggerSequence = triggerSequence.slice(-targetSequence.length);
                }
                
                if (triggerSequence === targetSequence) {
                    this.showAdminLogin();
                    triggerSequence = '';
                }
            } else {
                triggerSequence = '';
            }
        });
    }
    
    showAdminLogin() {
        if (this.isLoggedIn) {
            this.showAdminPanel();
        } else {
            this.adminModal?.classList.add('active');
        }
    }
    
    closeModal() {
        this.adminModal?.classList.remove('active');
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        // Validate credentials
        if (email === CONFIG.adminCredentials.email && password === CONFIG.adminCredentials.password) {
            // Create session
            this.currentSession = {
                email,
                loginTime: Date.now(),
                sessionId: utils.generateId()
            };
            
            this.isLoggedIn = true;
            storage.save('admin_session', this.currentSession);
            
            this.closeModal();
            this.showAdminPanel();
            
            utils.showNotification('Admin login successful', 'success');
        } else {
            utils.showNotification('Invalid credentials', 'error');
        }
    }
    
    checkSession() {
        const session = storage.load('admin_session');
        if (session) {
            // Check if session is still valid (1 hour)
            const sessionAge = Date.now() - session.loginTime;
            if (sessionAge < 3600000) { // 1 hour
                this.currentSession = session;
                this.isLoggedIn = true;
            } else {
                storage.remove('admin_session');
            }
        }
    }
    
    showAdminPanel() {
        // Create admin panel window
        const adminWindow = window.open('', 'IECA_Admin', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (adminWindow) {
            adminWindow.document.write(this.generateAdminHTML());
            adminWindow.document.close();
            this.initializeAdminPanel(adminWindow);
        } else {
            utils.showNotification('Please allow popups for admin panel', 'warning');
        }
    }
    
    generateAdminHTML() {
        const applications = storage.load('applications') || [];
        const contacts = storage.load('contacts') || [];
        const emails = storage.load('emails') || [];
        const notifications = storage.load('admin_notifications') || [];
        const chatHistory = storage.load('chat_history') || [];
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>IECA Admin Panel</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Consolas', monospace; 
                    background: #0a0a0a; 
                    color: #ffffff; 
                    line-height: 1.6; 
                }
                .header { 
                    background: rgba(0, 255, 65, 0.1); 
                    padding: 1rem; 
                    border-bottom: 2px solid #00ff41; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                }
                .logo { color: #00ff41; font-size: 1.5rem; font-weight: bold; }
                .user-info { color: #cccccc; }
                .nav { 
                    background: #111; 
                    padding: 0.5rem; 
                    border-bottom: 1px solid #333; 
                }
                .nav button { 
                    background: transparent; 
                    border: 1px solid #00ff41; 
                    color: #00ff41; 
                    padding: 0.5rem 1rem; 
                    margin-right: 0.5rem; 
                    cursor: pointer; 
                    border-radius: 4px; 
                }
                .nav button:hover, .nav button.active { 
                    background: #00ff41; 
                    color: #000; 
                }
                .content { padding: 2rem; }
                .tab-content { display: none; }
                .tab-content.active { display: block; }
                .stats-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 1rem; 
                    margin-bottom: 2rem; 
                }
                .stat-card { 
                    background: rgba(0, 255, 65, 0.1); 
                    padding: 1.5rem; 
                    border: 1px solid #00ff41; 
                    border-radius: 8px; 
                    text-align: center; 
                }
                .stat-number { 
                    font-size: 2rem; 
                    color: #00ff41; 
                    font-weight: bold; 
                    display: block; 
                }
                .stat-label { color: #cccccc; }
                .table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 1rem; 
                }
                .table th, .table td { 
                    padding: 0.75rem; 
                    border: 1px solid #333; 
                    text-align: left; 
                }
                .table th { 
                    background: rgba(0, 255, 65, 0.1); 
                    color: #00ff41; 
                }
                .table tr:nth-child(even) { background: rgba(255, 255, 255, 0.05); }
                .status { 
                    padding: 0.25rem 0.5rem; 
                    border-radius: 4px; 
                    font-size: 0.8rem; 
                    font-weight: bold; 
                }
                .status.pending { background: #ffaa00; color: #000; }
                .status.approved { background: #00ff41; color: #000; }
                .status.rejected { background: #ff0040; color: #fff; }
                .status.new { background: #0066cc; color: #fff; }
                .btn { 
                    background: transparent; 
                    border: 1px solid #00ff41; 
                    color: #00ff41; 
                    padding: 0.25rem 0.5rem; 
                    cursor: pointer; 
                    border-radius: 4px; 
                    font-size: 0.8rem; 
                }
                .btn:hover { background: #00ff41; color: #000; }
                .btn-danger { border-color: #ff0040; color: #ff0040; }
                .btn-danger:hover { background: #ff0040; color: #fff; }
                .message-item { 
                    background: rgba(255, 255, 255, 0.05); 
                    margin: 0.5rem 0; 
                    padding: 1rem; 
                    border-left: 3px solid #00ff41; 
                    border-radius: 4px; 
                }
                .message-meta { 
                    color: #888; 
                    font-size: 0.8rem; 
                    margin-bottom: 0.5rem; 
                }
                .logout { 
                    background: #ff0040; 
                    color: white; 
                    border: none; 
                    padding: 0.5rem 1rem; 
                    cursor: pointer; 
                    border-radius: 4px; 
                }
                .logout:hover { background: #cc0033; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">IECA Admin Panel</div>
                <div class="user-info">
                    Logged in as: ${this.currentSession.email}
                    <button class="logout" onclick="logout()">Logout</button>
                </div>
            </div>
            
            <div class="nav">
                <button class="tab-btn active" data-tab="dashboard">Dashboard</button>
                <button class="tab-btn" data-tab="applications">Applications (${applications.length})</button>
                <button class="tab-btn" data-tab="contacts">Contacts (${contacts.length})</button>
                <button class="tab-btn" data-tab="emails">Emails (${emails.length})</button>
                <button class="tab-btn" data-tab="chat">Chat History (${chatHistory.length})</button>
                <button class="tab-btn" data-tab="notifications">Notifications (${notifications.filter(n => !n.read).length})</button>
            </div>
            
            <div class="content">
                <!-- Dashboard Tab -->
                <div id="dashboard" class="tab-content active">
                    <h2>Dashboard Overview</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-number">${applications.length}</span>
                            <span class="stat-label">Total Applications</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${applications.filter(a => a.status === 'pending').length}</span>
                            <span class="stat-label">Pending Applications</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${contacts.length}</span>
                            <span class="stat-label">Contact Messages</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${contacts.filter(c => c.status === 'new').length}</span>
                            <span class="stat-label">New Messages</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${emails.length}</span>
                            <span class="stat-label">Emails Sent</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${chatHistory.filter(m => m.type === 'user').length}</span>
                            <span class="stat-label">Chat Messages</span>
                        </div>
                    </div>
                    
                    <h3>Recent Activity</h3>
                    <div>
                        ${this.generateRecentActivity(applications, contacts, emails)}
                    </div>
                </div>
                
                <!-- Applications Tab -->
                <div id="applications" class="tab-content">
                    <h2>Membership Applications</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Experience</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${applications.map(app => `
                                <tr>
                                    <td>${app.id}</td>
                                    <td>${app.fullName}</td>
                                    <td>${app.email}</td>
                                    <td>${app.experience}</td>
                                    <td>${app.location}</td>
                                    <td><span class="status ${app.status}">${app.status.toUpperCase()}</span></td>
                                    <td>${app.submittedDate}</td>
                                    <td>
                                        <button class="btn" onclick="viewApplication('${app.id}')">View</button>
                                        <button class="btn" onclick="updateStatus('${app.id}', 'approved')">Approve</button>
                                        <button class="btn btn-danger" onclick="updateStatus('${app.id}', 'rejected')">Reject</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Contacts Tab -->
                <div id="contacts" class="tab-content">
                    <h2>Contact Messages</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${contacts.map(contact => `
                                <tr>
                                    <td>${contact.id}</td>
                                    <td>${contact.contactName}</td>
                                    <td>${contact.contactEmail}</td>
                                    <td>${contact.contactSubject}</td>
                                    <td><span class="status ${contact.status}">${contact.status.toUpperCase()}</span></td>
                                    <td>${contact.submittedDate}</td>
                                    <td>
                                        <button class="btn" onclick="viewContact('${contact.id}')">View</button>
                                        <button class="btn" onclick="markResolved('${contact.id}')">Mark Resolved</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Emails Tab -->
                <div id="emails" class="tab-content">
                    <h2>Email Logs</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>To</th>
                                <th>Subject</th>
                                <th>Type</th>
                                <th>Sent Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${emails.map(email => `
                                <tr>
                                    <td>${email.id}</td>
                                    <td>${email.to}</td>
                                    <td>${email.subject}</td>
                                    <td>${email.type}</td>
                                    <td>${email.sentDate}</td>
                                    <td>
                                        <button class="btn" onclick="viewEmail('${email.id}')">View Content</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Chat Tab -->
                <div id="chat" class="tab-content">
                    <h2>Chat History</h2>
                    <div>
                        ${chatHistory.map(msg => `
                            <div class="message-item">
                                <div class="message-meta">
                                    ${msg.type.toUpperCase()} - ${new Date(msg.timestamp).toLocaleString()}
                                </div>
                                <div>${msg.content}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Notifications Tab -->
                <div id="notifications" class="tab-content">
                    <h2>System Notifications</h2>
                    <div>
                        ${notifications.map(notif => `
                            <div class="message-item" style="border-left-color: ${notif.read ? '#666' : '#00ff41'}">
                                <div class="message-meta">
                                    ${notif.type.replace('_', ' ').toUpperCase()} - ${new Date(notif.timestamp).toLocaleString()}
                                    ${!notif.read ? '<strong style="color: #00ff41;">[NEW]</strong>' : ''}
                                </div>
                                <div>
                                    ${notif.type === 'new_application' ? 
                                        `New application from ${notif.data.fullName} (${notif.data.email})` :
                                        `New contact message from ${notif.data.contactName} (${notif.data.contactEmail})`
                                    }
                                </div>
                                <button class="btn" onclick="markNotificationRead('${notif.id}')">Mark as Read</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <script>
                // Tab functionality
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const tabId = btn.dataset.tab;
                        
                        // Update active tab button
                        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        // Update active tab content
                        document.querySelectorAll('.tab-content').forEach(content => {
                            content.classList.remove('active');
                        });
                        document.getElementById(tabId).classList.add('active');
                    });
                });
                
                // Admin functions
                function logout() {
                    if (confirm('Are you sure you want to logout?')) {
                        window.opener.postMessage({type: 'admin_logout'}, '*');
                        window.close();
                    }
                }
                
                function viewApplication(id) {
                    window.opener.postMessage({type: 'view_application', id: id}, '*');
                }
                
                function viewContact(id) {
                    window.opener.postMessage({type: 'view_contact', id: id}, '*');
                }
                
                function viewEmail(id) {
                    window.opener.postMessage({type: 'view_email', id: id}, '*');
                }
                
                function updateStatus(id, status) {
                    if (confirm(\`Update status to \${status}?\`)) {
                        window.opener.postMessage({type: 'update_application_status', id: id, status: status}, '*');
                        location.reload();
                    }
                }
                
                function markResolved(id) {
                    window.opener.postMessage({type: 'mark_contact_resolved', id: id}, '*');
                    location.reload();
                }
                
                function markNotificationRead(id) {
                    window.opener.postMessage({type: 'mark_notification_read', id: id}, '*');
                    location.reload();
                }
            </script>
        </body>
        </html>
        `;
    }
    
    generateRecentActivity(applications, contacts, emails) {
        const allActivity = [
            ...applications.map(app => ({
                type: 'Application',
                message: `New application from ${app.fullName}`,
                timestamp: app.submittedAt
            })),
            ...contacts.map(contact => ({
                type: 'Contact',
                message: `New message from ${contact.contactName}`,
                timestamp: contact.submittedAt
            })),
            ...emails.map(email => ({
                type: 'Email',
                message: `Email sent to ${email.to}`,
                timestamp: email.sentAt
            }))
        ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
        
        return allActivity.map(activity => `
            <div class="message-item">
                <div class="message-meta">
                    ${activity.type} - ${new Date(activity.timestamp).toLocaleString()}
                </div>
                <div>${activity.message}</div>
            </div>
        `).join('');
    }
    
    initializeAdminPanel(adminWindow) {
        // Listen for messages from admin panel
        window.addEventListener('message', (e) => {
            if (e.source !== adminWindow) return;
            
            const { type, id, status } = e.data;
            
            switch (type) {
                case 'admin_logout':
                    this.logout();
                    break;
                    
                case 'view_application':
                    this.viewApplication(id);
                    break;
                    
                case 'view_contact':
                    this.viewContact(id);
                    break;
                    
                case 'view_email':
                    this.viewEmail(id);
                    break;
                    
                case 'update_application_status':
                    this.updateApplicationStatus(id, status);
                    break;
                    
                case 'mark_contact_resolved':
                    this.markContactResolved(id);
                    break;
                    
                case 'mark_notification_read':
                    this.markNotificationRead(id);
                    break;
            }
        });
    }
    
    logout() {
        storage.remove('admin_session');
        this.isLoggedIn = false;
        this.currentSession = null;
        utils.showNotification('Logged out successfully', 'success');
    }
    
    viewApplication(id) {
        const applications = storage.load('applications') || [];
        const application = applications.find(app => app.id === id);
        
        if (application) {
            const details = `
Application Details:

ID: ${application.id}
Name: ${application.fullName}
Email: ${application.email}
Phone: ${application.phone}
Age: ${application.age}
Location: ${application.location}
Experience: ${application.experience}
Skills: ${application.skills}
Motivation: ${application.motivation}

Status: ${application.status}
Submitted: ${application.submittedDate}
            `;
            alert(details);
        }
    }
    
    viewContact(id) {
        const contacts = storage.load('contacts') || [];
        const contact = contacts.find(c => c.id === id);
        
        if (contact) {
            const details = `
Contact Message:

ID: ${contact.id}
Name: ${contact.contactName}
Email: ${contact.contactEmail}
Subject: ${contact.contactSubject}
Message: ${contact.contactMessage}

Status: ${contact.status}
Submitted: ${contact.submittedDate}
            `;
            alert(details);
        }
    }
    
    viewEmail(id) {
        const emails = storage.load('emails') || [];
        const email = emails.find(e => e.id === id);
        
        if (email) {
            const emailWindow = window.open('', 'Email_Content', 'width=800,height=600,scrollbars=yes');
            emailWindow.document.write(`
                <html>
                <head><title>Email Content</title></head>
                <body style="font-family: Arial, sans-serif; margin: 20px;">
                    <h2>Email Content</h2>
                    <p><strong>To:</strong> ${email.to}</p>
                    <p><strong>Subject:</strong> ${email.subject}</p>
                    <p><strong>Sent:</strong> ${email.sentDate}</p>
                    <hr>
                    ${email.content}
                </body>
                </html>
            `);
        }
    }
    
    updateApplicationStatus(id, status) {
        const applications = storage.load('applications') || [];
        const applicationIndex = applications.findIndex(app => app.id === id);
        
        if (applicationIndex !== -1) {
            applications[applicationIndex].status = status;
            applications[applicationIndex].updatedAt = Date.now();
            applications[applicationIndex].updatedDate = utils.formatDateTime();
            
            storage.save('applications', applications);
            utils.showNotification(`Application ${status} successfully`, 'success');
        }
    }
    
    markContactResolved(id) {
        const contacts = storage.load('contacts') || [];
        const contactIndex = contacts.findIndex(c => c.id === id);
        
        if (contactIndex !== -1) {
            contacts[contactIndex].status = 'resolved';
            contacts[contactIndex].resolvedAt = Date.now();
            contacts[contactIndex].resolvedDate = utils.formatDateTime();
            
            storage.save('contacts', contacts);
            utils.showNotification('Contact marked as resolved', 'success');
        }
    }
    
    markNotificationRead(id) {
        const notifications = storage.load('admin_notifications') || [];
        const notificationIndex = notifications.findIndex(n => n.id === id);
        
        if (notificationIndex !== -1) {
            notifications[notificationIndex].read = true;
            notifications[notificationIndex].readAt = Date.now();
            
            storage.save('admin_notifications', notifications);
            utils.showNotification('Notification marked as read', 'success');
        }
    }
}

// Loading screen
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.init();
    }
    
    init() {
        // Hide loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 3000);
        });
    }
    
    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    new LoadingScreen();
    
    // Initialize matrix rain effect
    new MatrixRain();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize chat system
    new ChatSystem();
    
    // Initialize form handler
    new FormHandler();
    
    // Initialize admin system
    new AdminSystem();
    
    // Initialize notification close handlers
    document.querySelectorAll('.notification-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.notification').classList.remove('show');
        });
    });
    
    // Initialize smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .value-item, .benefit-item, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Console message for developers
    console.log(`
    🛡️ IECA - Indian Error Cyber Army
    
    Welcome to IECA's official website!
    
    Built with ❤️ for India's Digital Security
    
    Developers:
    - Yashab Alam (Founder & CEO)
    - ZehraSec (Development Partner)
    
    Type "IECA" to access admin panel
    
    🔒 Protected by advanced security measures
    `);
});

// Service Worker registration helper
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully');
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed');
            });
    });
}

// Export for testing (if needed)
window.IECA = {
    utils,
    storage,
    CONFIG
};
