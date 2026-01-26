// Components JavaScript for Jambudvip Tours & Travels

// Carousel functionality for Featured Tours
class Carousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.track = this.container.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.nextButton = this.container.querySelector('.carousel-btn-next');
        this.prevButton = this.container.querySelector('.carousel-btn-prev');
        this.indicators = Array.from(this.container.querySelectorAll('.carousel-indicator'));
        
        this.currentSlide = 0;
        this.slideWidth = this.slides[0].getBoundingClientRect().width;
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        // Set slide positions
        this.setSlidePositions();
        
        // Add event listeners for buttons
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.moveToNextSlide());
        }
        
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.moveToPrevSlide());
        }
        
        // Add event listeners for indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.moveToSlide(index));
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.slideWidth = this.slides[0].getBoundingClientRect().width;
            this.setSlidePositions();
            this.updateSlidePosition();
        });
        
        // Auto slide on desktop
        if (window.innerWidth >= 768) {
            this.startAutoSlide();
            
            // Pause auto slide on hover
            this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.container.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }
    
    setSlidePositions() {
        this.slides.forEach((slide, index) => {
            slide.style.left = `${this.slideWidth * index}px`;
        });
    }
    
    updateSlidePosition() {
        this.track.style.transform = `translateX(-${this.currentSlide * this.slideWidth}px)`;
        this.updateIndicators();
    }
    
    moveToNextSlide() {
        if (this.currentSlide === this.slides.length - 1) {
            this.currentSlide = 0;
        } else {
            this.currentSlide++;
        }
        this.updateSlidePosition();
        this.resetAutoSlide();
    }
    
    moveToPrevSlide() {
        if (this.currentSlide === 0) {
            this.currentSlide = this.slides.length - 1;
        } else {
            this.currentSlide--;
        }
        this.updateSlidePosition();
        this.resetAutoSlide();
    }
    
    moveToSlide(index) {
        this.currentSlide = index;
        this.updateSlidePosition();
        this.resetAutoSlide();
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) return;
        this.autoSlideInterval = setInterval(() => {
            this.moveToNextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}



// Smooth Scroll for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle all anchor links that start with #
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if it's just "#" or if it's a different page anchor
                if (href === '#' || href.includes('.html#')) return;
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileNav');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        const menuBtn = document.getElementById('mobileMenuBtn');
                        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
                    }
                    
                    // Calculate scroll position
                    const headerHeight = document.querySelector('#main-header').offsetHeight;
                    const extraPadding = 20;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraPadding;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Carousel
    const carousel = new Carousel('.tours-carousel');
    
    // Initialize Trust Strip
    const trustStrip = new TrustStrip();
    
    // Initialize Mobile Menu
    const mobileMenu = new MobileMenu();
    
    // Initialize Smooth Scroll
    const smoothScroll = new SmoothScroll();
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add animation to trust numbers on scroll
    const animatedCounters = () => {
        const counters = document.querySelectorAll('.trust-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            if (isNaN(target)) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(counter, target);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    };
    
    // Call the function
    animatedCounters();
    
    // Counter animation function
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50; // Adjust speed
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
});

// Animated Counter for About Page
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.speed = 200; // Lower is faster
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        // Intersection Observer to trigger animation when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateAllCounters();
                    observer.disconnect(); // Stop observing after animation
                }
            });
        }, { threshold: 0.5 });
        
        // Observe the experience section
        const experienceSection = document.querySelector('.our-experience');
        if (experienceSection) {
            observer.observe(experienceSection);
        }
    }
    
    animateAllCounters() {
        this.counters.forEach(counter => {
            this.animateCounter(counter);
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = +counter.innerText;
        const increment = target / this.speed;
        
        const updateCounter = () => {
            const currentCount = +counter.innerText;
            
            if (currentCount < target) {
                counter.innerText = Math.ceil(currentCount + increment);
                setTimeout(updateCounter, 10);
            } else {
                // Add appropriate suffix
                this.addCounterSuffix(counter, target);
            }
        };
        
        updateCounter();
    }
    
    addCounterSuffix(counter, target) {
        if (target === 1400 || target === 50) {
            counter.innerText = target + '+';
        } else if (target === 100) {
            counter.innerText = target + '%';
        } else if (target === 4) {
            counter.innerText = target + '+';
        } else {
            counter.innerText = target;
        }
    }
}



// Initialize counter animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Counter Animation
    const counterAnimation = new CounterAnimation();
    
    // ... rest of existing initialization code
});

// Service Accordion for Services Page
class ServiceAccordion {
    constructor() {
        this.learnMoreButtons = document.querySelectorAll('.btn-learn-more');
        this.init();
    }
    
    init() {
        if (this.learnMoreButtons.length === 0) return;
        
        this.learnMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => this.toggleAccordion(e));
        });
        
        // Close all accordions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.service-detailed-card')) {
                this.closeAllAccordions();
            }
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllAccordions();
            }
        });
    }
    
    toggleAccordion(e) {
        e.stopPropagation();
        
        const button = e.currentTarget;
        const serviceId = button.getAttribute('data-service');
        const expandableContent = document.getElementById(`expand-${serviceId}`);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Close all other accordions
        if (!isExpanded) {
            this.closeAllAccordions();
        }
        
        // Toggle current accordion
        if (isExpanded) {
            this.closeAccordion(button, expandableContent);
        } else {
            this.openAccordion(button, expandableContent);
        }
    }
    
    openAccordion(button, content) {
        button.setAttribute('aria-expanded', 'true');
        content.hidden = false;
        
        // Update icon and text
        const icon = button.querySelector('.learn-more-icon');
        const text = button.querySelector('.learn-more-text');
        
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
        text.textContent = 'Show Less';
        
        // Add animation class
        content.classList.add('expanding');
        
        // Scroll to content for better UX
        setTimeout(() => {
            content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        // Remove animation class after transition
        setTimeout(() => {
            content.classList.remove('expanding');
        }, 300);
    }
    
    closeAccordion(button, content) {
        button.setAttribute('aria-expanded', 'false');
        
        // Update icon and text
        const icon = button.querySelector('.learn-more-icon');
        const text = button.querySelector('.learn-more-text');
        
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        text.textContent = 'Learn More';
        
        // Add animation class
        content.classList.add('collapsing');
        
        // Hide content after transition
        setTimeout(() => {
            content.hidden = true;
            content.classList.remove('collapsing');
        }, 300);
    }
    
    closeAllAccordions() {
        this.learnMoreButtons.forEach(button => {
            const serviceId = button.getAttribute('data-service');
            const expandableContent = document.getElementById(`expand-${serviceId}`);
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded && expandableContent) {
                this.closeAccordion(button, expandableContent);
            }
        });
    }
}

// Initialize service accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Service Accordion
    const serviceAccordion = new ServiceAccordion();
    
    // ... rest of existing initialization code
});







// Testimonials Scroller for Why Choose Us Page
class TestimonialsScroller {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.prevButton = document.querySelector('.scroller-prev');
        this.nextButton = document.querySelector('.scroller-next');
        this.indicators = document.querySelectorAll('.scroller-indicator');
        
        this.currentSlide = 0;
        this.slideWidth = this.slides[0] ? this.slides[0].offsetWidth : 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.track || this.slides.length === 0) return;
        
        // Set initial position
        this.updateSliderPosition();
        
        // Add event listeners for buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.moveToPrevSlide());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.moveToNextSlide());
        }
        
        // Add event listeners for indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.moveToSlide(index));
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.slideWidth = this.slides[0].offsetWidth;
            this.updateSliderPosition();
        });
        
        // Auto slide on desktop
        if (window.innerWidth >= 768) {
            this.startAutoSlide();
            
            // Pause auto slide on hover
            const scroller = document.querySelector('.testimonials-scroller');
            if (scroller) {
                scroller.addEventListener('mouseenter', () => this.stopAutoSlide());
                scroller.addEventListener('mouseleave', () => this.startAutoSlide());
            }
        }
    }
    
    updateSliderPosition() {
        if (!this.track) return;
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateIndicators();
    }
    
    moveToNextSlide() {
        if (this.currentSlide === this.totalSlides - 1) {
            this.currentSlide = 0;
        } else {
            this.currentSlide++;
        }
        this.updateSliderPosition();
        this.resetAutoSlide();
    }
    
    moveToPrevSlide() {
        if (this.currentSlide === 0) {
            this.currentSlide = this.totalSlides - 1;
        } else {
            this.currentSlide--;
        }
        this.updateSliderPosition();
        this.resetAutoSlide();
    }
    
    moveToSlide(index) {
        this.currentSlide = index;
        this.updateSliderPosition();
        this.resetAutoSlide();
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) return;
        this.autoSlideInterval = setInterval(() => {
            this.moveToNextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Animation Observer for Differentiator Rows
class AnimationObserver {
    constructor() {
        this.differentiatorRows = document.querySelectorAll('.differentiator-row');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        if (this.differentiatorRows.length > 0) {
            this.setupDifferentiatorObserver();
        }
        
        if (this.statNumbers.length > 0) {
            this.setupStatsObserver();
        }
    }
    
    setupDifferentiatorObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.differentiatorRows.forEach(row => {
            observer.observe(row);
        });
    }
    
    setupStatsObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    if (!stat.classList.contains('animated')) {
                        this.animateStatNumber(stat);
                        stat.classList.add('animated');
                    }
                }
            });
        }, { threshold: 0.5 });
        
        this.statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    animateStatNumber(element) {
        const text = element.textContent;
        
        // Extract number from text (handles formats like "1400+", "4.8★", "100%")
        const match = text.match(/(\d+(\.\d+)?)/);
        if (!match) return;
        
        const targetValue = parseFloat(match[0]);
        const suffix = text.replace(match[0], ''); // Get the suffix (+, ★, %, etc.)
        
        let current = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                element.textContent = Math.round(targetValue) + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current) + suffix;
            }
        }, 30);
    }
}

// Initialize Why Choose Us components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Testimonials Scroller
    const testimonialsScroller = new TestimonialsScroller();
    
    // Initialize Animation Observer
    const animationObserver = new AnimationObserver();
    
    // ... rest of existing initialization code
});






// Policies Navigation for Policies Page
class PoliciesNavigation {
    constructor() {
        this.policyTabs = document.querySelectorAll('.policy-tab');
        this.policySections = document.querySelectorAll('.policy-section');
        this.accordionNavHeader = document.querySelector('.accordion-nav-header');
        this.accordionNavContent = document.querySelector('.accordion-nav-content');
        this.accordionButtons = document.querySelectorAll('.policy-accordion-btn');
        this.bookingSteps = document.querySelectorAll('.booking-step');
        
        this.init();
    }
    
    init() {
        // Initialize Desktop Tabs
        if (this.policyTabs.length > 0) {
            this.policyTabs.forEach(tab => {
                tab.addEventListener('click', (e) => this.handleTabClick(e));
            });
        }
        
        // Initialize Mobile Accordion Navigation
        if (this.accordionNavHeader && this.accordionNavContent) {
            this.setupAccordionNavigation();
        }
        
        // Handle URL hash for direct policy section access
        this.handleHashNavigation();
        
        // Setup booking steps animation
        if (this.bookingSteps.length > 0) {
            this.setupBookingStepsAnimation();
        }
    }
    
    handleTabClick(event) {
        const tab = event.currentTarget;
        const policyId = tab.getAttribute('data-policy');
        
        // Update active tab
        this.policyTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update mobile accordion to match
        this.accordionButtons.forEach(btn => {
            if (btn.getAttribute('data-policy') === policyId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show selected section
        this.showPolicySection(policyId);
    }
    
    setupAccordionNavigation() {
        this.accordionNavHeader.addEventListener('click', () => {
            this.accordionNavContent.classList.toggle('active');
            const icon = this.accordionNavHeader.querySelector('i');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        });
        
        // Initialize accordion buttons
        this.accordionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const policyId = button.getAttribute('data-policy');
                
                // Update active button
                this.accordionButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update desktop tabs to match
                this.policyTabs.forEach(tab => {
                    if (tab.getAttribute('data-policy') === policyId) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
                
                // Show selected section
                this.showPolicySection(policyId);
                
                // Close accordion
                this.accordionNavContent.classList.remove('active');
                const icon = this.accordionNavHeader.querySelector('i');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            });
        });
    }
    
    showPolicySection(policyId) {
        this.policySections.forEach(section => {
            if (section.id === policyId) {
                section.classList.add('active');
                section.hidden = false;
                // Smooth scroll to section
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                section.classList.remove('active');
                section.hidden = true;
            }
        });
    }
    
    handleHashNavigation() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection && targetSection.classList.contains('policy-section')) {
                const policyId = targetSection.id;
                
                // Update desktop tabs
                this.policyTabs.forEach(tab => {
                    if (tab.getAttribute('data-policy') === policyId) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
                
                // Update mobile accordion
                this.accordionButtons.forEach(btn => {
                    if (btn.getAttribute('data-policy') === policyId) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                
                // Show section
                this.showPolicySection(policyId);
            }
        }
    }
    
    setupBookingStepsAnimation() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    stepObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.bookingSteps.forEach(step => {
            stepObserver.observe(step);
        });
    }
}

// Initialize policies navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Policies Navigation
    const policiesNavigation = new PoliciesNavigation();
    
    // ... rest of existing initialization code
});