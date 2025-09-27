/**
 * دالة توحيد تنسيق المنتجات والصور في صفحة الإلكترونيات
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
 * دالة توحيد تنسيق جميع المنتجات
 */
function unifyProductsFormat() {
    // الحصول على جميع المنتجات في صفحة الإلكترونيات
    const products = document.querySelectorAll('.electronics-section .product-card');

    products.forEach(product => {
        // التأكد من وجود خصائص data-* اللازمة
        ensureDataAttributes(product);

        // توحيد هيكل المنتج
        standardizeProductStructure(product);
    });
}

/**
 * دالة التأكد من وجود خصائص data-* اللازمة للمنتج
 */
function ensureDataAttributes(product) {
    // الحصول على معلومات المنتج من العناصر الموجودة
    const nameElement = product.querySelector('h4');
    const priceElement = product.querySelector('.current-price');
    const imageElement = product.querySelector('img');
    const categorySection = product.closest('.electronics-section');

    // استخراج القيم
    const name = nameElement ? nameElement.textContent.trim() : '';
    const priceText = priceElement ? priceElement.textContent.trim() : '';
    const price = priceText.replace(/[^\d]/g, ''); // إزالة غير الأرقام
    const image = imageElement ? imageElement.src : '';

    // تحديد الفئة بناءً على القسم
    let category = '';
    if (categorySection) {
        const sectionTitle = categorySection.querySelector('h3').textContent.trim();
        if (sectionTitle.includes('هواتف')) {
            category = 'هواتف';
        } else if (sectionTitle.includes('كمبيوتر')) {
            category = 'كمبيوتر';
        }
    }

    // إنشاء معرف فريد إذا لم يكن موجودًا
    let id = product.getAttribute('data-id');
    if (!id) {
        id = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }

    // تعيين الخصائص
    product.setAttribute('data-id', id);
    product.setAttribute('data-name', name);
    product.setAttribute('data-price', price);
    product.setAttribute('data-image', image);
    product.setAttribute('data-category', category);
}

/**
 * دالة توحيد هيكل المنتج
 */
function standardizeProductStructure(product) {
    // التأكد من وجود العناصر الأساسية
    let productImg = product.querySelector('.product-img');
    let productInfo = product.querySelector('.product-info');
    let rating = product.querySelector('.rating');
    let productPrice = product.querySelector('.product-price');
    let productActions = product.querySelector('.product-actions');

    // إنشاء العناصر المفقودة إذا لزم الأمر
    if (!productImg) {
        productImg = document.createElement('div');
        productImg.className = 'product-img';
        product.insertBefore(productImg, product.firstChild);
    }

    if (!productInfo) {
        productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        product.appendChild(productInfo);
    }

    // التأكد من وجود اسم المنتج
    if (!productInfo.querySelector('h4')) {
        const nameElement = document.createElement('h4');
        nameElement.textContent = product.getAttribute('data-name') || '';
        productInfo.insertBefore(nameElement, productInfo.firstChild);
    }

    // التأكد من وجود التقييم
    if (!rating) {
        rating = document.createElement('div');
        rating.className = 'rating';
        rating.setAttribute('data-product-id', product.getAttribute('data-id') || '');

        // إضافة نجوم التقييم
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            star.className = 'fas fa-star';
            rating.appendChild(star);
        }

        // إضافة عدد التقييمات
        const ratingCount = document.createElement('span');
        ratingCount.textContent = '(0)';
        rating.appendChild(ratingCount);

        productInfo.appendChild(rating);
    }

    // التأكد من وجود سعر المنتج
    if (!productPrice) {
        productPrice = document.createElement('div');
        productPrice.className = 'product-price';

        const currentPrice = document.createElement('span');
        currentPrice.className = 'current-price';
        currentPrice.textContent = product.getAttribute('data-price') ? 
            `${parseInt(product.getAttribute('data-price')).toLocaleString()} ريال` : '0 ريال';

        productPrice.appendChild(currentPrice);
        productInfo.appendChild(productPrice);
    }

    // التأكد من وجود أزرار الإجراءات
    if (!productActions) {
        productActions = document.createElement('div');
        productActions.className = 'product-actions';

        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart';
        addToCartBtn.textContent = 'أضف للسلة';

        productActions.appendChild(addToCartBtn);
        productInfo.appendChild(productActions);
    }
}

/**
 * دالة توحيد تنسيق جميع الصور
 */
function unifyImagesFormat() {
    // الحصول على جميع الصور في صفحة الإلكترونيات
    const images = document.querySelectorAll('.electronics-section .product-img img');

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
                        
                        // سيتم عرض الإشعار من cart-manager.js فقط لتجنب التكرار
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
