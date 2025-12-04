// Portfolio V2 Script

// Navigation & Mobile Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 15, 28, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.background = 'rgba(10, 15, 28, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Chat Widget Functionality
const chatFloatBtn = document.getElementById('chatFloatBtn');
const heroChatBtn = document.getElementById('heroChatBtn');
const chatModal = document.getElementById('chatModal');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// Toggle Chat
if (chatFloatBtn) {
    chatFloatBtn.addEventListener('click', () => {
        chatModal.classList.toggle('active');
        if (chatModal.classList.contains('active')) {
            chatInput.focus();
        }
    });
}

if (heroChatBtn) {
    heroChatBtn.addEventListener('click', () => {
        chatModal.classList.add('active');
        chatInput.focus();
    });
}

if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
        chatModal.classList.remove('active');
    });
}

// Firebase Function URL (Same as V1)
const FIREBASE_FUNCTION_URL = 'https://us-central1-portfolio-291a4.cloudfunctions.net/chatWithGemini';
let conversationHistory = [];

// Add Message to Chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    // Simple markdown parsing for bot messages
    if (!isUser) {
        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Lists
        text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');
        // Line breaks
        text = text.replace(/\n/g, '<br>');
    }

    messageDiv.innerHTML = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Chat Submit
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add User Message
        addMessage(message, true);
        chatInput.value = '';

        // Add to history
        conversationHistory.push({ role: 'user', content: message });

        // Show Typing Indicator (simulated)
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = 'Typing...';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(FIREBASE_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: conversationHistory.slice(-5)
                })
            });

            const data = await response.json();

            // Remove typing indicator
            chatMessages.removeChild(typingDiv);

            if (data.reply) {
                addMessage(data.reply, false);
                conversationHistory.push({ role: 'assistant', content: data.reply });
            } else {
                addMessage("Sorry, I'm having trouble connecting right now.", false);
            }

        } catch (error) {
            console.error('Chat Error:', error);
            chatMessages.removeChild(typingDiv);
            addMessage("Sorry, something went wrong. Please try again later.", false);
        }
    });
}

// EmailJS Contact Form
const contactForm = document.getElementById('contactForm');
const EMAILJS_SERVICE_ID = 'service_0sif2p5';
const EMAILJS_TEMPLATE_ID = 'template_7wsg2ip';
const EMAILJS_PUBLIC_KEY = 'f6ub74GVTg_96qf8Q';

(function () {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
            .then(function () {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#10b981'; // Success green
                contactForm.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, function (error) {
                console.log('FAILED...', error);
                btn.textContent = 'Failed to Send';
                btn.style.background = '#ef4444'; // Error red
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
    });
}

// Projects Tabs
const projectTabs = document.querySelectorAll('.projects-tab');
const projectTabContents = document.querySelectorAll('.projects-tab-content');

if (projectTabs.length && projectTabContents.length) {
    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            projectTabs.forEach(t => t.classList.remove('active'));
            projectTabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            const targetContent = document.getElementById(`projects-${target}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Expandable Project Cards
function toggleProject(element) {
    element.classList.toggle('expanded');
}