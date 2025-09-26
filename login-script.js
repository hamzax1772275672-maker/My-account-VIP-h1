// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQ7Yw-xUgwTxKmnVPPsjeObWLX9xaKTms",
    authDomain: "my-account-vip.firebaseapp.com",
    projectId: "my-account-vip",
    storageBucket: "my-account-vip.firebasestorage.app",
    messagingSenderId: "30582754466",
    appId: "1:30582754466:web:4c922d786ce1bf8c739bfb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// دالة التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;

            // Validation flags
            let isValid = true;
            let errorMessage = '';

            // Validate email
            if (email === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال البريد الإلكتروني';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage = 'الرجاء إدخال بريد إلكتروني صحيح';
            }

            // Validate password
            if (isValid && password === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال كلمة المرور';
            }

            // Show notification based on validation
            if (isValid) {
                showNotification('جاري تسجيل الدخول...', 'info');

                // Sign in with Firebase Authentication
                console.log('Attempting to sign in with email:', email);
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        console.log('Sign in successful');

                        // Store username in localStorage
                        localStorage.setItem('username', email);

                        // Get display name from Firebase user profile
                        const displayName = userCredential.user.displayName;
                        if (displayName) {
                            localStorage.setItem('displayName', displayName);
                        } else {
                            // If no display name, use email username
                            const username = email.split('@')[0];
                            localStorage.setItem('displayName', username);
                        }

                        // Store user ID for future reference
                        localStorage.setItem('userId', userCredential.user.uid);

                        // Update last login timestamp
                        localStorage.setItem('lastLogin', new Date().toISOString());

                        showNotification('تم تسجيل الدخول بنجاح! جاري توجيهك إلى الصفحة الرئيسية', 'success');

                        // Redirect to home page after successful login
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    })
                    .catch((error) => {
                        console.error('Sign in error:', error);
                        const errorCode = error.code;
                        let errorMessage = '';

                        // Check if the error is related to Firebase configuration
                        if (error.message.includes("API key") || error.message.includes("invalid") || error.code === "auth/invalid-api-key") {
                            errorMessage = 'خطأ في إعدادات Firebase. يرجى التواصل مع إدارة الموقع لتحديث إعدادات المصادقة.';
                        } else {
                            switch(errorCode) {
                                case 'auth/user-not-found':
                                    errorMessage = 'المستخدم غير موجود';
                                    break;
                                case 'auth/wrong-password':
                                    errorMessage = 'كلمة المرور غير صحيحة';
                                    break;
                                case 'auth/invalid-login-credentials':
                                    errorMessage = 'بيانات تسجيل الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';
                                    break;
                                case 'auth/invalid-email':
                                    errorMessage = 'البريد الإلكتروني غير صالح';
                                    break;
                                case 'auth/user-disabled':
                                    errorMessage = 'تم تعطيل حساب هذا المستخدم';
                                    break;
                                case 'auth/too-many-requests':
                                    errorMessage = 'تم حظر الوصول مؤقتاً بسبب محاولات تسجيل دخول كثيرة. يرجى المحاولة لاحقاً';
                                    break;
                                default:
                                    errorMessage = 'حدث خطأ أثناء تسجيل الدخول: ' + error.message;
                            }
                        }

                        showNotification(errorMessage, 'error');
                    });
            } else {
                showNotification(errorMessage, 'error');
            }
        });
    }







    // Forgot password functionality
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const resetPasswordSection = document.getElementById('resetPasswordSection');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const cancelResetBtn = document.getElementById('cancelResetBtn');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            resetPasswordSection.style.display = 'block';
        });
    }

    if (cancelResetBtn) {
        cancelResetBtn.addEventListener('click', function() {
            resetPasswordSection.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', function() {
            const resetEmail = document.getElementById('resetEmail').value.trim();

            if (!resetEmail) {
                showNotification('الرجاء إدخال بريدك الإلكتروني', 'error');
                return;
            }

            if (!isValidEmail(resetEmail)) {
                showNotification('الرجاء إدخال بريد إلكتروني صحيح', 'error');
                return;
            }

            showNotification('جاري إرسال رابط إعادة تعيين كلمة المرور...', 'info');

            // Send password reset email
            auth.sendPasswordResetEmail(resetEmail)
                .then(() => {
                    showNotification('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');

                    // Hide reset section and show login form after a delay
                    setTimeout(() => {
                        resetPasswordSection.style.display = 'none';
                        loginForm.style.display = 'block';
                        document.getElementById('resetEmail').value = '';
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Error sending password reset email:', error);
                    let errorMessage = '';

                    switch(error.code) {
                        case 'auth/user-not-found':
                            errorMessage = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'البريد الإلكتروني غير صالح';
                            break;
                        case 'auth/too-many-requests':
                            errorMessage = 'تم حظر الوصول مؤقتاً بسبب محاولات كثيرة. يرجى المحاولة لاحقاً';
                            break;
                        default:
                            errorMessage = 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور: ' + error.message;
                    }

                    showNotification(errorMessage, 'error');
                });
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show notification function
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        // Add type class
        if (type === 'success') {
            notification.classList.add('success');
        } else if (type === 'error') {
            notification.classList.add('error');
        } else if (type === 'info') {
            notification.classList.add('info');
        }

        // Add to body
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');

            // Remove from DOM after transition completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Add input event listeners for real-time validation feedback
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() !== '' && !isValidEmail(this.value.trim())) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }


});
