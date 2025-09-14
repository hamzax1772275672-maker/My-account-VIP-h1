// Firebase configuration
// تم إضافة مدير الإشعارات الموحد (notification-manager.js) لاستبدال الدوال المكررة
const firebaseConfig = {
    apiKey: "AIzaSyDp6n4Ep8Ox8wif6iwjeflHJKZh5ZvmU-s",
    authDomain: "my-account-vip.firebaseapp.com",
    projectId: "my-account-vip",
    storageBucket: "my-account-vip.firebasestorage.app",
    messagingSenderId: "30582754466",
    appId: "1:30582754466:web:4c922d786ce1bf8c739bfb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const copyButton = document.querySelector('.copy-btn');
    const codeText = document.querySelector('.code-text');

    // Generate random invitation code on page load
    generateInvitationCode();

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

                            showNotification('تم تسجيل الدخول بنجاح! جاري توجيهك إلى الصفحة الرئيسية', 'success');

                            // Redirect to home page after successful login
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 2000);
                        }
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

    // Copy invitation code functionality
    if (copyButton && codeText) {
        copyButton.addEventListener('click', function() {
            const code = codeText.textContent;

            // Copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
                showNotification('تم نسخ الرمز بنجاح!', 'success');

                // Change button text temporarily
                const originalText = copyButton.textContent;
                copyButton.textContent = 'تم النسخ!';

                // Reset button text after 2 seconds
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }).catch(err => {
                showNotification('فشل نسخ الرمز. يرجى نسخه يدوياً', 'error');
                console.error('Could not copy text: ', err);
            });
        });
    }

    // Function to generate random invitation code
    function generateInvitationCode() {
        if (codeText) {
            // Generate a random code in format VIP-XXXX-XXXX where X is alphanumeric
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = 'VIP-';

            // First part (4 characters)
            for (let i = 0; i < 4; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            code += '-';

            // Second part (4 characters)
            for (let i = 0; i < 4; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            // Set the generated code
            codeText.textContent = code;

            // Store the code in localStorage for reference
            localStorage.setItem('invitationCode', code);
        }
    }

    // Function to generate multiple invitation codes
    function generateMultipleInvitationCodes(count = 10) {
        const codes = [];
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (let j = 0; j < count; j++) {
            let code = 'VIP-';

            // First part (4 characters)
            for (let i = 0; i < 4; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            code += '-';

            // Second part (4 characters)
            for (let i = 0; i < 4; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            codes.push(code);
        }

        return codes;
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

    // Share functionality
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const code = codeText.textContent;
            const shareText = `انضم إلى My account VIP باستخدام رمز الدعوة الخاص بي: ${code}`;
            const shareUrl = window.location.href;

            if (this.classList.contains('telegram')) {
                // Share on Telegram
                window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
            }
        });
    });
});
