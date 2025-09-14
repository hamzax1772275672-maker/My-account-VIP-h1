// Document Ready Function
// تم إضافة مدير الإشعارات الموحد (notification-manager.js) لاستبدال الدوال المكررة
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserStatus();

    function checkUserStatus() {
        const username = localStorage.getItem('username');
        const accountDropdown = document.querySelector('.account.dropdown');
        const adminPanel = document.getElementById('adminPanel');

        if (username) {
            // User is logged in
            

            
            // Check if user is admin
            if (username === 'admin@myaccountvip.com') {
                adminPanel.style.display = 'flex';
            } else {
                adminPanel.style.display = 'none';
            }
        } else {
            // User is not logged in
            
            // Hide admin panel
            adminPanel.style.display = 'none';
        }
    }
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;

            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = `تمت إضافة "${productName}" إلى السلة`;

            // Style the notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.left = '20px';
            notification.style.backgroundColor = '#232f3e';
            notification.style.color = 'white';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '4px';
            notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            notification.style.zIndex = '1001';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'all 0.3s ease';

            // Add to body
            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            }, 10);

            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateY(100px)';
                notification.style.opacity = '0';

                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        });
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (email) {
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'شكراً لاشتراكك في نشرتنا البريدية!';

                // Style the success message
                successMessage.style.color = '#4CAF50';
                successMessage.style.marginTop = '15px';
                successMessage.style.fontWeight = 'bold';

                // Add after form
                this.appendChild(successMessage);

                // Clear input
                emailInput.value = '';

                // Remove after 3 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transition = 'opacity 0.5s ease';

                    setTimeout(() => {
                        this.removeChild(successMessage);
                    }, 500);
                }, 3000);
            }
        });
    }

    // Search Functionality
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm.querySelector('input');
    const searchButton = searchForm.querySelector('button');

    searchButton.addEventListener('click', function() {
        performSearch();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            // Create search notification
            const searchNotification = document.createElement('div');
            searchNotification.className = 'search-notification';
            searchNotification.textContent = `جاري البحث عن: "${searchTerm}"`;

            // Style the notification
            searchNotification.style.position = 'fixed';
            searchNotification.style.top = '20px';
            searchNotification.style.left = '50%';
            searchNotification.style.transform = 'translateX(-50%)';
            searchNotification.style.backgroundColor = '#ff9900';
            searchNotification.style.color = 'white';
            searchNotification.style.padding = '15px 20px';
            searchNotification.style.borderRadius = '4px';
            searchNotification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            searchNotification.style.zIndex = '1001';
            searchNotification.style.opacity = '0';
            searchNotification.style.transition = 'opacity 0.3s ease';

            // Add to body
            document.body.appendChild(searchNotification);

            // Animate in
            setTimeout(() => {
                searchNotification.style.opacity = '1';
            }, 10);

            // Remove after 2 seconds
            setTimeout(() => {
                searchNotification.style.opacity = '0';

                setTimeout(() => {
                    document.body.removeChild(searchNotification);
                }, 300);
            }, 2000);
        }
    }

    // Category and Product Card Hover Effects
    const categoryCards = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;

            // Create category notification
            const categoryNotification = document.createElement('div');
            categoryNotification.className = 'category-notification';
            categoryNotification.textContent = `تم اختيار قسم: "${categoryName}"`;

            // Style the notification
            categoryNotification.style.position = 'fixed';
            categoryNotification.style.top = '50%';
            categoryNotification.style.left = '50%';
            categoryNotification.style.transform = 'translate(-50%, -50%)';
            categoryNotification.style.backgroundColor = '#232f3e';
            categoryNotification.style.color = 'white';
            categoryNotification.style.padding = '20px 30px';
            categoryNotification.style.borderRadius = '8px';
            categoryNotification.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            categoryNotification.style.zIndex = '1001';
            categoryNotification.style.opacity = '0';
            categoryNotification.style.transition = 'opacity 0.3s ease';

            // Add to body
            document.body.appendChild(categoryNotification);

            // Animate in
            setTimeout(() => {
                categoryNotification.style.opacity = '1';
            }, 10);

            // Remove after 2 seconds
            setTimeout(() => {
                categoryNotification.style.opacity = '0';

                setTimeout(() => {
                    document.body.removeChild(categoryNotification);
                }, 300);
            }, 2000);
        });
    });

    // Language Selector Change
    const languageSelector = document.querySelector('.language-selector select');

    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;

            // Create language notification
            const languageNotification = document.createElement('div');
            languageNotification.className = 'language-notification';
            languageNotification.textContent = `تم تغيير اللغة إلى: ${selectedLanguage === 'ar' ? 'العربية' : 'English'}`;

            // Style the notification
            languageNotification.style.position = 'fixed';
            languageNotification.style.bottom = '20px';
            languageNotification.style.right = '20px';
            languageNotification.style.backgroundColor = '#232f3e';
            languageNotification.style.color = 'white';
            languageNotification.style.padding = '15px 20px';
            languageNotification.style.borderRadius = '4px';
            languageNotification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            languageNotification.style.zIndex = '1001';
            languageNotification.style.opacity = '0';
            languageNotification.style.transition = 'opacity 0.3s ease';

            // Add to body
            document.body.appendChild(languageNotification);

            // Animate in
            setTimeout(() => {
                languageNotification.style.opacity = '1';
            }, 10);

            // Remove after 2 seconds
            setTimeout(() => {
                languageNotification.style.opacity = '0';

                setTimeout(() => {
                    document.body.removeChild(languageNotification);
                }, 300);
            }, 2000);
        });
    }

    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Cart and Account Click Handlers
    const cartElement = document.querySelector('.cart');
    const accountElement = document.querySelector('.account');
    let accountSpan = null;

    if (accountElement) {
        accountSpan = accountElement.querySelector('span');
    }

    // Check if user is logged in and display username
    const username = localStorage.getItem('username');
    const displayName = localStorage.getItem('displayName');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    if (username) {
        // Display name if available, otherwise use first and last name, otherwise display username
        let nameToShow = displayName;
        if (!nameToShow && firstName) {
            nameToShow = lastName ? firstName + ' ' + lastName : firstName;
        }
        if (!nameToShow) {
            nameToShow = username;
        }

        accountSpan.textContent = nameToShow;

        // Display name under the hero title
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = nameToShow;
        }
    }

    cartElement.addEventListener('click', function() {
        showNotification('تم فتح السلة');
    });

    // Account Click Handler
    document.addEventListener('DOMContentLoaded', function() {
        const accountElement = document.querySelector('.account');

        if (accountElement) {
            accountElement.addEventListener('click', function() {
                window.location.href = 'login.html';
            });
        }
    });

    // Utility function for showing notifications
    window.showNotification = function(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.utility-notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        const notification = document.createElement('div');
        notification.className = 'utility-notification';
        notification.textContent = message;

        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1001';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ff9800';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#232f3e';
                break;
        }
        
        notification.style.color = 'white';

        // Add to body
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';

            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}



// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles to notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = '#fff';
    notification.style.zIndex = '1000';
    notification.style.minWidth = '250px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.transform = 'translateX(120%)';
    notification.style.transition = 'transform 0.3s ease';

    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#17a2b8';
    }

    // Add notification to body
    document.body.appendChild(notification);

    // Animate notification in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles to notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = '#fff';
    notification.style.zIndex = '1000';
    notification.style.minWidth = '250px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.transform = 'translateX(120%)';
    notification.style.transition = 'transform 0.3s ease';

    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#17a2b8';
    }

    // Add notification to body
    document.body.appendChild(notification);

    // Animate notification in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
