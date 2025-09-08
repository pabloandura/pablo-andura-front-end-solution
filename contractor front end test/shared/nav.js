// Create and inject back navigation
document.addEventListener('DOMContentLoaded', function() {
	// Find the back-nav container
	const navContainer = document.getElementById('back-nav');
	
	if (navContainer) {
		// Create the back link
		const backLink = document.createElement('a');
		backLink.href = '../index.html';
		backLink.textContent = 'Back to Challenges';
		
		// Add the link to the container
		navContainer.appendChild(backLink);
		
		// Add the CSS class to the container
		navContainer.className = 'back-nav';
	}
});