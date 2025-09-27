/**
 * دالة توحيد تنسيق المنتجات والصور في جميع صفحات المنتجات
 */
document.addEventListener('DOMContentLoaded', function() {
    // توحيد تنسيق جميع المنتجات
    unifyProductsFormat();

    // توحيد تنسيق جميع الصور
    unifyImagesFormat();

    // تهيئة نظام التقييم
    initRatingSystem();

    // تهيئة نظام السلة
    initCartSystem();
});

/**
 * دالة توحيد تنسيق جميع المنتجات والأقسام
 */
function unifyProductsFormat() {
    // إضافة CSS مخصص لضمان عرض المنتجات بشكل شبكي
    const style = document.createElement('style');
    style.textContent = `
        .fashion-womens, .fashion-womens *,
        .fashion-mens, .fashion-mens *,
        .fashion-kids, .fashion-kids *,
        .fashion-accessories, .fashion-accessories *,
        .fashion-shoes, .fashion-shoes *,
        #children-fashion, #children-fashion *,
        .product-card, .product-card *,
        .products-grid, .products-grid *,
        .products-container, .products-container *,
        .product-list, .product-list *,
        .section, .section *,
        .category-section, .category-section *,
        .product-section, .product-section * {
            box-sizing: border-box;
        }

        .fashion-womens,
        .fashion-mens,
        .fashion-kids,
        .fashion-accessories,
        .fashion-shoes,
        #children-fashion,
        .products-grid,
        .products-container,
        .product-list,
        .section,
        .category-section,
        .product-section {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 20px !important;
            padding: 20px !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
        }

        .product-card {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            float: none !important;
            display: inline-block !important;
            vertical-align: top !important;
        }
    `;
    document.head.appendChild(style);

    // الحصول على جميع المنتجات في الصفحة
    const products = document.querySelectorAll('.product-card');

    // الحصول على جميع الأقسام في الصفحة
    const sections = document.querySelectorAll('.section, .category-section, .product-section');

    // تطبيق تنسيق الشبكة على جميع الأقسام
    sections.forEach(section => {
        section.style.display = 'grid';
        section.style.gridTemplateColumns = 'repeat(4, 1fr)';
        section.style.gap = '20px';
        section.style.padding = '20px';
    });

    // الحصول على الحاوية التي تحتوي على جميع المنتجات
    const productsContainer = document.querySelector('.products-grid, .products-container, .product-list');

    // إذا تم العثور على حاوية المنتجات، تطبيق تنسيق الشبكة
    if (productsContainer) {
        productsContainer.style.display = 'grid';
        productsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        productsContainer.style.gap = '20px';
        productsContainer.style.padding = '20px';
    }

    // الحصول على حاويات الأزياء المختلفة
    const fashionContainers = document.querySelectorAll('.fashion-womens, .fashion-mens, .fashion-kids, .fashion-accessories, .fashion-shoes');

    // تطبيق تنسيق الشبكة على حاويات الأزياء
    fashionContainers.forEach(container => {
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(4, 1fr)';
        container.style.gap = '20px';
        container.style.padding = '20px';
    });

    // معالجة خاصة لقسم أزياء الأطفال
    const kidsFashion = document.querySelector('#children-fashion');
    if (kidsFashion) {
        // إضافة CSS مخصص لقسم أزياء الأطفال
        const kidsStyle = document.createElement('style');
        kidsStyle.textContent = `
            #children-fashion .products-grid {
                display: grid !important;
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 20px !important;
                padding: 20px !important;
                width: 100% !important;
            }
            #children-fashion .product-card {
                width: 100% !important;
                max-width: none !important;
                float: none !important;
            }
            #children-fashion .row,
            #children-fashion .container,
            #children-fashion .wrapper,
            #children-fashion .products {
                display: grid !important;
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 20px !important;
                padding: 20px !important;
                width: 100% !important;
            }
        `;
        document.head.appendChild(kidsStyle);
    }

    // البحث عن أي عناصر رئيسية أخرى تحتوي على منتجات
    const mainContent = document.querySelector('main, .main-content, .content, .page-content');
    if (mainContent && !productsContainer && fashionContainers.length === 0) {
        // البحث عن جميع العناصر الفرعية التي قد تحتوي على منتجات
        const childElements = Array.from(mainContent.children);

        childElements.forEach(child => {
            // إذا كان العنصر يحتوي على منتجات، تطبيق تنسيق الشبكة
            if (child.querySelector('.product-card')) {
                child.style.display = 'grid';
                child.style.gridTemplateColumns = 'repeat(4, 1fr)';
                child.style.gap = '20px';
                child.style.padding = '20px';
            }
        });
    }

    // معالجة خاصة للمنتجات التي قد تكون داخل عناصر أخرى
    const productWrappers = document.querySelectorAll('.products-wrapper, .items-wrapper, .catalog-wrapper, .shop-wrapper');
    productWrappers.forEach(wrapper => {
        wrapper.style.display = 'grid';
        wrapper.style.gridTemplateColumns = 'repeat(4, 1fr)';
        wrapper.style.gap = '20px';
        wrapper.style.padding = '20px';
    });

    // التأكد من أن جميع المنتجات لها نفس العرض
    products.forEach(product => {
        product.style.width = '100%';
        product.style.maxWidth = 'none';
    });

    // إذا كان هناك قسم تالي يحتوي على منتجات، تأكد من أنه بعرض الشبكة أيضاً
    const nextSection = document.querySelector('.section + .section, .category-section + .category-section, .product-section + .product-section');
    if (nextSection && nextSection.querySelector('.product-card')) {
        nextSection.style.display = 'grid';
        nextSection.style.gridTemplateColumns = 'repeat(4, 1fr)';
        nextSection.style.gap = '20px';
        nextSection.style.padding = '20px';

        // التأكد من أن جميع المنتجات في القسم التالي لها نفس العرض
        const nextProducts = nextSection.querySelectorAll('.product-card');
        nextProducts.forEach(product => {
            product.style.width = '100%';
            product.style.maxWidth = 'none';
        });
    }
}

/**
 * دالة توحيد تنسيق جميع الصور
 */
function unifyImagesFormat() {
    // الحصول على جميع الصور في صفحات المنتجات
    const productImages = document.querySelectorAll('.product-img img, .product-image img, .item-image img');

    // تطبيق تنسيق موحد على جميع الصور
    productImages.forEach(img => {
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
    });
}

/**
 * دالة تهيئة نظام التقييم
 */
function initRatingSystem() {
    // الحصول على جميع أنظمة التقييم في الصفحة
    const ratingSystems = document.querySelectorAll('.rating');

    // تهيئة كل نظام تقييم
    ratingSystems.forEach(ratingSystem => {
        const stars = ratingSystem.querySelectorAll('i');
        const ratingCount = ratingSystem.querySelector('.rating-count');
        let currentRating = 0;

        // تحميل التقييم المحفوظ (إن وجد)
        const productId = ratingSystem.getAttribute('data-product-id');
        if (productId) {
            const savedRating = localStorage.getItem(`rating-${productId}`);
            if (savedRating) {
                currentRating = parseInt(savedRating);
                updateStarsDisplay(stars, currentRating);
            }
        }

        // إضافة أحداث الماوس
        stars.forEach((star, index) => {
            // عند المرور بالماوس فوق النجم
            star.addEventListener('mouseenter', function() {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });

            // عند النقر على النجم
            star.addEventListener('click', function() {
                currentRating = index + 1;

                // حفظ التقييم
                if (productId) {
                    localStorage.setItem(`rating-${productId}`, currentRating);
                }

                // تحديث عرض النجوم
                updateStarsDisplay(stars, currentRating);

                // تحديث عدد التقييمات
                if (ratingCount) {
                    const count = parseInt(ratingCount.textContent.replace(/[()]/g, '')) || 0;
                    ratingCount.textContent = `(${count + 1})`;
                }

                // إظهار إشعار
                showNotification('تم تقييم المنتج بنجاح!', 'success');
            });
        });

        // عند مغادرة نظام التقييم بالماوس
        ratingSystem.addEventListener('mouseleave', function() {
            updateStarsDisplay(stars, currentRating);
        });
    });
}

/**
 * دالة تحديث عرض النجوم
 */
function updateStarsDisplay(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

/**
 * دالة تهيئة نظام السلة
 */
function initCartSystem() {
    // الحصول على جميع أزرار "أضف للسلة"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // إضافة حدث النقر لكل زر
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // الحصول على معلومات المنتج
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;

            // إظهار إشعار
            showNotification(`تمت إضافة ${productName} إلى السلة!`, 'success');

            // تحديث عداد السلة
            updateCartCount();
        });
    });
}

/**
 * دالة تحديث عداد السلة
 */
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;
        cartCount.classList.add('show');
    }
}

/**
 * دالة إظهار الإشعارات
 */
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);

    // إظهار الإشعار
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';

        // إزالة الإشعار من الصفحة بعد انتهاء الانتقال
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
