// ===== وظائف عامة =====
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة تسجيل الدخول
    checkLoginStatus();

    // تهيئة النوافذ المنبثقة
    initModals();

    // تهيئة عداد العروض
    initCountdown();

    // تهيئة سلة التسوق
    initCart();

    // تهيئة شريط التمرير
    initSlider();

    // تهيئة قائمة التنقل للشاشات الصغيرة
    initMobileMenu();

    // تهيئة نظام التقييم
    initRatingSystem();

});

// ===== قائمة التنقل للشاشات الصغيرة =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    const searchBar = document.querySelector('.search-bar');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault(); // منع السلوك الافتراضي للزر
            e.stopPropagation(); // منع انتشار الحدث

            // تبديل حالة القائمة
            mainMenu.classList.toggle('active');

            // إغلاق شريط البحث عند فتح القائمة
            if (mainMenu.classList.contains('active') && searchBar) {
                searchBar.style.display = 'none';
            }
        });

        // إغلاق القائمة عند النقر على رابط
        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // منع الانتقال للرابط
                mainMenu.classList.remove('active');
            });
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            // التحقق من أن النقر ليس على زر القائمة أو على القائمة نفسها
            if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                mainMenu.classList.remove('active');
            }
        });
    }

    // إظهار شريط البحث عند التركيز على حقل البحث
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput && searchBar) {
        searchInput.addEventListener('focus', () => {
            // إغلاق القائمة عند فتح شريط البحث
            if (mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
            }
            searchBar.style.display = 'block';
        });

        // إخفاء شريط البحث عند فقدان التركيز (إذا لم يكن هناك قيمة)
        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                setTimeout(() => {
                    searchBar.style.display = 'none';
                }, 200); // تأخير بسيط للسماح بالنقر على زر البحث
            }
        });
    }
}

// ===== النوافذ المنبثقة لتسجيل الدخول والتسجيل =====
function initModals() {
    // الحصول على أزرار تسجيل الدخول والتسجيل
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');

    // إنشاء نافذة تسجيل الدخول
    const loginModal = createModal('تسجيل الدخول', `
        <form id="login-form">
            <div class="form-group">
                <label for="login-email">البريد الإلكتروني</label>
                <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
                <label for="login-password">كلمة المرور</label>
                <input type="password" id="login-password" required>
            </div>
            <div class="form-group">
                <button type="submit" class="btn">تسجيل الدخول</button>
            </div>
            <div class="form-footer">
                <p>ليس لديك حساب؟ <a href="#" id="show-register">إنشاء حساب جديد</a></p>
            </div>
        </form>
    `);

    // إنشاء نافذة التسجيل
    const registerModal = createModal('إنشاء حساب جديد', `
        <form id="register-form">
            <div class="form-group">
                <label for="register-name">الاسم الكامل</label>
                <input type="text" id="register-name" required>
            </div>
            <div class="form-group">
                <label for="register-email">البريد الإلكتروني</label>
                <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
                <label for="register-password">كلمة المرور</label>
                <input type="password" id="register-password" required>
            </div>
            <div class="form-group">
                <label for="register-confirm-password">تأكيد كلمة المرور</label>
                <input type="password" id="register-confirm-password" required>
            </div>
            <div class="form-group">
                <button type="submit" class="btn">إنشاء حساب</button>
            </div>
            <div class="form-footer">
                <p>لديك حساب بالفعل؟ <a href="#" id="show-login">تسجيل الدخول</a></p>
            </div>
        </form>
    `);

    // إضافة النوافذ إلى الصفحة
    document.body.appendChild(loginModal);
    document.body.appendChild(registerModal);

    // إضافة مستمعي الأحداث للأزرار
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'flex';
    });

    // التبديل بين نافذتي تسجيل الدخول والتسجيل
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });

    // معالجة نماذج تسجيل الدخول والتسجيل
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // محاكاة التحقق من بيانات المستخدم
        // في تطبيق حقيقي، سيتم إرسال هذه البيانات إلى الخادم للتحقق منها
        const savedEmail = localStorage.getItem('userEmail');

        // التحقق من وجود البريد الإلكتروني في التخزين المحلي
        if (savedEmail && savedEmail === email) {
            // حفظ حالة تسجيل الدخول
            localStorage.setItem('isLoggedIn', 'true');

            // الحصول على اسم المستخدم
            const userName = localStorage.getItem('userName');

            // تحديث واجهة المستخدم
            updateUserInterface(userName);

            // إغلاق النافذة بعد تسجيل الدخول بنجاح
            loginModal.style.display = 'none';

            // عرض رسالة نجاح
            showNotification(`مرحباً ${userName}! تم تسجيل الدخول بنجاح!`, 'success');
        } else {
            // عرض رسالة خطأ
            showNotification('البريد الإلكتروني أو كلمة المرور غير صحيحة!', 'error');
        }
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // التحقق من تطابق كلمتي المرور
        if (password !== confirmPassword) {
            showNotification('كلمتا المرور غير متطابقتين!', 'error');
            return;
        }

        // حفظ بيانات المستخدم في التخزين المحلي
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        // تحديث واجهة المستخدم
        updateUserInterface(name);

        // إغلاق النافذة بعد التسجيل بنجاح
        registerModal.style.display = 'none';

        // عرض رسالة نجاح
        showNotification(`مرحباً ${name}! تم إنشاء الحساب بنجاح!`, 'success');
    });

    // إغلاق النوافذ عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
}

// إنشاء نافذة منبثقة
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    // إضافة مستمع حدث لزر الإغلاق
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    return modal;
}

// ===== عداد العروض =====
function initCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');

    countdownElements.forEach(countdown => {
        // تعيين وقت العرض (24 ساعة من الآن)
        const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);

        // تحديث العداد كل ثانية
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            // حساب الساعات والدقائق والثواني
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // تحديث العناصر
            const spans = countdown.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].textContent = hours.toString().padStart(2, '0');
                spans[1].textContent = minutes.toString().padStart(2, '0');
                spans[2].textContent = seconds.toString().padStart(2, '0');
            }

            // إيقاف العداد عند انتهاء الوقت
            if (distance < 0) {
                clearInterval(interval);
                countdown.innerHTML = '<span>00</span>:<span>00</span>:<span>00</span>';
            }
        }, 1000);
    });
}

// ===== سلة التسوق =====
function initCart() {
    // الحصول على أيقونة سلة التسوق
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');

    // الحصول على أزرار إضافة إلى السلة
    const addToCartButtons = document.querySelectorAll('.product-actions a:nth-child(2)');

    // عدد المنتجات في السلة
    let count = 0;

    // إضافة مستمعي الأحداث لأزرار الإضافة إلى السلة
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            cartCount.textContent = count;

            // عرض رسالة نجاح
            showNotification('تمت إضافة المنتج إلى سلة التسوق!', 'success');
        });
    });
}

// ===== شريط التمرير =====
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // إذا لم يكن هناك شرائح، لا تفعل شيئًا
    if (slides.length === 0) return;

    // إظهار الشريحة الأولى
    showSlide(currentSlide);

    // تغيير الشريحة كل 5 ثوانٍ
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

// عرض شريحة معينة
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');

    // إخفاء جميع الشرائح
    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    // إظهار الشريحة المطلوبة
    slides[index].style.display = 'block';
}

// ===== التحقق من حالة تسجيل الدخول =====
function checkLoginStatus() {
    // التحقق من حالة تسجيل الدخول من التخزين المحلي
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        // الحصول على اسم المستخدم
        const userName = localStorage.getItem('userName');

        // تحديث واجهة المستخدم
        updateUserInterface(userName);
    }
}

// ===== تحديث واجهة المستخدم =====
function updateUserInterface(userName) {
    // الحصول على عناصر واجهة المستخدم
    const userMenu = document.querySelector('.user-menu');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const userNameElement = document.querySelector('.user-name');
    const logoutBtn = document.querySelector('.logout-btn');
    const userNameDisplay = document.querySelector('.info-item p');

    // تحديث اسم المستخدم في الواجهة
    if (userNameElement) {
        userNameElement.textContent = userName;
    }

    // تحديث اسم المستخدم في قسم معلومات المستخدم
    if (userNameDisplay) {
        userNameDisplay.textContent = userName;
    }

    // إظهار قائمة المستخدم وإخفاء أزرار تسجيل الدخول والتسجيل
    if (userMenu) {
        userMenu.style.display = 'block';
    }

    if (loginBtn) {
        loginBtn.style.display = 'none';
    }

    if (registerBtn) {
        registerBtn.style.display = 'none';
    }

    // إضافة مستمع حدث لزر تسجيل الخروج
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // إزالة بيانات المستخدم من التخزين المحلي
            localStorage.removeItem('isLoggedIn');

            // إظهار أزرار تسجيل الدخول والتسجيل وإخفاء قائمة المستخدم
            if (userMenu) {
                userMenu.style.display = 'none';
            }

            if (loginBtn) {
                loginBtn.style.display = 'inline-block';
            }

            if (registerBtn) {
                registerBtn.style.display = 'inline-block';
            }

            // استعادة النص الأصلي في قسم معلومات المستخدم
            if (userNameDisplay) {
                userNameDisplay.textContent = 'اسم المستخدم';
            }

            // عرض رسالة نجاح
            showNotification('تم تسجيل الخروج بنجاح!', 'success');
        });
    }
}

// ===== نظام التقييم التفاعلي =====
function initRatingSystem() {
    // الحصول على جميع عناصر التقييم
    const ratingContainers = document.querySelectorAll('.rating');

    ratingContainers.forEach(container => {
        // الحصول على جميع النجوم في حاوية التقييم
        const stars = container.querySelectorAll('i');

        // إضافة مستمعي الأحداث للنقر على النجوم
        stars.forEach(star => {
            star.addEventListener('click', () => {
                // الحصول على قيمة التقييم
                const rating = parseInt(star.getAttribute('data-rating'));

                // إزالة الفئات من جميع النجوم
                stars.forEach(s => {
                    s.classList.remove('active');
                    s.classList.remove('fas');
                    s.classList.remove('clicked');
                    s.classList.add('far');
                });

                // إضافة الفئات للنجوم المحددة والنجوم التي تسبقها
                // الترتيب من اليسار إلى اليمين (1 إلى 5)
                for (let i = 0; i < rating; i++) {
                    stars[i].classList.add('active');
                    stars[i].classList.remove('far');
                    stars[i].classList.add('fas');

                    // إضافة تأثير التضليل للنجم الأخير المحدد
                    if (i === rating - 1) {
                        stars[i].classList.add('clicked');

                        // إزالة فئة التضليل بعد انتهاء الرسم المتحرك
                        setTimeout(() => {
                            stars[i].classList.remove('clicked');
                        }, 500);
                    }
                }

                // عرض رسالة نجاح
                showNotification(`شكراً لك! تم تقييم المنتج بـ ${rating} نجوم`, 'success');

                // عرض إشعار تأكيد التقييم
                setTimeout(() => {
                    showNotification('تم حفظ تقييمك بنجاح', 'info');
                }, 1500);
            });

            // إضافة تأثير عند تمرير الماوس
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.getAttribute('data-rating'));

                // إزالة الفئة النشطة من جميع النجوم
                stars.forEach(s => {
                    if (!s.classList.contains('active')) {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });

                // إضافة الفئة النشطة للنجوم المحددة والنجوم التي تسبقها
                // الترتيب من اليسار إلى اليمين (1 إلى 5)
                for (let i = 0; i < rating; i++) {
                    if (!stars[i].classList.contains('active')) {
                        stars[i].classList.remove('far');
                        stars[i].classList.add('fas');
                    }
                }
            });
        });

        // استعادة الحالة الأصلية عند مغادرة حاوية التقييم
        container.addEventListener('mouseleave', () => {
            stars.forEach(star => {
                if (!star.classList.contains('active')) {
                    star.classList.remove('fas');
                    star.classList.add('far');
                } else {
                    star.classList.remove('far');
                    star.classList.add('fas');
                }
            });
        });
    });
}

// ===== عرض الإشعارات =====
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);

    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('show');

        // إزالة الإشعار من الصفحة بعد انتهاء الانتقال
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
