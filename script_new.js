// Document Ready Function
// Êã ÅÖÇÝÉ ãÏíÑ ÇáÅÔÚÇÑÇÊ ÇáãæÍÏ (notification-manager.js) áÇÓÊÈÏÇá ÇáÏæÇá ÇáãßÑÑÉ
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserStatus();

    function checkUserStatus() {
        const username = localStorage.getItem('username');
        const adminPanel = document.getElementById('adminPanel');

        // Check if user is admin
        if (username === 'admin@myaccountvip.com') {
            adminPanel.style.display = 'flex';
        } else {
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
            notification.textContent = `ÊãÊ ÅÖÇÝÉ "${productName}" Åáì ÇáÓáÉ`;

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
                successMessage.textContent = 'ÔßÑÇð áÇÔÊÑÇßß Ýí äÔÑÊäÇ ÇáÈÑíÏíÉ!';

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
            searchNotification.textContent = `ÌÇÑí ÇáÈÍË Úä: "${searchTerm}"`;

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
            categoryNotification.textContent = `Êã ÇÎÊíÇÑ ÞÓã: "${categoryName}"`;

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
            languageNotification.textContent = `Êã ÊÛííÑ ÇááÛÉ Åáì: ${selectedLanguage}`;

            // Style the notification
            languageNotification.style.position = 'fixed';
            languageNotification.style.top = '20px';
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

    // Product Card Hover Effects
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.querySelector('h3').textContent;

            // Create product notification
            const productNotification = document.createElement('div');
            productNotification.className = 'product-notification';
            productNotification.textContent = `Êã ÇÎÊíÇÑ ãäÊÌ: "${productName}"`;

            // Style the notification
            productNotification.style.position = 'fixed';
            productNotification.style.top = '50%';
            productNotification.style.left = '50%';
            productNotification.style.transform = 'translate(-50%, -50%)';
            productNotification.style.backgroundColor = '#ff9900';
            productNotification.style.color = 'white';
            productNotification.style.padding = '20px 30px';
            productNotification.style.borderRadius = '8px';
            productNotification.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            productNotification.style.zIndex = '1001';
            productNotification.style.opacity = '0';
            productNotification.style.transition = 'opacity 0.3s ease';

            // Add to body
            document.body.appendChild(productNotification);

            // Animate in
            setTimeout(() => {
                productNotification.style.opacity = '1';
            }, 10);

            // Remove after 2 seconds
            setTimeout(() => {
                productNotification.style.opacity = '0';

                setTimeout(() => {
                    document.body.removeChild(productNotification);
                }, 300);
            }, 2000);
        });
    });

    // Update username display
    function updateUsernameDisplay() {
        const username = localStorage.getItem('username');
        const displayName = localStorage.getItem('displayName');
        const usernameDisplay = document.getElementById('username-display');

        if (usernameDisplay) {
            const nameToShow = displayName || username || 'ãÓÊÎÏã';
            usernameDisplay.textContent = nameToShow;
        }
    }

    // Call updateUsernameDisplay on page load
    updateUsernameDisplay();

    // Cart functionality
    const cartElement = document.querySelector('.cart-icon');
    if (cartElement) {
        cartElement.addEventListener('click', function() {
            showNotification('Êã ÝÊÍ ÇáÓáÉ');
        });
    }

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
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        // Set background color based on type
        let bgColor;
        switch (type) {
            case 'success':
                bgColor = '#4CAF50';
                break;
            case 'error':
                bgColor = '#F44336';
                break;
            case 'warning':
                bgColor = '#FF9800';
                break;
            default:
                bgColor = '#232f3e';
        }

        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = bgColor;
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1001';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';

        // Add to body
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };
});