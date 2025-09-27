
// تحسينات للتفاعل على الشاشات الصغيرة
document.addEventListener('DOMContentLoaded', function() {
    // زيادة حجم النقرات للأزرار على الشاشات الصغيرة
    if (window.innerWidth <= 768) {
        const buttons = document.querySelectorAll('button, .btn, .add-to-cart, .cart-icon, .account, .admin-panel, .points-balance');
        buttons.forEach(button => {
            button.style.minHeight = '44px'; // الحد الأدنى الموصى به لسهولة اللمس
            button.style.minWidth = '44px'; // الحد الأدنى الموصى به لسهولة اللمس
        });
    }

    // إضافة تأثيرات لمس أفضل للروابط
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });

        link.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });

    // تحسينات للسحب والإفلات
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        draggable.addEventListener('touchstart', dragStart, false);
        draggable.addEventListener('touchend', dragEnd, false);
        draggable.addEventListener('touchmove', drag, false);

        function dragStart(e) {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;

            if (e.target === draggable || draggable.contains(e.target)) {
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                draggable.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }
    });

    // تحسينات للتمرير الأفقي
    const horizontalScrolls = document.querySelectorAll('.horizontal-scroll');
    horizontalScrolls.forEach(scroll => {
        let isDown = false;
        let startX;
        let scrollLeft;

        scroll.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - scroll.offsetLeft;
            scrollLeft = scroll.scrollLeft;
        });

        scroll.addEventListener('touchend', () => {
            isDown = false;
        });

        scroll.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - scroll.offsetLeft;
            const walk = (x - startX) * 2; // سرعة التمرير
            scroll.scrollLeft = scrollLeft - walk;
        });
    });

    // تحسينات للنقر المزدوج
    const doubleTapElements = document.querySelectorAll('.double-tap');
    doubleTapElements.forEach(element => {
        let lastTap = 0;
        element.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                // هذا نقر مزدوج
                e.preventDefault();
                // تنفيذ وظيفة النقر المزدوج هنا
                element.dispatchEvent(new Event('doubletap'));
            }
            lastTap = currentTime;
        });
    });

    // تحسينات للضغط الطويل
    const longPressElements = document.querySelectorAll('.long-press');
    longPressElements.forEach(element => {
        let pressTimer;

        element.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(function() {
                // تنفيذ وظيفة الضغط الطويل هنا
                element.dispatchEvent(new Event('longpress'));
            }, 500);
        });

        element.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });
    });

    // تحسينات للتحريك السريع
    const swipeElements = document.querySelectorAll('.swipe');
    swipeElements.forEach(element => {
        let touchstartX = 0;
        let touchendX = 0;

        element.addEventListener('touchstart', function(e) {
            touchstartX = e.changedTouches[0].screenX;
        });

        element.addEventListener('touchend', function(e) {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchendX < touchstartX - 50) {
                // تحريك لليسار
                element.dispatchEvent(new Event('swipeleft'));
            }
            if (touchendX > touchstartX + 50) {
                // تحريك لليمين
                element.dispatchEvent(new Event('swiperight'));
            }
        }
    });

    // تحسينات للتكبير والتصغير
    const pinchElements = document.querySelectorAll('.pinch');
    pinchElements.forEach(element => {
        let initialDistance = 0;
        let currentDistance = 0;
        let scale = 1;

        element.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                initialDistance = getDistance(e.touches[0], e.touches[1]);
            }
        });

        element.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                e.preventDefault();
                currentDistance = getDistance(e.touches[0], e.touches[1]);
                const scaleChange = currentDistance / initialDistance;
                scale = scale * scaleChange;
                element.style.transform = `scale(${scale})`;
                initialDistance = currentDistance;
            }
        });

        function getDistance(touch1, touch2) {
            const dx = touch1.pageX - touch2.pageX;
            const dy = touch1.pageY - touch2.pageY;
            return Math.sqrt(dx * dx + dy * dy);
        }
    });

    // تحسينات للتمرير السلس
    const smoothScrollElements = document.querySelectorAll('.smooth-scroll');
    smoothScrollElements.forEach(element => {
        element.style.scrollBehavior = 'smooth';
    });

    // تحسينات للتمرير اللانهائي
    const infiniteScrollElements = document.querySelectorAll('.infinite-scroll');
    infiniteScrollElements.forEach(element => {
        let isLoading = false;

        element.addEventListener('scroll', function() {
            if (element.scrollTop + element.clientHeight >= element.scrollHeight - 100 && !isLoading) {
                isLoading = true;
                // تحميل المزيد من المحتوى هنا
                element.dispatchEvent(new Event('loadmore'));
            }
        });
    });

    // تحسينات للتحديث بالسحب
    const pullToRefreshElements = document.querySelectorAll('.pull-to-refresh');
    pullToRefreshElements.forEach(element => {
        let startY = 0;
        let currentY = 0;
        let isPulling = false;

        element.addEventListener('touchstart', function(e) {
            if (element.scrollTop === 0) {
                startY = e.touches[0].pageY;
                isPulling = true;
            }
        });

        element.addEventListener('touchmove', function(e) {
            if (isPulling) {
                currentY = e.touches[0].pageY;
                const pullDistance = currentY - startY;
                if (pullDistance > 0) {
                    e.preventDefault();
                    element.style.transform = `translateY(${pullDistance * 0.5}px)`;
                }
            }
        });

        element.addEventListener('touchend', function() {
            if (isPulling) {
                const pullDistance = currentY - startY;
                if (pullDistance > 100) {
                    // تحديث الصفحة هنا
                    element.dispatchEvent(new Event('refresh'));
                }
                element.style.transform = 'translateY(0)';
                isPulling = false;
            }
        });
    });
});
