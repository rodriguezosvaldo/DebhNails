

document.addEventListener("DOMContentLoaded", function () {
    // Check if this is the index page
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname === '/' || 
                        window.location.pathname.endsWith('/');
    
    if (isIndexPage) {
        // Check if the page is being refreshed or loaded directly
        // Performance navigation type: 1 = reload, 0 = first load
        const isRefresh = performance.navigation ? 
                         (performance.navigation.type === 1) : 
                         false;
        
        // Get previous page from session history
        const previousPage = sessionStorage.getItem('currentPage');
        // Store current page
        sessionStorage.setItem('currentPage', window.location.pathname);
        
        // Show loading overlay on first visit or refresh, but not when navigating back
        if (!previousPage || previousPage !== window.location.pathname || isRefresh) {
            initLoadingOverlay();
        } else {
            // If returning to index.html from another page, hide loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
                document.body.classList.remove('loading');
            }
        }
    }
    const canvas = document.getElementById("rotateCanvas");
    const ctx = canvas.getContext("2d");
    const text = "NAILS STUDIO";
    const radius = 250;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fontSize = 70;
    const angleIncrement = (Math.PI) / text.length;
    let rotationAngle = 0;

    
    const img = new Image();
    img.src = "/assets/logos/logo.PNG"; 

    
    img.onload = function() {
        function drawRotatingText() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            
            const imgSize = 600;  
            ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
            
            ctx.font = `${fontSize}px Eras Light ITC`;
            ctx.fillStyle = "#d1d5dc";
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic";
            
            for (let i = 0; i < text.length; i++) {
                const angle = i * angleIncrement + rotationAngle - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle + Math.PI / 2);
                ctx.fillText(text[i], 0, 0);
                ctx.restore();
            }
            
            rotationAngle += 0.006;
            requestAnimationFrame(drawRotatingText);
        }
        
        drawRotatingText();
    };
}
)



function initLoadingOverlay() {
    // Add loading class to body to prevent scrolling
    document.body.classList.add('loading');
    
    // Get the loading overlay elements
    const loadingOverlay = document.getElementById('loading-overlay');
    const textDiv = document.getElementById('text');
    const delay = 1;
    
    if (!loadingOverlay || !textDiv) return;
    
    // Text to animate
    const textLine = "Nails Salon";
    
    // Ensure overlay is visible immediately when page loads
    loadingOverlay.style.transform = "scaleY(1)";
    loadingOverlay.style.transformOrigin = "bottom";
    
    // Clone the existing logo instead of creating a new one
    const headerLogo = document.getElementById('logo');
    const logoImg = headerLogo.cloneNode(true);
    logoImg.removeAttribute('id'); // Remove the original ID to avoid duplicates
    logoImg.className = ''; // Reset any classes from the header logo
    logoImg.style.opacity = '0';
    logoImg.style.transform = 'translateY(20px)';

    
    // Clear previous content and add logo to container
    const logoContainer = document.getElementById('logo-container');
    if (logoContainer) {
        logoContainer.innerHTML = '';
        logoContainer.appendChild(logoImg);
    }
    
    // Create spans for each letter
    function createLetterSpans(text, element) {
        element.innerHTML = ''; // Clear any existing content
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i]; // Use non-breaking space for spaces
            span.style.opacity = '0'; // Start invisible
            span.style.transform = 'translateY(20px)'; // Start below final position
            span.style.display = 'inline-block'; // Necessary for transform to work
            span.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; // Add transition for both properties
            element.appendChild(span);
        }
    }
    
    // Animate letters function - fade in with upward movement
    function animateLetters(element, delay=0) {
        const letters = element.querySelectorAll('span');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.opacity = '1';
                letter.style.transform = 'translateY(0)';
            }, delay + (index * 30)); // 30ms delay between each letter
        });
        return delay + (letters.length * 100); // Return the end time of animation
    }
    
    // Hide letters function - fade out with upward movement
    function hideLetters(element, delay = 0) {
        const letters = element.querySelectorAll('span');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.opacity = '0';
                letter.style.transform = 'translateY(-20px)';
            }, delay + (index * 30)); // Hide letters in sequence, left to right
        });
        return delay + (letters.length * 100); // Return total time for all letters to hide
    }
    
    // Start animation sequence
    setTimeout(() => {
        // 1. Show logo with upward movement
        logoImg.style.opacity = '1';
        logoImg.style.transform = 'translateY(0)';
        
        // 2. After logo appears, show the text
        setTimeout(() => {
            // Create spans for text line
            createLetterSpans(textLine, textDiv);
            
            // Start the text animation
            const textAnimationDuration = animateLetters(textDiv, delay);
            
            // 3. After showing for a moment, hide everything
            setTimeout(() => {
                // First hide logo
                logoImg.style.opacity = '0';
                logoImg.style.transform = 'translateY(-20px)';
                
                // Then hide text
                const textHideDuration = hideLetters(textDiv, delay);
                
                // 4. After elements are hidden, roll up the overlay
                setTimeout(() => {
                    loadingOverlay.style.transformOrigin = "top";
                    loadingOverlay.style.transform = "scaleY(0)";
                    
                    // Re-enable scrolling after the transition
                    setTimeout(() => {
                        document.body.classList.remove('loading');
                    }, 500); // Match the CSS transition time
                }, textHideDuration + 500); // Wait for text to hide
                
            }, textAnimationDuration + 20); // Show everything for x miliseconds
            
        }, 800); // Wait for logo to appear
        
    }, 300); // Small delay before starting any animation
}