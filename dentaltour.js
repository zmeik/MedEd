// Utility functions
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Mobile menu
const initMobileMenu = () => {
    const menuButton = $('.nav-toggle');
    const menu = $('.nav-links');

    menuButton?.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
    });
};

// Animate statistics
const animateStats = () => {
    const stats = $$('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.dataset.value);
                animateValue(target, 0, value, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
};

const animateValue = (element, start, end, duration) => {
    let current = start;
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));

    const timer = setInterval(() => {
        current += increment;
        element.textContent = current + (element.dataset.suffix || '');
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
};

// Smooth scroll
const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = $(anchor.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Form validation and submission
const initContactForm = () => {
    const form = $('#contactForm');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Here you would typically send the data to your server
            console.log('Form submitted:', data);

            // Show success message
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
        }
    });
};

// Cookie consent
const initCookieConsent = () => {
    const cookieConsent = $('#cookieConsent');
    const acceptButton = $('#acceptCookies');

    if (localStorage.getItem('cookiesAccepted')) {
        cookieConsent?.remove();
        return;
    }

    acceptButton?.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent?.remove();
    });
};

// Sticky header
const initStickyHeader = () => {
    const header = $('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initCookieConsent();
    initStickyHeader();
    animateStats();
});

// Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
    const images = $$('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}