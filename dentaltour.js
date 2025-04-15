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

        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Закрывать меню при клике на ссылки
    $$('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuButton.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
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
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-icon">
                    <i class="fa-solid fa-check-circle"></i>
                </div>
                <h3>Спасибо за обращение!</h3>
                <p>Мы свяжемся с вами в ближайшее время.</p>
            `;

            form.innerHTML = '';
            form.appendChild(successMessage);
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

// Tabs functionality for prices section
const initPriceTabs = () => {
    const tabButtons = $$('.tab-button');
    const pricesContent = $('.prices-content');

    // Price data
    const priceData = {
        implants: [
            { service: 'Имплант Alpha Bio', price: '400€' },
            { service: 'Имплант Straumann', price: '700€' },
            { service: 'Имплант Nobel Biocare', price: '850€' },
            { service: 'Костная пластика', price: '300€' }
        ],
        prosthetics: [
            { service: 'Металлокерамическая коронка', price: '150€' },
            { service: 'Циркониевая коронка', price: '250€' },
            { service: 'Коронка E-max', price: '280€' },
            { service: 'Съемные протезы (полный)', price: '500€' }
        ],
        aesthetic: [
            { service: 'Виниры (1 ед.)', price: '300€' },
            { service: 'Отбеливание ZOOM', price: '200€' },
            { service: 'Профессиональная чистка', price: '70€' },
            { service: 'Художественная реставрация', price: '80€' }
        ],
        treatment: [
            { service: 'Лечение кариеса', price: '50€' },
            { service: 'Лечение пульпита', price: '100€' },
            { service: 'Удаление зуба простое', price: '30€' },
            { service: 'Удаление зуба сложное', price: '70€' }
        ]
    };

    // Показать первый таб по умолчанию
    renderPriceTab('implants');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удалить активный класс со всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Добавить активный класс на нажатую кнопку
            button.classList.add('active');

            // Отрендерить соответствующий контент
            const tabId = button.dataset.tab;
            renderPriceTab(tabId);
        });
    });

    function renderPriceTab(tabId) {
        const items = priceData[tabId];
        let html = '<div class="price-list">';

        items.forEach(item => {
            html += `
                <div class="price-item">
                    <div class="price-service">${item.service}</div>
                    <div class="price-value">${item.price}</div>
                </div>
            `;
        });

        html += '</div>';
        pricesContent.innerHTML = html;
    }
};

// Reviews slider
const initReviewsSlider = () => {
    const slider = $('.reviews-slider');
    if (!slider) return;

    const track = $('.reviews-track');
    const prevButton = $('.review-prev');
    const nextButton = $('.review-next');
    const slides = $$('.review-card');

    let currentIndex = 0;
    const slidesToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 991 ? 2 : 3;

    const updateSlider = () => {
        const slideWidth = slider.clientWidth / slidesToShow;
        slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}px`;
        });

        const translateX = -currentIndex * slideWidth;
        track.style.transform = `translateX(${translateX}px)`;
    };

    window.addEventListener('resize', updateSlider);
    updateSlider();

    prevButton?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextButton?.addEventListener('click', () => {
        if (currentIndex < slides.length - slidesToShow) {
            currentIndex++;
            updateSlider();
        }
    });
};

// AOS (Animate On Scroll)
const initAOS = () => {
    // Имитация работы библиотеки AOS
    const elements = $$('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initCookieConsent();
    initStickyHeader();
    animateStats();
    initPriceTabs();
    initReviewsSlider();
    initAOS();
});

// Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
    const images = $$('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// FAQ Functionality
const initFAQ = () => {
    const faqItems = $$('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
};

// Initialize FAQ on page load
document.addEventListener('DOMContentLoaded', () => {
    // ... (other initializations)
    initFAQ();
});