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
    
    // إذا لم يتم العثور على حاوية محددة، ابحث عن العنصر الأصل لأول منتج
    else if (products.length > 0) {
        const parentElement = products[0].parentElement;
        if (parentElement) {
            parentElement.style.display = 'grid';
            parentElement.style.gridTemplateColumns = 'repeat(4, 1fr)';
            parentElement.style.gap = '20px';
            parentElement.style.padding = '20px';
        }
    }
    
    // معالجة خاصة لصفحة الموضة - التأكد من تطبيق التنسيق على جميع المنتجات
    // البحث عن جميع الحاويات المحتملة للمنتجات في صفحة الموضة
    const fashionContainers = document.querySelectorAll('.fashion-mens, .fashion-womens, .fashion-kids, .fashion-accessories, .fashion-shoes');
    
    // تطبيق تنسيق الشبكة على جميع حاويات الموضة
    fashionContainers.forEach(container => {
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(4, 1fr)';
        container.style.gap = '20px';
        container.style.padding = '20px';
    });
    
    // معالجة خاصة لقسم أزياء نسائية والقسم الذي يليه
    const womensFashion = document.querySelector('.fashion-womens');
    if (womensFashion) {
        // تطبيق تنسيق شبكي خاص لقسم أزياء نسائية
        womensFashion.style.display = 'grid';
        womensFashion.style.gridTemplateColumns = 'repeat(4, 1fr)';
        womensFashion.style.gap = '20px';
        womensFashion.style.padding = '20px';
        womensFashion.style.width = '100%';
        
        // الحصول على جميع المنتجات في قسم أزياء نسائية
        const womensProducts = womensFashion.querySelectorAll('.product-card');
        
        // التأكد من أن جميع المنتجات في قسم أزياء نسائية لها نفس العرض
        womensProducts.forEach(product => {
            product.style.width = '100%';
            product.style.maxWidth = 'none';
        });
        
        // الحصول على القسم الذي يلي قسم أزياء نسائية
        const nextSection = womensFashion.nextElementSibling;
        if (nextSection) {
            // تطبيق تنسيق شبكي على القسم التالي
            nextSection.style.display = 'grid';
            nextSection.style.gridTemplateColumns = 'repeat(4, 1fr)';
            nextSection.style.gap = '20px';
            nextSection.style.padding = '20px';
            nextSection.style.width = '100%';
            
            // الحصول على جميع المنتجات في القسم التالي
            const nextProducts = nextSection.querySelectorAll('.product-card');
            
            // التأكد من أن جميع المنتجات في القسم التالي لها نفس العرض
            nextProducts.forEach(product => {
                product.style.width = '100%';
                product.style.maxWidth = 'none';
            });
        }
    }
    
    // معالجة خاصة لقسم أزياء الأطفال
    const kidsFashion = document.querySelector('.fashion-kids');
    if (kidsFashion) {
        // إضافة CSS مخصص لقسم أزياء الأطفال
        const kidsStyle = document.createElement('style');
        kidsStyle.textContent = `
            .fashion-kids {
                display: grid !important;
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 20px !important;
                padding: 20px !important;
                width: 100% !important;
            }
            .fashion-kids .product-card {
                width: 100% !important;
                max-width: none !important;
                float: none !important;
            }
            .fashion-kids .row,
            .fashion-kids .container,
            .fashion-kids .wrapper,
            .fashion-kids .products {
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

    products.forEach(product => {
        // تطبيق خصائص موحدة على بطاقة المنتج
        product.style.borderRadius = '8px';
        product.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        product.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        product.style.marginBottom = '20px';
        product.style.overflow = 'hidden';
        product.style.backgroundColor = '#fff';

        // إضافة تأثير عند التمرير
        product.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });

        product.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });

        // توحيد تنسيق معلومات المنتج
        const productInfo = product.querySelector('.product-info');
        if (productInfo) {
            productInfo.style.padding = '15px';
        }

        // توحيد تنسيق عنوان المنتج
        const productTitle = product.querySelector('h3, h4');
        if (productTitle) {
            productTitle.style.fontSize = '16px';
            productTitle.style.marginBottom = '10px';
            productTitle.style.color = '#333';
        }

        // توحيد تنسيق سعر المنتج
        const productPrice = product.querySelector('.product-price');
        if (productPrice) {
            productPrice.style.marginBottom = '15px';

            const currentPrice = productPrice.querySelector('.current-price');
            if (currentPrice) {
                currentPrice.style.fontSize = '18px';
                currentPrice.style.fontWeight = 'bold';
                currentPrice.style.color = '#e74c3c';
            }

            const oldPrice = productPrice.querySelector('.old-price');
            if (oldPrice) {
                oldPrice.style.fontSize = '14px';
                oldPrice.style.textDecoration = 'line-through';
                oldPrice.style.color = '#999';
                oldPrice.style.marginRight = '10px';
            }
        }

        // توحيد تنسيق أزرار المنتج
        const productActions = product.querySelector('.product-actions');
        if (productActions) {
            productActions.style.display = 'flex';
            productActions.style.justifyContent = 'space-between';
            productActions.style.alignItems = 'center';
        }

        // توحيد تنسيق زر "إضافة للسلة"
        const addToCartBtn = product.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.style.backgroundColor = '#3498db';
            addToCartBtn.style.color = 'white';
            addToCartBtn.style.border = 'none';
            addToCartBtn.style.padding = '8px 15px';
            addToCartBtn.style.borderRadius = '4px';
            addToCartBtn.style.cursor = 'pointer';
            addToCartBtn.style.fontSize = '14px';
            addToCartBtn.style.transition = 'background-color 0.3s ease';

            // إضافة تأثير عند التمرير
            addToCartBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#2980b9';
            });

            addToCartBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#3498db';
            });
        }

        // توحيد تنسيق نظام التقييم
        const rating = product.querySelector('.rating');
        if (rating) {
            rating.style.marginBottom = '10px';
            rating.style.display = 'flex';
            rating.style.alignItems = 'center';

            const stars = rating.querySelectorAll('i');
            stars.forEach(star => {
                star.style.margin = '0 2px';
                star.style.cursor = 'pointer';
                star.style.transition = 'color 0.2s ease';
            });

            const ratingCount = rating.querySelector('.rating-count');
            if (ratingCount) {
                ratingCount.style.fontSize = '12px';
                ratingCount.style.color = '#666';
                ratingCount.style.marginRight = '5px';
            }
        }
    });
}

/**
 * دالة توحيد تنسيق جميع الصور
 */
function unifyImagesFormat() {
    // الحصول على جميع الصور في الصفحة
    const images = document.querySelectorAll('.product-card .product-img img');

    images.forEach(img => {
        // تطبيق خصائص موحدة على الصور
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.margin = '0 auto';
        img.style.display = 'block';
        img.style.borderRadius = '8px';
        img.style.transition = 'transform 0.3s ease';

        // إضافة تأثير عند التمرير
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * دالة تهيئة نظام التقييم
 */
function initRatingSystem() {
    // الحصول على جميع حاويات التقييم من جميع الأقسام
    const ratingContainers = document.querySelectorAll('.rating');

    // تحميل التقييمات من localStorage
    let productRatings = JSON.parse(localStorage.getItem('productRatings')) || {};
    let ratingCounts = JSON.parse(localStorage.getItem('ratingCounts')) || {};

    // تعيين الحالة الأولية لكل حاوية تقييم
    ratingContainers.forEach(container => {
        const productId = container.getAttribute('data-product-id');
        const stars = container.querySelectorAll('i');
        // البحث عن عنصر عدد التقييمات - قد يكون span مع class rating-count أو مجرد span
        const ratingCount = container.querySelector('.rating-count') || container.querySelector('span');
        let currentRating = 0; // تتبع التقييم الحالي لهذا المنتج

        // تعيين التقييم الأولي إذا كان موجودًا
        if (productRatings[productId]) {
            currentRating = parseFloat(productRatings[productId]);
            updateStarsDisplay(stars, currentRating);

            // تحديث عدد التقييمات إذا كان موجودًا
            if (ratingCounts[productId] && ratingCount) {
                ratingCount.textContent = `(${ratingCounts[productId]})`;
            }
        }

        // إضافة تأثير عند التمرير
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', function() {
                // تمييز النجوم حتى النجمة الحالية
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.className = 'fas fa-star highlighted';
                        s.style.color = '#ffc107'; // لون ذهبي عند التمرير
                    } else {
                        s.className = 'far fa-star';
                        s.style.color = '#ddd'; // لون رمادي للنجوم غير الممرة عليها
                    }
                });
            });
        });

        // إعادة التعيين إلى التقييم الأصلي عند مغادرة الماوس
        container.addEventListener('mouseleave', function() {
            if (currentRating > 0) {
                updateStarsDisplay(stars, currentRating);
            } else {
                stars.forEach(s => {
                    s.className = 'far fa-star';
                    s.style.color = '#ddd'; // اللون الرمادي الافتراضي
                });
            }
        });

        // إضافة مستمعي الأحداث للنقر على النجوم
        stars.forEach((star, index) => {
            star.style.cursor = 'pointer';
            star.addEventListener('click', function() {
                const rating = index + 1; // التقييم هو الفهرس + 1

                // تعيين التقييم مباشرة (ليس المتوسط)
                currentRating = rating;
                productRatings[productId] = rating;

                // تحديث العدد
                if (!ratingCounts[productId]) {
                    ratingCounts[productId] = 0;
                }
                ratingCounts[productId]++;

                // تحديث واجهة المستخدم - ملء جميع النجوم حتى النجمة المحددة
                for (let i = 0; i < stars.length; i++) {
                    if (i < rating) {
                        stars[i].className = 'fas fa-star';
                        stars[i].style.color = '#ffc107'; // لون ذهبي للنجوم المملوءة
                    } else {
                        stars[i].className = 'far fa-star';
                        stars[i].style.color = '#ddd'; // لون رمادي للنجوم الفارغة
                    }
                }

                // تحديث عدد التقييمات - التحقق إذا كان span رقمي أو مجرد span عادي
                if (ratingCount) {
                    // التحقق إذا كان span يحتوي بالفعل على رقم بين قوسين
                    if (ratingCount.textContent.match(/^\(\d+\)$/)) {
                        ratingCount.textContent = `(${ratingCounts[productId]})`;
                    } else {
                        ratingCount.textContent = `(${ratingCounts[productId]})`;
                    }
                }

                // الحفظ في localStorage
                localStorage.setItem('productRatings', JSON.stringify(productRatings));
                localStorage.setItem('ratingCounts', JSON.stringify(ratingCounts));

                // عرض الإشعار
                showNotification(`تم تقييم المنتج ${rating} من 5`, 'success');

                // إضافة تأثير حركي
                container.classList.add('rating-animation');
                setTimeout(() => {
                    container.classList.remove('rating-animation');
                }, 1000);
            });
        });
    });
}

/**
 * دالة تحديث عرض النجوم مع القيم العشرية
 */
function updateStarsDisplay(stars, rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    stars.forEach((star, index) => {
        if (index < fullStars) {
            star.className = 'fas fa-star';
            star.style.color = '#ffc107'; // لون ذهبي للنجوم المملوءة
        } else if (index === fullStars && hasHalfStar) {
            star.className = 'fas fa-star-half-alt';
            star.style.color = '#ffc107'; // لون ذهبي للنصف نجمة
        } else {
            star.className = 'far fa-star';
            star.style.color = '#ddd'; // لون رمادي للنجوم الفارغة
        }
    });
}

/**
 * دالة تهيئة نظام السلة
 */
function initCartSystem() {
    // التأكد من أن مدير السلة متاح
    if (typeof CartManager !== 'undefined') {
        const cartManager = new CartManager();

        // تعطيل أي مستمعات موجودة على أزرار "إضافة للسلة"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            // استنساخ الزر لإزالة جميع مستمعي الأحداث
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // إضافة مستمع حدث جديد مع منع النقر المزدوج
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // منع النقر المتعدد
                if (this.dataset.processing === 'true') {
                    return;
                }

                // تعليم الزر كقيد المعالجة
                this.dataset.processing = 'true';

                // الحصول على بيانات المنتج
                const productElement = this.closest('.product-card');
                if (productElement) {
                    // استخراج معلومات المنتج من العناصر المرئية
                    // محاولة العثور على العنوان (h3 أو h4)
                    const nameElement = productElement.querySelector('h3') || productElement.querySelector('h4');
                    // محاولة العثور على السعر
                    const priceElement = productElement.querySelector('.current-price') || productElement.querySelector('.product-price span:first-child');
                    const imageElement = productElement.querySelector('.product-img img');

                    if (nameElement && priceElement) {
                        // استخراج النصوص ومعالجتها
                        const name = nameElement.textContent.trim();
                        const priceText = priceElement.textContent.trim();
                        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                        const image = imageElement ? imageElement.src : '';
                        const id = productElement.getAttribute('data-id') || 'product_' + name.replace(/\s+/g, '_').toLowerCase();
                        const category = productElement.getAttribute('data-category') || 'general';

                        const product = {
                            id: id,
                            name: name,
                            price: price,
                            image: image,
                            category: category
                        };

                        // إضافة المنتج للسلة
                        cartManager.addItem(product);
                    }
                }

                // إعادة تفعيل الزر بعد فترة وجيزة
                setTimeout(() => {
                    this.dataset.processing = 'false';
                }, 500);
            });
        });
    }
}

/**
 * دالة عرض الإشعار
 */
function showNotification(message, type = 'info') {
    // إزالة أي إشعارات موجودة
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // تنسيق الإشعار بناءً على النوع
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

    // إضافة إلى body
    document.body.appendChild(notification);

    // تحريك للداخل
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    // الإزالة بعد 3 ثوانٍ
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
