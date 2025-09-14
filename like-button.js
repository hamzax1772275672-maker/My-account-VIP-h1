
// Like Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all like buttons
    const likeButtons = document.querySelectorAll('.like-btn');

    // Load liked products from localStorage
    let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];

    // Set initial state for each like button
    likeButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');
        if (likedProducts.includes(productId)) {
            button.classList.add('liked');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
        }

        // Add click event listener
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const icon = this.querySelector('i');

            if (this.classList.contains('liked')) {
                // Unlike the product
                this.classList.remove('liked');
                icon.classList.remove('fas');
                icon.classList.add('far');

                // Remove from localStorage
                likedProducts = likedProducts.filter(id => id !== productId);
                localStorage.setItem('likedProducts', JSON.stringify(likedProducts));

                // Show notification
                showNotification('تم إزالة المنتج من المفضلة', 'info');
            } else {
                // Like the product
                this.classList.add('liked');
                icon.classList.remove('far');
                icon.classList.add('fas');

                // Add to localStorage
                if (!likedProducts.includes(productId)) {
                    likedProducts.push(productId);
                    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
                }

                // Show notification
                showNotification('تمت إضافة المنتج إلى المفضلة', 'success');
            }
        });
    });
});

// Function to show notification
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification based on type
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.zIndex = '1001';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';

    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196F3';
    }

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
}
