// IECA Backend Simulation
// Simulates backend functionality for development and testing

class IECABackendSimulation {
    constructor() {
        this.baseUrl = window.location.origin;
        this.apiPrefix = '/api';
        this.storage = {
            applications: JSON.parse(localStorage.getItem('ieca_applications') || '[]'),
            contacts: JSON.parse(localStorage.getItem('ieca_contacts') || '[]'),
            emails: JSON.parse(localStorage.getItem('ieca_emails') || '[]'),
            adminSessions: JSON.parse(localStorage.getItem('ieca_admin_sessions') || '[]'),
            chatMessages: JSON.parse(localStorage.getItem('ieca_chat_history') || '[]'),
            notifications: JSON.parse(localStorage.getItem('ieca_admin_notifications') || '[]')
        };
        
        this.init();
    }
    
    init() {
        console.log('🔧 IECA Backend Simulation initialized');
        
        // Simulate API endpoints
        this.setupAPIEndpoints();
        
        // Setup periodic tasks
        this.setupPeriodicTasks();
        
        // Initialize admin user if not exists
        this.initializeAdminUser();
    }
    
    setupAPIEndpoints() {
        // Override fetch for API calls
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options = {}) => {
            const urlObj = new URL(url, this.baseUrl);
            
            // Check if it's an API call
            if (urlObj.pathname.startsWith(this.apiPrefix)) {
                return this.handleAPIRequest(urlObj, options);
            }
            
            // Use original fetch for non-API calls
            return originalFetch(url, options);
        };
    }
    
    async handleAPIRequest(url, options) {
        const endpoint = url.pathname.replace(this.apiPrefix, '');
        const method = options.method || 'GET';
        
        console.log(`📡 API Request: ${method} ${endpoint}`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        try {
            let response;
            
            switch (endpoint) {
                // Application endpoints
                case '/applications':
                    response = await this.handleApplications(method, options);
                    break;
                    
                case '/applications/submit':
                    response = await this.handleApplicationSubmit(options);
                    break;
                    
                // Contact endpoints
                case '/contacts':
                    response = await this.handleContacts(method, options);
                    break;
                    
                case '/contacts/submit':
                    response = await this.handleContactSubmit(options);
                    break;
                    
                // Email endpoints
                case '/emails/send':
                    response = await this.handleEmailSend(options);
                    break;
                    
                case '/emails':
                    response = await this.handleEmails(method);
                    break;
                    
                // Admin endpoints
                case '/admin/login':
                    response = await this.handleAdminLogin(options);
                    break;
                    
                case '/admin/logout':
                    response = await this.handleAdminLogout(options);
                    break;
                    
                case '/admin/dashboard':
                    response = await this.handleAdminDashboard();
                    break;
                    
                // Chat endpoints
                case '/chat/messages':
                    response = await this.handleChatMessages(method, options);
                    break;
                    
                case '/chat/response':
                    response = await this.handleChatResponse(options);
                    break;
                    
                // Notification endpoints
                case '/notifications':
                    response = await this.handleNotifications(method, options);
                    break;
                    
                default:
                    response = this.createErrorResponse('Endpoint not found', 404);
            }
            
            return new Response(JSON.stringify(response.data), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Simulation': 'true'
                }
            });
            
        } catch (error) {
            console.error('❌ API Error:', error);
            return new Response(JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    
    // Application handlers
    async handleApplications(method, options) {
        switch (method) {
            case 'GET':
                return this.createSuccessResponse(this.storage.applications);
                
            case 'POST':
                return this.handleApplicationSubmit(options);
                
            default:
                return this.createErrorResponse('Method not allowed', 405);
        }
    }
    
    async handleApplicationSubmit(options) {
        try {
            const data = JSON.parse(options.body);
            
            // Validate required fields
            const requiredFields = ['fullName', 'email', 'phone', 'age', 'location', 'experience', 'skills', 'motivation'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                return this.createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
            }
            
            // Create application record
            const application = {
                id: this.generateId(),
                ...data,
                status: 'pending',
                submittedAt: Date.now(),
                submittedDate: this.formatDateTime(),
                ipAddress: '127.0.0.1', // Simulated
                userAgent: navigator.userAgent
            };
            
            // Save application
            this.storage.applications.push(application);
            this.saveToStorage('applications');
            
            // Send confirmation email
            await this.sendConfirmationEmail(application);
            
            // Create admin notification
            await this.createAdminNotification('new_application', application);
            
            console.log('✅ Application submitted:', application.id);
            
            return this.createSuccessResponse({
                message: 'Application submitted successfully',
                applicationId: application.id,
                status: 'pending'
            });
            
        } catch (error) {
            return this.createErrorResponse('Invalid application data', 400);
        }
    }
    
    // Contact handlers
    async handleContacts(method, options) {
        switch (method) {
            case 'GET':
                return this.createSuccessResponse(this.storage.contacts);
                
            case 'POST':
                return this.handleContactSubmit(options);
                
            default:
                return this.createErrorResponse('Method not allowed', 405);
        }
    }
    
    async handleContactSubmit(options) {
        try {
            const data = JSON.parse(options.body);
            
            // Validate required fields
            const requiredFields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                return this.createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
            }
            
            // Create contact record
            const contact = {
                id: this.generateId(),
                ...data,
                status: 'new',
                submittedAt: Date.now(),
                submittedDate: this.formatDateTime(),
                ipAddress: '127.0.0.1', // Simulated
                userAgent: navigator.userAgent
            };
            
            // Save contact
            this.storage.contacts.push(contact);
            this.saveToStorage('contacts');
            
            // Send auto-reply email
            await this.sendAutoReplyEmail(contact);
            
            // Create admin notification
            await this.createAdminNotification('new_contact', contact);
            
            console.log('✅ Contact message submitted:', contact.id);
            
            return this.createSuccessResponse({
                message: 'Message sent successfully',
                contactId: contact.id,
                expectedResponseTime: '24 hours'
            });
            
        } catch (error) {
            return this.createErrorResponse('Invalid contact data', 400);
        }
    }
    
    // Email handlers
    async handleEmailSend(options) {
        try {
            const emailData = JSON.parse(options.body);
            
            const email = {
                id: this.generateId(),
                ...emailData,
                sentAt: Date.now(),
                sentDate: this.formatDateTime(),
                status: 'sent'
            };
            
            this.storage.emails.push(email);
            this.saveToStorage('emails');
            
            console.log('📧 Email sent:', email.id);
            
            return this.createSuccessResponse({
                message: 'Email sent successfully',
                emailId: email.id
            });
            
        } catch (error) {
            return this.createErrorResponse('Invalid email data', 400);
        }
    }
    
    async handleEmails(method) {
        if (method === 'GET') {
            return this.createSuccessResponse(this.storage.emails);
        }
        return this.createErrorResponse('Method not allowed', 405);
    }
    
    // Admin handlers
    async handleAdminLogin(options) {
        try {
            const credentials = JSON.parse(options.body);
            
            // Validate credentials (in real app, this would be properly hashed)
            if (credentials.email === 'yashabalam707@gmail.com' && 
                credentials.password === '@Ethicalhacker07') {
                
                const session = {
                    id: this.generateId(),
                    email: credentials.email,
                    loginTime: Date.now(),
                    ipAddress: '127.0.0.1',
                    userAgent: navigator.userAgent,
                    expiresAt: Date.now() + (3600000) // 1 hour
                };
                
                this.storage.adminSessions.push(session);
                this.saveToStorage('adminSessions');
                
                console.log('✅ Admin login successful:', session.id);
                
                return this.createSuccessResponse({
                    message: 'Login successful',
                    sessionId: session.id,
                    expiresIn: 3600
                });
            } else {
                return this.createErrorResponse('Invalid credentials', 401);
            }
            
        } catch (error) {
            return this.createErrorResponse('Invalid login data', 400);
        }
    }
    
    async handleAdminLogout(options) {
        try {
            const data = JSON.parse(options.body);
            const sessionIndex = this.storage.adminSessions.findIndex(s => s.id === data.sessionId);
            
            if (sessionIndex !== -1) {
                this.storage.adminSessions.splice(sessionIndex, 1);
                this.saveToStorage('adminSessions');
                
                console.log('✅ Admin logout successful');
                
                return this.createSuccessResponse({
                    message: 'Logout successful'
                });
            } else {
                return this.createErrorResponse('Session not found', 404);
            }
            
        } catch (error) {
            return this.createErrorResponse('Invalid logout data', 400);
        }
    }
    
    async handleAdminDashboard() {
        const stats = {
            totalApplications: this.storage.applications.length,
            pendingApplications: this.storage.applications.filter(a => a.status === 'pending').length,
            approvedApplications: this.storage.applications.filter(a => a.status === 'approved').length,
            rejectedApplications: this.storage.applications.filter(a => a.status === 'rejected').length,
            totalContacts: this.storage.contacts.length,
            newContacts: this.storage.contacts.filter(c => c.status === 'new').length,
            resolvedContacts: this.storage.contacts.filter(c => c.status === 'resolved').length,
            totalEmails: this.storage.emails.length,
            chatMessages: this.storage.chatMessages.length,
            unreadNotifications: this.storage.notifications.filter(n => !n.read).length
        };
        
        return this.createSuccessResponse({
            stats,
            recentApplications: this.storage.applications.slice(-5),
            recentContacts: this.storage.contacts.slice(-5),
            recentEmails: this.storage.emails.slice(-5)
        });
    }
    
    // Chat handlers
    async handleChatMessages(method, options) {
        switch (method) {
            case 'GET':
                return this.createSuccessResponse(this.storage.chatMessages);
                
            case 'POST':
                const message = JSON.parse(options.body);
                const chatMessage = {
                    id: this.generateId(),
                    ...message,
                    timestamp: Date.now()
                };
                
                this.storage.chatMessages.push(chatMessage);
                this.saveToStorage('chatMessages');
                
                return this.createSuccessResponse(chatMessage);
                
            default:
                return this.createErrorResponse('Method not allowed', 405);
        }
    }
    
    async handleChatResponse(options) {
        try {
            const data = JSON.parse(options.body);
            const userMessage = data.message.toLowerCase();
            
            // Simple response logic (in real app, this would be more sophisticated)
            let response = 'Thank you for your message. How can I help you with IECA services?';
            
            if (userMessage.includes('join') || userMessage.includes('membership')) {
                response = 'I\'d be happy to help you with joining IECA! We\'re looking for passionate cybersecurity professionals. You can fill out our application form on the website.';
            } else if (userMessage.includes('service') || userMessage.includes('offering')) {
                response = 'IECA offers comprehensive cybersecurity services including penetration testing, incident response, threat intelligence, training, and consulting. Which service interests you most?';
            } else if (userMessage.includes('contact') || userMessage.includes('reach')) {
                response = 'You can reach IECA at:\n📧 contact@ieca.in\n🚨 security@ieca.in (emergencies)\n🎓 training@ieca.in\n👨‍💻 yashabalam707@gmail.com (founder)';
            }
            
            const botMessage = {
                id: this.generateId(),
                type: 'bot',
                content: response,
                timestamp: Date.now()
            };
            
            this.storage.chatMessages.push(botMessage);
            this.saveToStorage('chatMessages');
            
            return this.createSuccessResponse(botMessage);
            
        } catch (error) {
            return this.createErrorResponse('Invalid chat data', 400);
        }
    }
    
    // Notification handlers
    async handleNotifications(method, options) {
        switch (method) {
            case 'GET':
                return this.createSuccessResponse(this.storage.notifications);
                
            case 'PUT':
                const data = JSON.parse(options.body);
                const notificationIndex = this.storage.notifications.findIndex(n => n.id === data.id);
                
                if (notificationIndex !== -1) {
                    this.storage.notifications[notificationIndex] = {
                        ...this.storage.notifications[notificationIndex],
                        ...data,
                        updatedAt: Date.now()
                    };
                    this.saveToStorage('notifications');
                    
                    return this.createSuccessResponse(this.storage.notifications[notificationIndex]);
                } else {
                    return this.createErrorResponse('Notification not found', 404);
                }
                
            default:
                return this.createErrorResponse('Method not allowed', 405);
        }
    }
    
    // Email simulation methods
    async sendConfirmationEmail(application) {
        const emailContent = this.generateConfirmationEmailTemplate(application);
        
        const email = {
            id: this.generateId(),
            to: application.email,
            from: 'no-reply@ieca.in',
            subject: 'IECA Application Confirmation - Welcome to the Elite!',
            content: emailContent,
            type: 'application_confirmation',
            applicationId: application.id,
            sentAt: Date.now(),
            sentDate: this.formatDateTime(),
            status: 'sent'
        };
        
        this.storage.emails.push(email);
        this.saveToStorage('emails');
        
        console.log('📧 Confirmation email sent to:', application.email);
    }
    
    async sendAutoReplyEmail(contact) {
        const emailContent = this.generateAutoReplyEmailTemplate(contact);
        
        const email = {
            id: this.generateId(),
            to: contact.contactEmail,
            from: 'support@ieca.in',
            subject: 'IECA - Message Received | We\'ll Respond Within 24 Hours',
            content: emailContent,
            type: 'auto_reply',
            contactId: contact.id,
            sentAt: Date.now(),
            sentDate: this.formatDateTime(),
            status: 'sent'
        };
        
        this.storage.emails.push(email);
        this.saveToStorage('emails');
        
        console.log('📧 Auto-reply email sent to:', contact.contactEmail);
    }
    
    // Notification methods
    async createAdminNotification(type, data) {
        const notification = {
            id: this.generateId(),
            type,
            title: this.getNotificationTitle(type),
            message: this.getNotificationMessage(type, data),
            data,
            read: false,
            priority: type.includes('security') ? 'high' : 'normal',
            createdAt: Date.now(),
            createdDate: this.formatDateTime()
        };
        
        this.storage.notifications.push(notification);
        this.saveToStorage('notifications');
        
        console.log('🔔 Admin notification created:', notification.id);
    }
    
    getNotificationTitle(type) {
        const titles = {
            new_application: '🆕 New Membership Application',
            new_contact: '💬 New Contact Message',
            application_approved: '✅ Application Approved',
            application_rejected: '❌ Application Rejected',
            security_alert: '🚨 Security Alert',
            system_maintenance: '🔧 System Maintenance'
        };
        
        return titles[type] || '📢 New Notification';
    }
    
    getNotificationMessage(type, data) {
        switch (type) {
            case 'new_application':
                return `New membership application received from ${data.fullName} (${data.email})`;
            case 'new_contact':
                return `New contact message from ${data.contactName} regarding: ${data.contactSubject}`;
            case 'application_approved':
                return `Application from ${data.fullName} has been approved`;
            case 'application_rejected':
                return `Application from ${data.fullName} has been rejected`;
            default:
                return 'New notification received';
        }
    }
    
    // Email templates
    generateConfirmationEmailTemplate(application) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>IECA Application Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0a0a0a; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border: 2px solid #00ff41; border-radius: 10px; overflow: hidden;">
                <!-- Header -->
                <div style="background: rgba(0, 255, 65, 0.1); padding: 30px; text-align: center; border-bottom: 1px solid #00ff41;">
                    <h1 style="color: #00ff41; margin: 0; text-shadow: 0 0 10px #00ff41; font-size: 2.5em;">IECA</h1>
                    <p style="color: #cccccc; margin: 10px 0 0; font-size: 1.1em;">Indian Error Cyber Army</p>
                    <p style="color: #888888; margin: 5px 0 0; font-size: 0.9em;">Elite Cybersecurity Professionals</p>
                </div>
                
                <!-- Welcome Section -->
                <div style="padding: 30px;">
                    <h2 style="color: #00ff41; margin-top: 0; text-align: center;">🛡️ Welcome to the Elite! 🛡️</h2>
                    
                    <p style="color: #cccccc; font-size: 1.1em;">Dear <strong style="color: #00ff41;">${application.fullName}</strong>,</p>
                    
                    <p style="color: #cccccc;">Congratulations! Your application to join IECA (Indian Error Cyber Army) has been successfully received. We are excited to review your qualifications and potentially welcome you to India's most elite cybersecurity organization.</p>
                    
                    <!-- Application Details -->
                    <div style="background: rgba(0, 255, 65, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #00ff41; margin: 25px 0;">
                        <h3 style="color: #00ff41; margin-top: 0;">📋 Application Details</h3>
                        <table style="width: 100%; color: #cccccc;">
                            <tr><td style="padding: 5px 0;"><strong>Application ID:</strong></td><td style="color: #00ff41;">${application.id}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Name:</strong></td><td>${application.fullName}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td>${application.email}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Experience Level:</strong></td><td>${application.experience}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Location:</strong></td><td>${application.location}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Submitted:</strong></td><td>${application.submittedDate}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Status:</strong></td><td style="color: #ffaa00;">Under Review</td></tr>
                        </table>
                    </div>
                    
                    <!-- Next Steps -->
                    <h3 style="color: #00ff41;">🚀 What Happens Next?</h3>
                    <div style="background: rgba(0, 102, 204, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #0066cc;">
                        <ol style="color: #cccccc; margin: 0; padding-left: 20px;">
                            <li style="margin: 10px 0;"><strong style="color: #0066cc;">Review Process (24-48 hours):</strong> Our elite team will carefully evaluate your application and credentials</li>
                            <li style="margin: 10px 0;"><strong style="color: #0066cc;">Background Verification:</strong> We'll verify your experience and conduct security clearance checks</li>
                            <li style="margin: 10px 0;"><strong style="color: #0066cc;">Technical Assessment:</strong> Qualified candidates receive our cybersecurity challenge</li>
                            <li style="margin: 10px 0;"><strong style="color: #0066cc;">Final Interview:</strong> Meet with IECA leadership team</li>
                            <li style="margin: 10px 0;"><strong style="color: #0066cc;">Onboarding:</strong> Welcome to the elite ranks of IECA!</li>
                        </ol>
                    </div>
                    
                    <!-- Important Information -->
                    <div style="background: rgba(255, 170, 0, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #ffaa00; margin: 25px 0;">
                        <h4 style="color: #ffaa00; margin-top: 0;">⚠️ Important Information</h4>
                        <ul style="color: #cccccc; margin: 0; padding-left: 20px;">
                            <li>Keep this email and your Application ID for all communications</li>
                            <li>We'll update you at each stage of the review process</li>
                            <li>Check your email regularly for updates (including spam folder)</li>
                            <li>For urgent queries: <strong>recruitment@ieca.in</strong></li>
                            <li>Technical issues: <strong>support@ieca.in</strong></li>
                        </ul>
                    </div>
                    
                    <!-- Call to Action -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://ieca.zehrasec.com" style="display: inline-block; background: linear-gradient(45deg, #00ff41, #00cc33); color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0, 255, 65, 0.3);">Visit IECA Website</a>
                    </div>
                    
                    <p style="color: #cccccc; text-align: center;">Thank you for your commitment to protecting Digital India. Together, we'll build an impenetrable cyber defense for our nation!</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #888888; margin: 5px 0;">Best regards,</p>
                        <p style="color: #00ff41; font-weight: bold; margin: 5px 0;">IECA Recruitment Team</p>
                        <p style="color: #cccccc; font-weight: bold; margin: 5px 0;">Indian Error Cyber Army</p>
                        <p style="color: #888888; font-size: 0.9em; margin: 5px 0;">Elite Cybersecurity Professionals</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: rgba(0, 255, 65, 0.05); padding: 20px; text-align: center; border-top: 1px solid rgba(0, 255, 65, 0.2);">
                    <p style="color: #888888; font-size: 0.9em; margin: 5px 0;">🔒 This is an automated secure message from IECA</p>
                    <p style="color: #888888; font-size: 0.8em; margin: 5px 0;">Please do not reply to this email. For support, contact: support@ieca.in</p>
                    <p style="color: #666666; font-size: 0.8em; margin: 15px 0 5px;">© 2024 Indian Error Cyber Army. All rights reserved.</p>
                    <p style="color: #00ff41; font-size: 0.8em; margin: 5px 0; font-weight: bold;">Built with ❤️ for India's Digital Security</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
    
    generateAutoReplyEmailTemplate(contact) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>IECA - Message Received</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0a0a0a; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border: 2px solid #0066cc; border-radius: 10px; overflow: hidden;">
                <!-- Header -->
                <div style="background: rgba(0, 102, 204, 0.1); padding: 30px; text-align: center; border-bottom: 1px solid #0066cc;">
                    <h1 style="color: #0066cc; margin: 0; text-shadow: 0 0 10px #0066cc; font-size: 2.5em;">IECA</h1>
                    <p style="color: #cccccc; margin: 10px 0 0; font-size: 1.1em;">Support Team</p>
                    <p style="color: #888888; margin: 5px 0 0; font-size: 0.9em;">We'll respond within 24 hours</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                    <h2 style="color: #0066cc; margin-top: 0; text-align: center;">📨 Message Received Successfully</h2>
                    
                    <p style="color: #cccccc; font-size: 1.1em;">Dear <strong style="color: #0066cc;">${contact.contactName}</strong>,</p>
                    
                    <p style="color: #cccccc;">Thank you for contacting IECA (Indian Error Cyber Army). We have successfully received your message and our team will respond within 24 hours.</p>
                    
                    <!-- Message Details -->
                    <div style="background: rgba(0, 102, 204, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #0066cc; margin: 25px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">📋 Your Message Details</h3>
                        <table style="width: 100%; color: #cccccc;">
                            <tr><td style="padding: 5px 0;"><strong>Reference ID:</strong></td><td style="color: #0066cc;">${contact.id}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Name:</strong></td><td>${contact.contactName}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td>${contact.contactEmail}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Subject:</strong></td><td>${contact.contactSubject}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Submitted:</strong></td><td>${contact.submittedDate}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Status:</strong></td><td style="color: #00ff41;">Under Review</td></tr>
                        </table>
                    </div>
                    
                    <!-- Contact Information -->
                    <h3 style="color: #0066cc;">📞 Need Immediate Assistance?</h3>
                    <div style="background: rgba(255, 170, 0, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #ffaa00;">
                        <p style="color: #cccccc; margin-top: 0;">For urgent matters, you can reach us directly:</p>
                        <ul style="color: #cccccc; margin: 10px 0; padding-left: 20px;">
                            <li><strong style="color: #ff0040;">🚨 Security Emergencies:</strong> security@ieca.in</li>
                            <li><strong style="color: #0066cc;">💼 General Business:</strong> contact@ieca.in</li>
                            <li><strong style="color: #00ff41;">🎓 Training Inquiries:</strong> training@ieca.in</li>
                            <li><strong style="color: #ffaa00;">👨‍💻 Technical Support:</strong> support@ieca.in</li>
                        </ul>
                    </div>
                    
                    <p style="color: #cccccc; text-align: center; margin-top: 30px;">Thank you for your interest in IECA. We're committed to protecting Digital India and appreciate your engagement with our mission.</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #888888; margin: 5px 0;">Best regards,</p>
                        <p style="color: #0066cc; font-weight: bold; margin: 5px 0;">IECA Support Team</p>
                        <p style="color: #cccccc; font-weight: bold; margin: 5px 0;">Indian Error Cyber Army</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: rgba(0, 102, 204, 0.05); padding: 20px; text-align: center; border-top: 1px solid rgba(0, 102, 204, 0.2);">
                    <p style="color: #888888; font-size: 0.9em; margin: 5px 0;">This is an automated response from IECA Support</p>
                    <p style="color: #888888; font-size: 0.8em; margin: 5px 0;">Reference ID: ${contact.id} | Expected Response: Within 24 hours</p>
                    <p style="color: #666666; font-size: 0.8em; margin: 15px 0 5px;">© 2024 Indian Error Cyber Army. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
    
    // Periodic tasks
    setupPeriodicTasks() {
        // Clean up old sessions every hour
        setInterval(() => {
            this.cleanupExpiredSessions();
        }, 3600000); // 1 hour
        
        // Generate sample data for demo (only in development)
        if (this.storage.applications.length === 0) {
            this.generateSampleData();
        }
    }
    
    cleanupExpiredSessions() {
        const now = Date.now();
        const validSessions = this.storage.adminSessions.filter(session => session.expiresAt > now);
        
        if (validSessions.length !== this.storage.adminSessions.length) {
            this.storage.adminSessions = validSessions;
            this.saveToStorage('adminSessions');
            console.log('🧹 Cleaned up expired admin sessions');
        }
    }
    
    generateSampleData() {
        console.log('📊 Generating sample data for demonstration...');
        
        // Sample applications
        const sampleApplications = [
            {
                id: this.generateId(),
                fullName: 'Raj Kumar',
                email: 'raj.kumar@example.com',
                phone: '9876543210',
                age: 28,
                location: 'Mumbai, Maharashtra',
                experience: '3-5',
                skills: 'Penetration Testing, Network Security, Ethical Hacking',
                motivation: 'I want to serve my country by protecting its digital infrastructure from cyber threats.',
                status: 'pending',
                submittedAt: Date.now() - 86400000, // 1 day ago
                submittedDate: this.formatDateTime(new Date(Date.now() - 86400000))
            },
            {
                id: this.generateId(),
                fullName: 'Priya Sharma',
                email: 'priya.sharma@example.com',
                phone: '8765432109',
                age: 25,
                location: 'Delhi, Delhi',
                experience: '1-3',
                skills: 'Malware Analysis, Digital Forensics, Incident Response',
                motivation: 'I am passionate about cybersecurity and want to be part of India\'s elite cyber defense team.',
                status: 'approved',
                submittedAt: Date.now() - 172800000, // 2 days ago
                submittedDate: this.formatDateTime(new Date(Date.now() - 172800000))
            }
        ];
        
        // Sample contacts
        const sampleContacts = [
            {
                id: this.generateId(),
                contactName: 'Vikash Singh',
                contactEmail: 'vikash.singh@company.com',
                contactSubject: 'services',
                contactMessage: 'We need cybersecurity consulting for our startup. Can you help?',
                status: 'new',
                submittedAt: Date.now() - 43200000, // 12 hours ago
                submittedDate: this.formatDateTime(new Date(Date.now() - 43200000))
            }
        ];
        
        this.storage.applications = sampleApplications;
        this.storage.contacts = sampleContacts;
        
        this.saveToStorage('applications');
        this.saveToStorage('contacts');
        
        console.log('✅ Sample data generated successfully');
    }
    
    initializeAdminUser() {
        console.log('👑 Admin user initialized: yashabalam707@gmail.com');
    }
    
    // Utility methods
    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
    
    formatDateTime(date = new Date()) {
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    createSuccessResponse(data) {
        return {
            status: 200,
            data: {
                success: true,
                data,
                timestamp: Date.now()
            }
        };
    }
    
    createErrorResponse(message, status = 400) {
        return {
            status,
            data: {
                success: false,
                error: message,
                timestamp: Date.now()
            }
        };
    }
    
    saveToStorage(key) {
        try {
            localStorage.setItem(`ieca_${key}`, JSON.stringify(this.storage[key]));
        } catch (error) {
            console.error(`❌ Failed to save ${key} to localStorage:`, error);
        }
    }
}

// Initialize backend simulation when script loads
if (typeof window !== 'undefined') {
    window.iecaBackend = new IECABackendSimulation();
    console.log('🔧 IECA Backend Simulation ready for development');
}
