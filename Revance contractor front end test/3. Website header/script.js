/**
 * Website header with keyboard navigation, accessibility features, and responsive behavior.
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const langBtn = document.querySelector('.lang-btn');
    const navBtns = document.querySelectorAll('.nav-btn');
    const socialLinks = document.querySelectorAll('.social-link');
    const shopBtn = document.querySelector('.shop-btn');
    const galleryContainer = document.querySelector('.gallery-container');
    const productItems = document.querySelectorAll('.product-item');

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            announceToScreenReader(isExpanded ? 'Menu collapsed' : 'Menu expanded');
        });

        menuBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    if (langBtn) {
        langBtn.addEventListener('click', function() {
            announceToScreenReader('Language selector activated');
        });

        langBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    navBtns.forEach((btn) => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('prev-btn') ? 'Previous' : 'Next';
            announceToScreenReader(`${action} collection selected`);
        });

        btn.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevBtn = document.querySelector('.prev-btn');
                    if (prevBtn) prevBtn.focus();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const nextBtn = document.querySelector('.next-btn');
                    if (nextBtn) nextBtn.focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    break;
            }
        });
    });

    socialLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevLink = socialLinks[index - 1] || socialLinks[socialLinks.length - 1];
                    prevLink.focus();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextLink = socialLinks[index + 1] || socialLinks[0];
                    nextLink.focus();
                    break;
            }
        });
    });

    if (shopBtn) {
        shopBtn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#shop') {
                e.preventDefault();
                announceToScreenReader('Shop section activated - browsing Summer 2020 collection');
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.activeElement.blur();
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    if (galleryContainer) {
        let isScrolling = false;
        
        galleryContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                galleryContainer.scrollBy({ left: -100, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                galleryContainer.scrollBy({ left: 100, behavior: 'smooth' });
            }
        });

        galleryContainer.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                announceToScreenReader('Gallery scrolled');
                setTimeout(() => {
                    isScrolling = false;
                }, 500);
            }
        });

        productItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                announceToScreenReader(`Product ${index + 1} selected`);
            });

            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        productItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
});