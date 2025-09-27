
// Mobile Menu Navigation Script
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حجم الشاشة
    const isMobile = window.innerWidth <= 768;
    
    // إذا كانت الشاشة كبيرة، لا نفعل شيئاً
    if (!isMobile) {
        // إخفاء عناصر القائمة المنسدلة على الشاشات الكبيرة
        document.querySelector('.mobile-menu-toggle')?.style.setProperty('display', 'none', 'important');
        document.querySelector('.mobile-menu-close')?.style.setProperty('display', 'none', 'important');
        document.querySelector('.mobile-menu-overlay')?.style.setProperty('display', 'none', 'important');
        
        // إظهار القائمة العادية على الشاشات الكبيرة
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.setProperty('display', 'flex', 'important');
            navLinks.style.setProperty('position', 'static', 'important');
            navLinks.style.setProperty('background-color', 'transparent', 'important');
            navLinks.style.setProperty('flex-direction', 'row', 'important');
            navLinks.style.setProperty('height', 'auto', 'important');
            navLinks.style.setProperty('overflow', 'visible', 'important');
            navLinks.style.setProperty('padding', '0', 'important');
            navLinks.style.setProperty('box-shadow', 'none', 'important');
            navLinks.style.setProperty('animation', 'none', 'important');
            navLinks.style.setProperty('max-height', 'none', 'important');
            navLinks.style.setProperty('width', '100%', 'important');
        }
        
        return;
    }
    const mainNav = document.querySelector('.main-nav');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const body = document.body;

    // Open mobile menu
    function openMobileMenu() {
        mainNav.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        body.classList.add('menu-open');
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }

    // Close mobile menu
    function closeMobileMenu() {
        mainNav.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        body.style.overflow = ''; // Enable scrolling when menu is closed
    }

    // Event listener for menu toggle (open and close)
    mobileMenuToggle.addEventListener('click', function() {
        if (mainNav.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking on overlay
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close if it's the active link (home page)
            if (!this.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });

    // Optional: Close menu when pressing escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle sub-menus
    const subMenuLinks = document.querySelectorAll('.has-submenu');
    subMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');

            // Close other sub-menus
            subMenuLinks.forEach(otherLink => {
                if (otherLink !== this) {
                    otherLink.classList.remove('active');
                }
            });
        });
    });

    // Add touch support for swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    mainNav.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    mainNav.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - close menu if open
            if (mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right - open menu if closed
            if (!mainNav.classList.contains('active')) {
                openMobileMenu();
            }
        }
    }

    // Add animation for menu items
    const menuItems = document.querySelectorAll('.nav-links li');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';

        // Stagger the animation
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    });
});
