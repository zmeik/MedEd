// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('show');
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollView({
            behavior: 'smooth'
        });
    });
});

// Слайдер отзывов
const testimonialSlider = document.querySelector('.testimonials-slider');
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
    testimonialSlider.style.transform = `translateX(-${index * 100}%)`;
}

prevBtn.addEventListener('click', () => {
    currentSlide = Math.max(currentSlide - 1, 0);
    showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
    currentSlide = Math.min(currentSlide + 1, testimonials.length - 1);
    showSlide(currentSlide);
});

// FAQ аккордеон
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('i');

        content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
        icon.classList.toggle('fa-plus');
        icon.classList.toggle('fa-minus');
    });
});

// Форма обратной связи
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Здесь будет код отправки формы
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    contactForm.reset();
});
// Инициализация плавного скролла
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smartphone: {
        smooth: true
    },
    tablet: {
        smooth: true
    }
});

// GSAP анимации
gsap.registerPlugin(ScrollTrigger);

// Анимация заголовка
gsap.from('.gradient-text', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power4.out'
});

// Горизонтальный скролл для услуг
gsap.to('.services-container', {
    x: () => -(document.querySelector('.services-container').scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
        trigger: '.services-horizontal',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: true
    }
});

// Параллакс эффект для карточек
document.querySelectorAll('.service-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = (y - rect.height / 2) / 20;
        const rotateY = (x - rect.width / 2) / 20;

        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});
