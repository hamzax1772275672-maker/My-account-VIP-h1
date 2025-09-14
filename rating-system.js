
// Enhanced Rating System Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all rating containers from all sections
    const ratingContainers = document.querySelectorAll('.rating');

    // Load ratings from localStorage
    let productRatings = JSON.parse(localStorage.getItem('productRatings')) || {};
    let ratingCounts = JSON.parse(localStorage.getItem('ratingCounts')) || {};

    // Set initial state for each rating container
    ratingContainers.forEach(container => {
        const productId = container.getAttribute('data-product-id');
        const stars = container.querySelectorAll('i');
        // Find the rating count element - it could be a span with class rating-count or just a span
        const ratingCount = container.querySelector('.rating-count') || container.querySelector('span');
        let currentRating = 0; // Track current rating for this product

        // Set initial rating if exists
        if (productRatings[productId]) {
            currentRating = parseFloat(productRatings[productId]);
            updateStarsDisplay(stars, currentRating);

            // Update rating count if exists
            if (ratingCounts[productId] && ratingCount) {
                ratingCount.textContent = `(${ratingCounts[productId]})`;
            }
        }

        // Add hover effect
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', function() {
                // Highlight stars up to the current one
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.className = 'fas fa-star highlighted';
                        s.style.color = '#ffc107'; // Gold color on hover
                    } else {
                        s.className = 'far fa-star';
                        s.style.color = '#ddd'; // Gray color for non-hovered
                    }
                });
            });
        });

        // Reset to original rating when mouse leaves
        container.addEventListener('mouseleave', function() {
            if (currentRating > 0) {
                updateStarsDisplay(stars, currentRating);
            } else {
                stars.forEach(s => {
                    s.className = 'far fa-star';
                    s.style.color = '#ddd'; // Default gray color
                });
            }
        });

        // Add click event listeners to stars
        stars.forEach((star, index) => {
            star.style.cursor = 'pointer';
            star.addEventListener('click', function() {
                const rating = index + 1; // Rating is 1-based index

                // Set the rating directly (not average)
                currentRating = rating;
                productRatings[productId] = rating;

                // Update count
                if (!ratingCounts[productId]) {
                    ratingCounts[productId] = 0;
                }
                ratingCounts[productId]++;

                // Update UI - Fill all stars up to the selected one
                for (let i = 0; i < stars.length; i++) {
                    if (i < rating) {
                        stars[i].className = 'fas fa-star';
                        stars[i].style.color = '#ffc107'; // Gold color for filled stars
                    } else {
                        stars[i].className = 'far fa-star';
                        stars[i].style.color = '#ddd'; // Gray color for empty stars
                    }
                }

                // Update rating count - check if it's a number span or just a regular span
                if (ratingCount) {
                    // Check if the span already has a number in parentheses
                    if (ratingCount.textContent.match(/^\(\d+\)$/)) {
                        ratingCount.textContent = `(${ratingCounts[productId]})`;
                    } else {
                        ratingCount.textContent = `(${ratingCounts[productId]})`;
                    }
                }

                // Save to localStorage
                localStorage.setItem('productRatings', JSON.stringify(productRatings));
                localStorage.setItem('ratingCounts', JSON.stringify(ratingCounts));

                // Show notification
                showNotification(`تم تقييم المنتج ${rating} من 5`, 'success');

                // Add animation effect
                container.classList.add('rating-animation');
                setTimeout(() => {
                    container.classList.remove('rating-animation');
                }, 1000);
            });
        });
    });
});

// Function to update stars display with decimal values
function updateStarsDisplay(stars, rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    stars.forEach((star, index) => {
        if (index < fullStars) {
            star.className = 'fas fa-star';
            star.style.color = '#ffc107'; // Gold color for filled stars
        } else if (index === fullStars && hasHalfStar) {
            star.className = 'fas fa-star-half-alt';
            star.style.color = '#ffc107'; // Gold color for half star
        } else {
            star.className = 'far fa-star';
            star.style.color = '#ddd'; // Gray color for empty stars
        }
    });
}

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
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.fontWeight = '500';

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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
