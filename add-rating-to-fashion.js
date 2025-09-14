// Script to add rating system to all products in fashion2.html
document.addEventListener('DOMContentLoaded', function() {
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');

    // Counter for unique product IDs - start from 15 since we manually added 1-14
    let productCounter = 15;

    // Load ratings from localStorage
    let productRatings = JSON.parse(localStorage.getItem('productRatings')) || {};
    let ratingCounts = JSON.parse(localStorage.getItem('ratingCounts')) || {};

    // Add rating system to each product card
    productCards.forEach(card => {
        // Check if this product already has a rating system
        const existingRating = card.querySelector('.rating');
        if (existingRating) {
            // Initialize existing rating systems
            initializeRatingSystem(existingRating);
            return; // Skip adding new rating system
        }

        const productInfo = card.querySelector('.product-info');
        const productName = productInfo.querySelector('h4').textContent;

        // Create rating system HTML
        const ratingHTML = `
            <!-- Rating System -->
            <div class="rating" data-product-id="fashion-product-${productCounter}">
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <span class="rating-count">(0)</span>
            </div>
        `;

        // Find the product details div or price div to insert rating after
        const productDetails = productInfo.querySelector('.product-details');
        const productPrice = productInfo.querySelector('.product-price');

        if (productDetails) {
            // Insert rating after product details
            productDetails.insertAdjacentHTML('afterend', ratingHTML);
        } else if (productPrice) {
            // Insert rating before price if no product details
            productPrice.insertAdjacentHTML('beforebegin', ratingHTML);
        }

        // Get the newly added rating element and initialize it
        const newRating = productInfo.querySelector('.rating');
        if (newRating) {
            initializeRatingSystem(newRating);
        }

        // Increment counter for next product
        productCounter++;
    });

    // Function to initialize a rating system
    function initializeRatingSystem(ratingContainer) {
        const productId = ratingContainer.getAttribute('data-product-id');
        const stars = ratingContainer.querySelectorAll('i');
        const ratingCount = ratingContainer.querySelector('.rating-count');
        let currentRating = 0;

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
        ratingContainer.addEventListener('mouseleave', function() {
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

                // Update rating count
                if (ratingCount) {
                    ratingCount.textContent = `(${ratingCounts[productId]})`;
                }

                // Save to localStorage
                localStorage.setItem('productRatings', JSON.stringify(productRatings));
                localStorage.setItem('ratingCounts', JSON.stringify(ratingCounts));

                // Show notification
                showNotification(`تم تقييم المنتج ${rating} من 5`, 'success');

                // Add animation effect
                ratingContainer.classList.add('rating-animation');
                setTimeout(() => {
                    ratingContainer.classList.remove('rating-animation');
                }, 1000);
            });
        });
    }

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
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }

        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type}`;

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, 3000);
    }
});