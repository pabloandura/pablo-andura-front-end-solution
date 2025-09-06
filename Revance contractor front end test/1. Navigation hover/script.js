document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(otherLink => otherLink.classList.remove('active'));
            
            this.classList.add('active');
            
            const sectionName = this.textContent.toLowerCase();
            window.history.replaceState(null, null, `#${sectionName}`);
        });
    });
});