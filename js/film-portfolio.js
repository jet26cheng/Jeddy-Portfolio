// Film Strip Portfolio - Main JavaScript

(function() {
    'use strict';

    // State management
    const state = {
        currentSection: 'home',
        isTransitioning: false
    };

    // DOM elements
    const filmPanels = document.querySelectorAll('.film-panel');
    const contentSections = document.querySelectorAll('.content-section');
    const mainContent = document.getElementById('main-content');
    const contactForm = document.getElementById('contact-form');

    // Initialize
    function init() {
        // Set initial active section from URL hash or default to home
        const hash = window.location.hash.slice(1);
        const initialSection = hash && document.getElementById(hash) ? hash : 'home';
        switchSection(initialSection, false);

        // Attach event listeners
        filmPanels.forEach(panel => {
            panel.addEventListener('click', handlePanelClick);
            panel.addEventListener('keydown', handlePanelKeydown);
        });

        // Handle browser back/forward
        window.addEventListener('popstate', handlePopState);

        // Handle contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Keyboard navigation (arrow keys)
        document.addEventListener('keydown', handleGlobalKeydown);

        // First visit tooltip (optional - can be removed)
        showFirstVisitHint();
    }

    // Panel click handler
    function handlePanelClick(e) {
        e.preventDefault();
        const panel = e.currentTarget;
        const section = panel.getAttribute('data-section');
        
        if (section && section !== state.currentSection && !state.isTransitioning) {
            switchSection(section, true);
        }
    }

    // Keyboard navigation for panels
    function handlePanelKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
        }
    }

    // Global keyboard navigation (arrow keys)
    function handleGlobalKeydown(e) {
        if (state.isTransitioning) return;

        const sections = ['home', 'about', 'experience', 'projects', 'contact'];
        const currentIndex = sections.indexOf(state.currentSection);

        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            switchSection(sections[currentIndex - 1], true);
        } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
            e.preventDefault();
            switchSection(sections[currentIndex + 1], true);
        }
    }

    // Browser back/forward handler
    function handlePopState(e) {
        const hash = window.location.hash.slice(1);
        const section = hash && document.getElementById(hash) ? hash : 'home';
        switchSection(section, false);
    }

    // Switch section with animation
    function switchSection(sectionId, animate = true) {
        if (state.isTransitioning) return;

        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        state.isTransitioning = true;
        state.currentSection = sectionId;

        // Update URL without page reload
        window.history.pushState({ section: sectionId }, '', `#${sectionId}`);

        // Update active panel
        filmPanels.forEach(panel => {
            if (panel.getAttribute('data-section') === sectionId) {
                panel.classList.add('active');
                panel.setAttribute('aria-current', 'page');
            } else {
                panel.classList.remove('active');
                panel.removeAttribute('aria-current');
            }
        });

        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section with animation
        if (animate) {
            targetSection.classList.add('expanding');
            setTimeout(() => {
                targetSection.classList.add('active');
                // Focus on first focusable element in section for keyboard navigation
                focusSection(targetSection);
                // Announce to screen readers
                announceSectionChange(sectionId);
            }, 50);
            
            setTimeout(() => {
                targetSection.classList.remove('expanding');
                state.isTransitioning = false;
            }, 600);
        } else {
            targetSection.classList.add('active');
            // Focus on first focusable element in section for keyboard navigation
            focusSection(targetSection);
            state.isTransitioning = false;
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Focus section for keyboard navigation
    function focusSection(section) {
        // Try to focus on the first heading in the section (most semantic)
        const firstHeading = section.querySelector('h1, h2, h3, h4, h5, h6');
        if (firstHeading) {
            // Make heading focusable if it isn't already
            if (!firstHeading.hasAttribute('tabindex')) {
                firstHeading.setAttribute('tabindex', '-1');
            }
            firstHeading.focus();
            return;
        }
        
        // Fallback: focus on section-inner div
        const sectionInner = section.querySelector('.section-inner');
        if (sectionInner) {
            if (!sectionInner.hasAttribute('tabindex')) {
                sectionInner.setAttribute('tabindex', '-1');
            }
            sectionInner.focus();
            return;
        }
        
        // Last resort: focus on section itself (requires tabindex)
        if (!section.hasAttribute('tabindex')) {
            section.setAttribute('tabindex', '-1');
        }
        section.focus();
    }

    // Screen reader announcement
    function announceSectionChange(sectionId) {
        const sectionNames = {
            home: 'Home section',
            about: 'About section',
            experience: 'Experience section',
            projects: 'Projects section',
            contact: 'Contact section'
        };
        
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Navigated to ${sectionNames[sectionId] || sectionId}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Contact form handler
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const messageDiv = document.getElementById('form-message');
        
        // Simple client-side validation
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            showFormMessage('error', 'Please fill in all required fields.');
            return;
        }

        // For now, use mailto link (can be replaced with serverless function)
        const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
        const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
        const mailtoLink = `mailto:jeddycheng@gmail.com?subject=${subject}&body=${body}`;
        
        // Show success message first
        showFormMessage('success', 'Thank you! Your email client should open shortly. If not, please email jeddycheng@gmail.com directly.');
        
        // Open mailto link after a short delay so user sees the success message
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 300);
        
        // Reset form after a delay
        setTimeout(() => {
            contactForm.reset();
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // Show form message
    function showFormMessage(type, message) {
        const messageDiv = document.getElementById('form-message');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
    }

    // First visit hint (optional)
    function showFirstVisitHint() {
        const hasVisited = sessionStorage.getItem('film-portfolio-visited');
        if (!hasVisited) {
            sessionStorage.setItem('film-portfolio-visited', 'true');
            // Optional: Add a subtle animation or tooltip here
            // For now, we'll keep it minimal
        }
    }

    // Parallax effect for theater seats
    function initParallax() {
        const seats = document.querySelector('.theater-seats');
        const screen = document.querySelector('.theater-screen');
        
        if (!seats || !screen) return;
        
        function handleScroll() {
            const scrollTop = screen.scrollTop;
            // Seats move slower than content (parallax effect)
            const parallaxOffset = scrollTop * 0.3;
            seats.style.transform = `translateY(${parallaxOffset}px)`;
        }
        
        screen.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            initParallax();
        });
    } else {
        init();
        initParallax();
    }

    // Handle initial hash on load
    window.addEventListener('load', function() {
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash, false);
        }
    });

})();
