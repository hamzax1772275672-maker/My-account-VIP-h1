
// Responsive enhancements for better user experience across all devices
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();

    // Initialize touch-friendly interactions
    initTouchInteractions();

    // Optimize images for different screen sizes
    optimizeImages();

    // Adjust layout based on screen orientation
    handleOrientationChange();

    // Initialize responsive tables
    initResponsiveTables();

    // Initialize responsive carousels
    initResponsiveCarousels();
});

// Mobile menu functionality
function initMobileMenu() {
    // Create mobile menu toggle button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');

        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.insertBefore(mobileMenuToggle, mainNav.firstChild);

            // Toggle menu when button is clicked
            mobileMenuToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!mainNav.contains(event.target) && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });

            // Close menu when window is resized to desktop size
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        }
    }
}

// Touch-friendly interactions
function initTouchInteractions() {
    // Add touch support for dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        let touchStart = false;

        dropdown.addEventListener('touchstart', function() {
            touchStart = true;
        });

        dropdown.addEventListener('touchend', function(e) {
            if (touchStart) {
                e.preventDefault();
                this.classList.toggle('touch-active');
                touchStart = false;
            }
        });
    });

    // Add swipe support for carousels and galleries
    const carousels = document.querySelectorAll('.carousel, .product-gallery');

    carousels.forEach(carousel => {
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(this, touchStartX, touchEndX);
        });
    });

    function handleSwipe(element, startX, endX) {
        const threshold = 50; // Minimum distance for swipe
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            // Trigger swipe event
            const event = new CustomEvent('swipe', {
                detail: {
                    direction: diff > 0 ? 'left' : 'right'
                }
            });
            element.dispatchEvent(event);
        }
    }
}

// Optimize images for different screen sizes
function optimizeImages() {
    const images = document.querySelectorAll('img[data-src], img[srcset]');

    // Simple lazy loading implementation
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }

    // Responsive image handling based on screen size
    function updateImageSources() {
        const width = window.innerWidth;
        const isMobile = width <= 768;
        const isSmallMobile = width <= 380;

        document.querySelectorAll('img[data-mobile-src], img[data-small-src]').forEach(img => {
            if (isSmallMobile && img.dataset.smallSrc) {
                img.src = img.dataset.smallSrc;
            } else if (isMobile && img.dataset.mobileSrc) {
                img.src = img.dataset.mobileSrc;
            } else if (img.dataset.desktopSrc) {
                img.src = img.dataset.desktopSrc;
            }
        });
    }

    // Update on load and resize
    updateImageSources();
    window.addEventListener('resize', updateImageSources);
}

// Handle orientation changes
function handleOrientationChange() {
    // Check if device supports orientation change
    if (window.screen.orientation) {
        window.addEventListener('orientationchange', function() {
            // Add a small delay to allow the browser to complete the orientation change
            setTimeout(function() {
                // Adjust layout based on new orientation
                adjustLayoutForOrientation();
            }, 300);
        });
    }

    // Also handle resize events for devices that don't support orientation change
    window.addEventListener('resize', function() {
        // Debounce resize events
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            adjustLayoutForOrientation();
        }, 250);
    });

    // Initial adjustment
    adjustLayoutForOrientation();
}

function adjustLayoutForOrientation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;

    // Apply orientation-specific classes
    if (isPortrait) {
        document.body.classList.add('portrait-orientation');
        document.body.classList.remove('landscape-orientation');
    } else {
        document.body.classList.add('landscape-orientation');
        document.body.classList.remove('portrait-orientation');
    }

    // Adjust specific elements based on orientation
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        if (isPortrait) {
            heroSection.style.minHeight = Math.max(height * 0.6, 400) + 'px';
        } else {
            heroSection.style.minHeight = Math.max(height * 0.8, 500) + 'px';
        }
    }

    // Adjust product grid columns based on screen width
    const productGrid = document.querySelector('.products-grid');
    if (productGrid) {
        if (width <= 380) {
            productGrid.style.gridTemplateColumns = 'repeat(1, 1fr)';
        } else if (width <= 576) {
            productGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (width <= 768) {
            productGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (width <= 992) {
            productGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
            productGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }
}

// Initialize responsive tables
function initResponsiveTables() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        // Create wrapper for responsive table
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        wrapper.style.overflowX = 'auto';
        wrapper.style.webkitOverflowScrolling = 'touch';

        // Replace table with wrapped version
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);

        // Add table header for mobile if it doesn't exist
        if (!table.querySelector('.mobile-table-header')) {
            const headers = Array.from(table.querySelectorAll('thead th, tr:first-child th'));
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');

                cells.forEach((cell, index) => {
                    if (headers[index]) {
                        const headerText = headers[index].textContent;
                        cell.setAttribute('data-label', headerText);
                    }
                });
            });
        }
    });
}

// Initialize responsive carousels
function initResponsiveCarousels() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        // Get carousel items
        const items = carousel.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        // Set initial state
        let currentIndex = 0;
        updateCarousel();

        // Handle swipe events
        carousel.addEventListener('swipe', function(e) {
            if (e.detail.direction === 'left') {
                currentIndex = (currentIndex + 1) % items.length;
            } else {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
            }
            updateCarousel();
        });

        // Update carousel display
        function updateCarousel() {
            items.forEach((item, index) => {
                if (index === currentIndex) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            updateCarousel();
        });
    });
}

// Add viewport height fix for mobile browsers
function setViewportHeight() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// We run this on initial load and on resize
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
