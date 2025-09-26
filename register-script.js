// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQ7Yw-xUgwTxKmnVPPsjeObWLX9xaKTms", // استبدل هذا بمفتاح API الفعلي الخاص بمشروعك
    authDomain: "my-account-vip.firebaseapp.com",
    projectId: "my-account-vip",
    storageBucket: "my-account-vip.firebasestorage.app",
    messagingSenderId: "30582754466",
    appId: "1:30582754466:web:4c922d786ce1bf8c739bfb"
};

// Initialize Firebase with error handling
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Error initializing Firebase:", error);
    // Show user-friendly error if Firebase fails to initialize
    document.addEventListener('DOMContentLoaded', function() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'firebase-error';
            errorDiv.style.color = '#f44336';
            errorDiv.style.padding = '15px';
            errorDiv.style.marginBottom = '20px';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.backgroundColor = '#ffebee';
            errorDiv.style.borderRadius = '4px';
            errorDiv.innerHTML = 'حدث خطأ في الاتصال بخدمات المصادقة. يرجى المحاولة مرة أخرى لاحقًا.';

            registerForm.parentNode.insertBefore(errorDiv, registerForm);
            registerForm.style.display = 'none';
        }
    });
}

// Only get auth if initialization was successful
let auth;
try {
    auth = firebase.auth();
} catch (error) {
    console.error("Error getting auth instance:", error);
}

// دالة التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// دالة التحقق من صحة رقم الهاتف - تقبل أي رقم
function isValidPhone(phone) {
    // تقبل أي رقم هاتف غير فارغ
    return phone.trim() !== '';
}

// تم إزالة نظام رموز الدعوة

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
   
    const registerForm = document.getElementById('registerForm');
    const telegramLoginBtn = document.getElementById('telegramLoginBtn');
    // إضافة مستمع لزر التسجيل بحساب Telegram
if (telegramLoginBtn) {
    telegramLoginBtn.addEventListener('click', function() {
        try {
            // تأثير بصري عند النقر
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
            
            // تأخير قصير قبل فتح النافذة
            setTimeout(() => {
                // إنشاء نافذة منبثقة لتسجيل الدخول عبر Telegram
                const telegramWindow = window.open('', 'Telegram Login', 'width=600,height=500');
                
                // التحقق من نجاح فتح النافذة
                if (!telegramWindow || telegramWindow.closed || typeof telegramWindow.closed === 'boolean') {
                    showNotification('فشل فتح نافذة تسجيل الدخول. يرجى السماح بالنوافذ المنبثقة في متصفحك.', 'error');
                    this.style.transform = 'scale(1)';
                    return;
                }

                // توجيه النافذة المنبثقة
                // استخدام رابط ديناميكي يعمل مع كل من البيئة المحلية والبيئة المنتجة
                const origin = window.location.origin;
                telegramWindow.location.href = `https://oauth.telegram.org/auth?bot_id=6803998447&origin=${encodeURIComponent(origin)}&return_to=${encodeURIComponent(origin + '/telegram-auth-callback.html')}&request_access=write`;
                
                // إظهار رسالة انتظار
                showNotification('جاري فتح نافذة تسجيل الدخول عبر Telegram...', 'info');
            }, 100);
        } catch (error) {
            // إعادة تعيين تأثير النقر في حالة حدوث خطأ
            this.style.transform = 'scale(1)';
            showNotification('خطأ في الاتصال بالخادم', 'error');
            console.error('Error:', error);
        }
    });
    
    // إضافة مستمع لرسائل النافذة المنبثقة
    window.addEventListener('message', function(event) {
        // التحقق من مصدر الرسالة للأمان
        if (event.origin !== window.location.origin) return;

        // التحقق من نجاح المصادقة
        if (event.data && event.data.type === 'telegram-auth-success') {
            const userData = event.data.userData;

            // تعبئة نموذج التسجيل بالبيانات المستلمة من Telegram
            document.getElementById('firstName').value = userData.first_name || '';
            document.getElementById('lastName').value = userData.last_name || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('phone').value = userData.phone || '';

            // حفظ بيانات Telegram في localStorage للاستخدام لاحقاً
            localStorage.setItem('telegramAuthData', JSON.stringify(userData));

            // إظهار إشعار بنجاح المصادقة
            showNotification('تم تسجيل الدخول بحساب Telegram بنجاح! يرجى إكمال البيانات المتبقية.', 'success');
            
            // تمرير التركيز إلى الحقل التالي
            document.getElementById('lastName').focus();
            
            // إعادة تعيين تأثير النقر
            document.getElementById('telegramLoginBtn').style.transform = 'scale(1)';
        } else if (event.data && event.data.type === 'telegram-auth-error') {
            showNotification('فشل تسجيل الدخول بحساب Telegram: ' + event.data.error, 'error');
            // إعادة تعيين تأثير النقر
            document.getElementById('telegramLoginBtn').style.transform = 'scale(1)';
        }
    });
}

    // Password strength checker
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthText = document.getElementById('strengthText');
    const passwordStrength = document.getElementById('passwordStrength');

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;

            // Check password length
            if (password.length >= 8) {
                strength += 1;
            }

            // Check for mixed case
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
                strength += 1;
            }

            // Check for numbers
            if (password.match(/[0-9]/)) {
                strength += 1;
            }

            // Check for special characters
            if (password.match(/[^a-zA-Z0-9]/)) {
                strength += 1;
            }

            // Update UI based on strength
            passwordStrength.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

            if (password.length === 0) {
                strengthIndicator.style.width = '0';
                strengthText.textContent = 'قوة كلمة المرور';
            } else if (strength < 2) {
                passwordStrength.classList.add('strength-weak');
                strengthText.textContent = 'ضعيفة';
            } else if (strength < 4) {
                passwordStrength.classList.add('strength-medium');
                strengthText.textContent = 'متوسطة';
            } else {
                passwordStrength.classList.add('strength-strong');
                strengthText.textContent = 'قوية';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.querySelector('input[name="terms"]').checked;

            // Validation flags
            let isValid = true;
            let errorMessage = '';

            // Validate first name
            if (firstName === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال الاسم الأول';
            }

            // Validate last name
            if (isValid && lastName === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال الاسم الأخير';
            }

            // Validate email
            if (isValid && email === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال البريد الإلكتروني';
            } else if (isValid && !isValidEmail(email)) {
                isValid = false;
                errorMessage = 'الرجاء إدخال بريد إلكتروني صحيح';
            }

            // Validate phone
            if (isValid && phone === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال رقم الهاتف';
            } else if (isValid && !isValidPhone(phone)) {
                isValid = false;
                errorMessage = 'الرجاء إدخال رقم هاتف صحيح';
            }

            // Validate password - تقبل أي كلمة مرور غير فارغة
            if (isValid && password === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال كلمة المرور';
            }

            // Validate confirm password
            if (isValid && confirmPassword === '') {
                isValid = false;
                errorMessage = 'الرجاء تأكيد كلمة المرور';
            } else if (isValid && password !== confirmPassword) {
                isValid = false;
                errorMessage = 'كلمتا المرور غير متطابقتين';
            }

            // تم إزالة التحقق من رمز الدعوة
            


            // Validate terms acceptance
            if (isValid && !termsAccepted) {
                isValid = false;
                errorMessage = 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية';
            }

            // Show notification based on validation
            if (isValid) {
                // Get Telegram auth data if available
                const telegramAuthData = localStorage.getItem('telegramAuthData');
                
                // Create user with Firebase Authentication
                if (!auth) {
                    showNotification('خدمة المصادقة غير متاحة حالياً. يرجى تحديث الصفحة والمحاولة مرة أخرى.', 'error');
                    return;
                }

                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Update user profile with display name
                        userCredential.user.updateProfile({
                                    displayName: firstName + ' ' + lastName
                                }).then(() => {
                                    // Store user data in localStorage
                                    localStorage.setItem('username', email);
                                    localStorage.setItem('displayName', firstName + ' ' + lastName);
                                    localStorage.setItem('userId', userCredential.user.uid);
                                    localStorage.setItem('userEmail', email);
                                    localStorage.setItem('userPhone', phone);
                                    localStorage.setItem('registrationDate', new Date().toISOString());
                                    localStorage.setItem('lastLogin', new Date().toISOString());
                                    localStorage.setItem('isVerified', 'true');
                                    localStorage.setItem('firstName', firstName);
                                    localStorage.setItem('lastName', lastName);
                                    
                                    // Send Telegram auth data to database if available
                                    if (telegramAuthData) {
                                        const telegramData = JSON.parse(telegramAuthData);
                                        
                                        // Save Telegram data to Firebase
                                        firebase.database().ref('users/' + userCredential.user.uid + '/telegram').set({
                                            id: telegramData.id,
                                            first_name: telegramData.first_name,
                                            last_name: telegramData.last_name,
                                            username: telegramData.username,
                                            photo_url: telegramData.photo_url,
                                            auth_date: telegramData.auth_date
                                        }).then(() => {
                                            console.log('Telegram data saved to database');
                                            // Clear Telegram auth data from localStorage
                                            localStorage.removeItem('telegramAuthData');
                                        }).catch((error) => {
                                            console.error('Error saving Telegram data:', error);
                                        });
                                    }

                                    // Show success message
                                    showNotification('تم إنشاء حسابك بنجاح!', 'success');

                                    // Reset form
                                    registerForm.reset();

                                    // Redirect to login page after 5 seconds
                                    setTimeout(() => {
                                        window.location.href = 'login.html';
                                    }, 5000);
                                })
                                .catch((error) => {
                                    console.error('Error updating profile:', error);
                                    showNotification('حدث خطأ أثناء تحديث بيانات الملف الشخصي: ' + error.message, 'error');
                                });
                            })
                            .catch((error) => {
                                console.error('Error sending verification email:', error);
                                showNotification('حدث خطأ أثناء إرسال رسالة التحقق: ' + error.message, 'error');
                            })
                            .catch((error) => {
                        const errorCode = error.code;
                        let errorMessage = '';

                        // Check if the error is related to Firebase configuration
                        if (error.message.includes("API key") || error.message.includes("invalid") || error.code === "auth/invalid-api-key") {
                            errorMessage = 'خطأ في إعدادات Firebase. يرجى التواصل مع إدارة الموقع لتحديث إعدادات المصادقة.';
                        } else {
                            switch(errorCode) {
                                case 'auth/email-already-in-use':
                                    errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                                    break;
                                case 'auth/invalid-email':
                                    errorMessage = 'البريد الإلكتروني غير صالح';
                                    break;
                                case 'auth/operation-not-allowed':
                                    errorMessage = 'إنشاء الحسابات غير مفعل حالياً';
                                    break;
                                case 'auth/weak-password':
                                    errorMessage = 'كلمة المرور ضعيفة جداً';
                                    break;
                                default:
                                    errorMessage = 'حدث خطأ أثناء إنشاء الحساب: ' + error.message;
                            }
                        }

                        showNotification(errorMessage, 'error');
                    });
            } else {
                showNotification(errorMessage, 'error');
            }
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation function (for multiple formats)
    function isValidPhone(phone) {
        // Remove any non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');

        // Check if it's a valid phone number (accepting various formats)
        // Accept numbers between 9-15 digits (international standard)
        if (cleanPhone.length < 9 || cleanPhone.length > 15) {
            return false;
        }

        // Accept any valid phone number format
        return true;
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
    const phoneInput = document.getElementById('phone');
    // passwordInput is already defined above (line 148)
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() !== '' && !isValidEmail(this.value.trim())) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value.trim() !== '' && !isValidPhone(this.value.trim())) {
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

            // Check if confirm password matches
            if (confirmPasswordInput.value !== '') {
                if (this.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.style.borderColor = '#f44336';
                } else {
                    confirmPasswordInput.style.borderColor = '#ddd';
                }
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }

    // تم إزالة التحقق من حقل رمز الدعوة

    // تم إزالة وظيفة عرض وتوليد رموز الدعوة بالكامل
});
