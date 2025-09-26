// وظيفة التقييم التفاعلي
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على جميع عناصر التقييم في الصفحة
    const ratings = document.querySelectorAll('.rating');

    ratings.forEach(rating => {
        const stars = rating.querySelectorAll('.fas, .far');
        const ratingValue = rating.querySelector('span');
        let currentRating = 0;

        // إضافة مستمعي الأحداث للنجوم
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                // تحديث التقييم الحالي
                currentRating = index + 1;

                // تحديث عرض النجوم
                updateStars(stars, currentRating);

                // تحديث قيمة التقييم
                if (ratingValue) {
                    // زيادة عدد التقييمات
                    const currentCount = parseInt(ratingValue.textContent.match(/\d+/)[0]);
                    ratingValue.textContent = `(${currentCount + 1})`;
                }

                // حفظ التقييم في التخزين المحلي (يمكن استبداله لاحقًا بقاعدة بيانات)
                const productId = rating.closest('.product-card').querySelector('h3').textContent;
                localStorage.setItem(`rating_${productId}`, currentRating);

                // عرض رسالة شكر للمستخدم
                showThankYouMessage();
            });

            // تأثير hover عند تمرير الماوس
            star.addEventListener('mouseenter', function() {
                updateStars(stars, index + 1);
            });
        });

        // استعادة التقييم عند مغادرة الماوس إذا لم يتم النقر
        rating.addEventListener('mouseleave', function() {
            updateStars(stars, currentRating);
        });

        // تحميل التقييم المحفوظ مسبقًا
        const productId = rating.closest('.product-card').querySelector('h3').textContent;
        const savedRating = localStorage.getItem(`rating_${productId}`);
        if (savedRating) {
            currentRating = parseInt(savedRating);
            updateStars(stars, currentRating);
        }
    });

    // وظيفة لتحديث عرض النجوم
    function updateStars(stars, rating) {
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

    // وظيفة لعرض رسالة شكر للمستخدم
    function showThankYouMessage() {
        // إنشاء عنصر الرسالة
        const message = document.createElement('div');
        message.className = 'rating-thanks';
        message.textContent = 'شكراً لتقييمك!';
        message.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #232f3e;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // إضافة الرسالة إلى الصفحة
        document.body.appendChild(message);

        // عرض الرسالة
        setTimeout(() => {
            message.style.opacity = '1';
        }, 10);

        // إخفاء الرسالة بعد 3 ثواني
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
});