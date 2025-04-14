// Utility functions
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Mobile menu
const initMobileMenu = () => {
    const menuButton = $('.nav-toggle');
    const menu = $('.nav-menu');

    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
    });
};

// Smooth scroll
const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = $(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Form validation and submission
const initContactForm = () => {
    const form = $('.contact-form');
    if (!form) return;

    const validateField = (field) => {
        const value = field.value.trim();
        const name = field.name;
        let error = '';

        switch (name) {
            case 'name':
                if (!value) error = 'Пожалуйста, введите ваше имя';
                break;
            case 'phone':
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                if (!phoneRegex.test(value)) error = 'Пожалуйста, введите корректный номер телефона';
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) error = 'Пожалуйста, введите корректный email';
                break;
        }

        return error;
    };

    const showFieldError = (field, error) => {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (error) {
            if (!errorElement) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = error;
                field.parentElement.appendChild(errorDiv);
            } else {
                errorElement.textContent = error;
            }
            field.setAttribute('aria-invalid', 'true');
        } else {
            if (errorElement) errorElement.remove();
            field.removeAttribute('aria-invalid');
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        const formData = new FormData(form);

        // Validate all fields
        form.querySelectorAll('input, textarea').forEach(field => {
            const error = validateField(field);
            showFieldError(field, error);
            if (error) isValid = false;
        });

        if (!isValid) return;

        try {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            // Здесь должен быть ваш код отправки формы на сервер
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация отправки

            // Показываем сообщение об успехе
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
        } catch (error) {
            showNotification('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить';
        }
    });
};

// Notification system
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

// Cookie consent
const initCookieConsent = () => {
    const cookieConsent = $('.cookie-consent');
    const acceptButton = $('.accept-cookies');

    if (localStorage.getItem('cookieConsent')) {
        cookieConsent?.remove();
        return;
    }

    acceptButton?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieConsent.remove();
    });
};

// Intersection Observer for animations
const initAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1
    });

    $$('[data-aos]').forEach(element => {
        observer.observe(element);
    });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initCookieConsent();
    initAnimations();
});

// Handle service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.error('ServiceWorker registration failed:', error);
        });
    });
}

// Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
    $$('img[loading="lazy"]').forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = '/js/lazysizes.min.js';
    document.body.appendChild(script);
}
