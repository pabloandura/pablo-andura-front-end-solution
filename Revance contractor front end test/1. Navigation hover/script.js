/**
 * Navigation with keyboard support, URL updates, and accessibility features.
 * Shows focus indicators only during keyboard navigation.
 */
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentFocusIndex = Array.from(navLinks).findIndex(link => link.classList.contains('active'));
    let isKeyboardNavigation = false;
    
    if (currentFocusIndex === -1) currentFocusIndex = 0;
    
    function enableKeyboardNavigation() {
        if (!isKeyboardNavigation) {
            isKeyboardNavigation = true;
            document.body.classList.add('keyboard-navigation');
        }
    }
    
    function disableKeyboardNavigation() {
        if (isKeyboardNavigation) {
            isKeyboardNavigation = false;
            document.body.classList.remove('keyboard-navigation');
        }
    }
    
    function setActiveLink(index) {
        navLinks.forEach((link) => {
            link.classList.remove('active');
            link.setAttribute('aria-selected', 'false');
            link.setAttribute('tabindex', '-1');
        });
        
        navLinks[index].classList.add('active');
        navLinks[index].setAttribute('aria-selected', 'true');
        navLinks[index].setAttribute('tabindex', '0');
        
        const sectionName = navLinks[index].textContent.toLowerCase();
        window.history.replaceState(null, null, `#${sectionName}`);
        
        const announcement = `${navLinks[index].textContent} selected`;
        announceToScreenReader(announcement);
    }
    
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
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            disableKeyboardNavigation();
            currentFocusIndex = index;
            setActiveLink(index);
        });
        
        link.addEventListener('mousedown', disableKeyboardNavigation);
        
        link.addEventListener('keydown', function(e) {
            enableKeyboardNavigation();
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    currentFocusIndex = currentFocusIndex > 0 ? currentFocusIndex - 1 : navLinks.length - 1;
                    navLinks[currentFocusIndex].focus();
                    break;
                    
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    currentFocusIndex = currentFocusIndex < navLinks.length - 1 ? currentFocusIndex + 1 : 0;
                    navLinks[currentFocusIndex].focus();
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    setActiveLink(currentFocusIndex);
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    currentFocusIndex = 0;
                    navLinks[currentFocusIndex].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    currentFocusIndex = navLinks.length - 1;
                    navLinks[currentFocusIndex].focus();
                    break;
            }
        });
    });
});