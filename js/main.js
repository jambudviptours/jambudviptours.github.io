// main.js - Jambudvip Tours & Travels
// Vanilla JavaScript for core functionality

// ===== GLOBAL VARIABLES & CONSTANTS =====
const DOM = {
    body: document.body,
    html: document.documentElement
};

const CONFIG = {
    whatsappNumber: '+919876543210',
    whatsappMessage: 'Hello, I\'d like to plan a trip...',
    businessEmail: 'info@jambudviptours.com',
    businessPhone: '+919876543210',
    businessHours: '9 AM - 9 PM, Mon-Sun'
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Get element by selector
    $: function(selector, parent = document) {
        return parent.querySelector(selector);
    },

    // Get all elements by selector
    $$: function(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    // Generate WhatsApp URL
    getWhatsAppURL: function(number = CONFIG.whatsappNumber, message = CONFIG.whatsappMessage) {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${number.replace('+', '')}?text=${encodedMessage}`;
    },

    // Generate tel: URL
    getTelURL: function(number = CONFIG.businessPhone) {
        return `tel:${number}`;
    },

    // Generate mailto: URL
    getMailtoURL: function(email = CONFIG.businessEmail, subject = 'Travel Inquiry') {
        return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    },

    // Add event listener with multiple events
    on: function(element, events, handler, options = {}) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, handler, options);
        });
    },

    // Remove event listener
    off: function(element, events, handler, options = {}) {
        events.split(' ').forEach(event => {
            element.removeEventListener(event, handler, options);
        });
    },

    // Toggle class
    toggleClass: function(element, className, condition) {
        if (condition === undefined) {
            element.classList.toggle(className);
        } else {
            element.classList[condition ? 'add' : 'remove'](className);
        }
    },

    // Create element
    createElement: function(tag, attributes = {}, text = '') {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        if (text) element.textContent = text;
        return element;
    }
};

// ===== MOBILE MENU HANDLER =====
const MobileMenu = {
    init: function() {
        this.hamburger = Utils.$('.hamburger');
        this.mobileMenu = Utils.$('.mobile-menu');
        this.navLinks = Utils.$$('.mobile-nav a');
        
        if (!this.hamburger || !this.mobileMenu) return;
        
        this.bindEvents();
    },

    bindEvents: function() {
        Utils.on(this.hamburger, 'click', this.toggleMenu.bind(this));
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            Utils.on(link, 'click', this.closeMenu.bind(this));
        });

        // Close menu when clicking outside
        Utils.on(document, 'click', (e) => {
            if (!this.mobileMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close on escape key
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
    },

    toggleMenu: function() {
        Utils.toggleClass(this.hamburger, 'active');
        Utils.toggleClass(this.mobileMenu, 'active');
        Utils.toggleClass(DOM.body, 'menu-open');
    },

    openMenu: function() {
        this.hamburger.classList.add('active');
        this.mobileMenu.classList.add('active');
        DOM.body.classList.add('menu-open');
    },

    closeMenu: function() {
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        DOM.body.classList.remove('menu-open');
    }
};

// ===== STICKY HEADER =====
const StickyHeader = {
    init: function() {
        this.header = Utils.$('header');
        if (!this.header) return;
        
        this.lastScroll = 0;
        this.scrollThreshold = 100;
        
        this.bindEvents();
    },

    bindEvents: function() {
        window.addEventListener('scroll', Utils.throttle(this.handleScroll.bind(this), 100));
    },

    handleScroll: function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            this.header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > this.lastScroll && currentScroll > this.scrollThreshold) {
            // Scroll Down
            this.header.classList.remove('scroll-down');
            this.header.classList.add('scroll-up');
        } else if (currentScroll < this.lastScroll) {
            // Scroll Up
            this.header.classList.remove('scroll-up');
            this.header.classList.add('scroll-down');
        }
        
        this.lastScroll = currentScroll;
    }
};

// ===== SMOOTH SCROLL =====
const SmoothScroll = {
    init: function() {
        // Handle anchor links
        Utils.$$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleAnchorClick.bind(this));
        });
    },

    handleAnchorClick: function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = Utils.$(href);
        if (!target) return;
        
        e.preventDefault();
        
        const headerHeight = Utils.$('header') ? Utils.$('header').offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without page jump
        history.pushState(null, null, href);
    }
};

// ===== COUNTER ANIMATION =====
const CounterAnimation = {
    init: function() {
        this.counters = Utils.$$('.counter-number');
        if (this.counters.length === 0) return;
        
        this.observer = this.createObserver();
        this.counters.forEach(counter => this.observer.observe(counter));
    },

    createObserver: function() {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '50px'
        });
    },

    animateCounter: function(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const suffix = element.textContent.replace(/[0-9]/g, '');
        const duration = 2000; // 2 seconds
        const step = 20; // ms
        const increment = target / (duration / step);
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
        }, step);
    }
};

// ===== ACCORDION =====
const Accordion = {
    init: function() {
        this.accordions = Utils.$$('.accordion');
        if (this.accordions.length === 0) return;
        
        this.accordions.forEach(accordion => this.initAccordion(accordion));
    },

    initAccordion: function(accordion) {
        const headers = Utils.$$('.accordion-header', accordion);
        
        headers.forEach(header => {
            Utils.on(header, 'click', () => {
                this.toggleAccordion(header);
            });
        });
        
        // Open first item by default
        if (headers.length > 0) {
            this.toggleAccordion(headers[0], true);
        }
    },

    toggleAccordion: function(header, forceOpen = false) {
        const content = header.nextElementSibling;
        const isActive = header.classList.contains('active');
        
        // Close all other items in the same accordion
        if (!isActive) {
            const parent = header.closest('.accordion');
            const activeHeaders = Utils.$$('.accordion-header.active', parent);
            activeHeaders.forEach(activeHeader => {
                if (activeHeader !== header) {
                    this.closeAccordion(activeHeader);
                }
            });
        }
        
        if (forceOpen || !isActive) {
            this.openAccordion(header);
        } else {
            this.closeAccordion(header);
        }
    },

    openAccordion: function(header) {
        const content = header.nextElementSibling;
        header.classList.add('active');
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
    },

    closeAccordion: function(header) {
        const content = header.nextElementSibling;
        header.classList.remove('active');
        content.classList.remove('active');
        content.style.maxHeight = '0';
    }
};

// ===== TABS =====
const Tabs = {
    init: function() {
        this.tabContainers = Utils.$$('.tabs');
        if (this.tabContainers.length === 0) return;
        
        this.tabContainers.forEach(container => this.initTabs(container));
    },

    initTabs: function(container) {
        const tabButtons = Utils.$$('.tab-button', container);
        const tabPanes = Utils.$$('.tab-pane', container);
        
        tabButtons.forEach((button, index) => {
            Utils.on(button, 'click', () => {
                this.switchTab(container, button.dataset.tab || index);
            });
            
            // Set active tab from URL hash or first tab
            if (button.classList.contains('active')) {
                this.showTab(container, button.dataset.tab || index);
            }
        });
        
        // If no active tab, activate first one
        if (!Utils.$('.tab-button.active', container)) {
            this.switchTab(container, tabButtons[0].dataset.tab || 0);
        }
    },

    switchTab: function(container, tabId) {
        const tabButtons = Utils.$$('.tab-button', container);
        const tabPanes = Utils.$$('.tab-pane', container);
        
        // Deactivate all
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Activate selected
        const button = Array.from(tabButtons).find(btn => 
            btn.dataset.tab === tabId || tabButtons.indexOf(btn) === parseInt(tabId)
        );
        const pane = Array.from(tabPanes).find(p => 
            p.dataset.tab === tabId || tabPanes.indexOf(p) === parseInt(tabId)
        );
        
        if (button && pane) {
            button.classList.add('active');
            pane.classList.add('active');
            
            // Update URL hash
            if (container.id) {
                history.replaceState(null, null, `#${container.id}-${tabId}`);
            }
        }
    },

    showTab: function(container, tabId) {
        this.switchTab(container, tabId);
    }
};


// ===== PACKAGE FILTER =====
const PackageFilter = {
    init: function() {
        // Only initialize if this is not the packages page
        if (window.location.pathname.includes('packages.html')) {
            return; // Let the inline script handle packages page
        }
        
        this.filterButtons = document.querySelectorAll('.filter-button');
        this.packageCards = document.querySelectorAll('.package-card');
        if (this.filterButtons.length === 0 || this.packageCards.length === 0) return;
        
        this.bindEvents();
        this.showAll();
    },

    bindEvents: function() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterPackages(button.dataset.filter);
            });
        });
    },

    filterPackages: function(category) {
        // Update active button
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Filter packages
        this.packageCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    },

    showAll: function() {
        const allButton = Array.from(this.filterButtons).find(btn => btn.dataset.filter === 'all');
        if (allButton) {
            allButton.classList.add('active');
        }
    }
};

// ===== TESTIMONIAL CAROUSEL =====
const TestimonialCarousel = {
    init: function() {
        this.carousel = document.querySelector('.testimonial-carousel');
        if (!this.carousel) return;
        
        this.cards = document.querySelectorAll('.testimonial-card');
        if (this.cards.length <= 1) return;
        
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        
        this.createControls();
        this.bindEvents();
        this.startAutoSlide();
    },

    createControls: function() {
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev';
        prevBtn.setAttribute('aria-label', 'Previous testimonial');
        prevBtn.innerHTML = '‹';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next';
        nextBtn.setAttribute('aria-label', 'Next testimonial');
        nextBtn.innerHTML = '›';
        
        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        this.carousel.parentNode.appendChild(controls);
        
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
    },

    bindEvents: function() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause auto-slide on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    },

    nextSlide: function() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateSlide();
    },

    prevSlide: function() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateSlide();
    },

    updateSlide: function() {
        const offset = -this.currentIndex * 100;
        this.carousel.style.transform = `translateX(${offset}%)`;
        
        // Update active state
        this.cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentIndex);
        });
    },

    startAutoSlide: function() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    },

    stopAutoSlide: function() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize these on non-packages pages
    if (!window.location.pathname.includes('packages.html')) {
        PackageFilter.init();
        TestimonialCarousel.init();
    }
});



// ===== LAZY LOADING =====
const LazyLoad = {
    init: function() {
        if ('IntersectionObserver' in window) {
            this.initIntersectionObserver();
        } else {
            this.loadAllImages(); // Fallback
        }
    },

    initIntersectionObserver: function() {
        const images = Utils.$$('img[data-src]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => observer.observe(img));
    },

    loadImage: function(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    },

    loadAllImages: function() {
        Utils.$$('img[data-src]').forEach(img => this.loadImage(img));
    }
};

// ===== WHATSAPP INTEGRATION =====
const WhatsAppIntegration = {
    init: function() {
        this.whatsappButtons = Utils.$$('[data-whatsapp]');
        this.bindEvents();
    },

    bindEvents: function() {
        this.whatsappButtons.forEach(button => {
            Utils.on(button, 'click', (e) => {
                if (button.tagName === 'A' && button.href) return;
                e.preventDefault();
                this.openWhatsApp(button);
            });
        });
    },

    openWhatsApp: function(button) {
        const number = button.dataset.whatsappNumber || CONFIG.whatsappNumber;
        const message = button.dataset.whatsappMessage || CONFIG.whatsappMessage;
        const url = Utils.getWhatsAppURL(number, message);
        
        window.open(url, '_blank');
        
        // Track conversion (placeholder for analytics)
        this.trackConversion('whatsapp_click', button.textContent.trim());
    },

    trackConversion: function(action, label) {
        // This would integrate with Google Analytics or similar
        console.log(`Conversion tracked: ${action} - ${label}`);
        // Example: gtag('event', action, { 'event_label': label });
    }
};

// ===== BACK TO TOP BUTTON =====
const BackToTop = {
    init: function() {
        this.button = Utils.createElement('button', {
            class: 'back-to-top',
            'aria-label': 'Back to top'
        }, '↑');
        
        DOM.body.appendChild(this.button);
        
        this.bindEvents();
        this.toggleVisibility();
    },

    bindEvents: function() {
        Utils.on(this.button, 'click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', Utils.throttle(() => {
            this.toggleVisibility();
        }, 100));
    },

    toggleVisibility: function() {
        const scrollTop = window.pageYOffset || DOM.documentElement.scrollTop;
        this.button.classList.toggle('visible', scrollTop > 500);
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    MobileMenu.init();
    StickyHeader.init();
    SmoothScroll.init();
    CounterAnimation.init();
    Accordion.init();
    Tabs.init();
    PackageFilter.init();
    TestimonialCarousel.init();
    FormValidation.init();
    LazyLoad.init();
    WhatsAppIntegration.init();
    BackToTop.init();
    
    // Set current year in footer
    const yearElement = Utils.$('[data-current-year]');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize all tooltips
    Utils.$$('[title]').forEach(element => {
        element.setAttribute('aria-label', element.title);
    });
    
    console.log('Jambudvip Tours & Travels website initialized');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    // You could send this to an error tracking service
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navEntry = perfEntries[0];
                console.log('Page load time:', navEntry.loadEventEnd - navEntry.startTime, 'ms');
            }
        }, 0);
    });
}