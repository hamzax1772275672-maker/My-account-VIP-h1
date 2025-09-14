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
    // Load invitation codes from file
    fetch('invitation-codes-list.txt')
        .then(response => response.text())
        .then(text => {
            // Split text by lines and filter out empty lines
            const codesFromFile = text.split(/\r?\n/).filter(line => line.trim() !== '');
            // Save to localStorage for future use
            localStorage.setItem('validInvitationCodes', JSON.stringify(codesFromFile));
            console.log('Loaded ' + codesFromFile.length + ' invitation codes');
        })
        .catch(error => {
            console.error('Error loading invitation codes:', error);
        });
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
                telegramWindow.location.href = 'https://oauth.telegram.org/auth?bot_id=6803998447&origin=https://myaccountvip.com&return_to=https://myaccountvip.com/telegram-auth-callback&request_access=write';
                
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
            const invitationCode = document.getElementById('invitationCode').value.trim();
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

            // Validate password
            if (isValid && password === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال كلمة المرور';
            } else if (isValid && password.length < 6) {
                isValid = false;
                errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
            }

            // Validate confirm password
            if (isValid && confirmPassword === '') {
                isValid = false;
                errorMessage = 'الرجاء تأكيد كلمة المرور';
            } else if (isValid && password !== confirmPassword) {
                isValid = false;
                errorMessage = 'كلمتا المرور غير متطابقتين';
            }

            // Validate invitation code
            if (isValid && invitationCode === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال رمز الدعوة';
            } else if (isValid && !isValidInvitationCode(invitationCode)) {
                isValid = false;
                errorMessage = 'رمز الدعوة غير صحيح. يرجى التحقق من رمز الدعوة والمحاولة مرة أخرى';
            }
            


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
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Update user profile with display name
                        userCredential.user.updateProfile({
                                    displayName: firstName + ' ' + lastName
                                }).then(() => {
                                    // Store user data in localStorage
                                    localStorage.setItem('username', email);
                                    localStorage.setItem('firstName', firstName);
                                    localStorage.setItem('lastName', lastName);
                                    localStorage.setItem('displayName', firstName + ' ' + lastName);
                                    
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
                                }).catch((error) => {
                                    console.error('Error updating profile:', error);
                                    showNotification('حدث خطأ أثناء تحديث بيانات الملف الشخصي: ' + error.message, 'error');
                                });
                            })
                            .catch((error) => {
                                console.error('Error sending verification email:', error);
                                showNotification('حدث خطأ أثناء إرسال رسالة التحقق: ' + error.message, 'error');
                            });
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

    // Invitation code validation function
    function isValidInvitationCode(code) {
        // Generate valid invitation codes dynamically based on a pattern
        // The pattern is: VIP-XXX-XXX-XXX where X is alphanumeric
        const pattern = /^VIP-[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/;

        // Log the code and pattern test result for debugging
        console.log('Testing invitation code:', code);
        console.log('Pattern test result:', pattern.test(code));

        // Check if the code matches the pattern
        if (!pattern.test(code)) {
            return false;
        }
        
        // Get valid codes from localStorage
        const validCodes = JSON.parse(localStorage.getItem('validInvitationCodes')) || [];
        
        // If no valid codes in localStorage, load them from the text file
        if (validCodes.length === 0) {
            // In a real application, you would fetch this from a server
            // For this demo, we'll use a hardcoded list of valid codes from invitation-codes-list.txt
            const defaultValidCodes = [
                "VIP-BGI-016-YFA", "VIP-BLC-416-RGU", "VIP-AJK-798-STA", "VIP-TTR-244-NBE", "VIP-MEC-552-KDQ",
                "VIP-SGC-742-CMA", "VIP-DYZ-574-ZYP", "VIP-OYJ-751-EGD", "VIP-WDB-537-DAJ", "VIP-FXP-987-WSP",
                "VIP-HMS-546-SPB", "VIP-SMD-158-OBB", "VIP-RHK-130-YWT", "VIP-YFM-335-ICG", "VIP-BXK-395-MVG",
                "VIP-JTQ-775-PDL", "VIP-FYY-218-YDC", "VIP-AXA-189-KVV", "VIP-QSD-538-KKX", "VIP-BNP-156-MGF",
                "VIP-AUE-396-OHP", "VIP-WQU-544-TQE", "VIP-MSX-878-FLZ", "VIP-JHC-976-FBV", "VIP-KNL-581-EWI",
                "VIP-JWR-040-BNX", "VIP-DYR-131-PYH", "VIP-RXU-646-BPY", "VIP-URF-275-WSP", "VIP-JGB-640-CYY",
                "VIP-PGI-419-VAW", "VIP-GYQ-515-UUJ", "VIP-FTF-672-LYP", "VIP-IHQ-522-XRZ", "VIP-ZKC-629-GWP",
                "VIP-DVE-874-MDD", "VIP-QOF-276-ELK", "VIP-DXK-478-RCU", "VIP-YFY-043-RXI", "VIP-FME-444-BTZ",
                "VIP-VRD-825-UXR", "VIP-SOQ-995-QHE", "VIP-XSI-515-FVR", "VIP-XLN-803-ZOE", "VIP-UCA-474-FWN",
                "VIP-DHN-025-QMM", "VIP-QKR-857-WDF", "VIP-PAX-787-FYR", "VIP-CBO-370-OGU", "VIP-BEN-374-YUB",
                "VIP-UZM-978-UEU", "VIP-MDD-430-TDT", "VIP-XLK-144-SFY", "VIP-EJD-055-LMO", "VIP-WEJ-523-ELE",
                "VIP-UJK-013-FBZ", "VIP-EMG-311-KDZ", "VIP-YFL-007-XVR", "VIP-SIH-659-SPJ", "VIP-ZFZ-507-UBG",
                "VIP-UPX-101-IWN", "VIP-WPM-711-RCG", "VIP-LCM-798-VMC", "VIP-ZKX-272-UNY", "VIP-TMT-715-IQO",
                "VIP-WLJ-503-RDL", "VIP-GDU-400-SRY", "VIP-PNS-993-TET", "VIP-ORB-141-BTA", "VIP-XOZ-916-NXV",
                "VIP-TBI-140-WAN", "VIP-JFH-395-OVB", "VIP-DJB-220-UOR", "VIP-JBD-389-CCN", "VIP-MKH-010-JOL",
                "VIP-XZJ-597-DOO", "VIP-IZU-207-BJL", "VIP-HEB-957-SFD", "VIP-PYY-542-VFK", "VIP-YIV-949-XEL",
                "VIP-PWF-042-TNV", "VIP-ISF-130-XKK", "VIP-SVG-200-WYR", "VIP-VWE-249-VLX", "VIP-HGW-163-JXQ",
                "VIP-VCH-578-BZG", "VIP-GTE-802-NMU", "VIP-OUJ-079-MTT", "VIP-PQQ-285-YYN", "VIP-ZLI-468-QLF",
                "VIP-CKS-821-SDW", "VIP-VCC-715-IRR", "VIP-IPO-118-WWF", "VIP-XEQ-052-TTJ", "VIP-ZDS-544-SSM",
                "VIP-PSB-051-SIO", "VIP-HUB-062-ANF", "VIP-XQA-827-IEW", "VIP-QFX-376-AJR"
            ];
            
            // Save to localStorage for future use
            localStorage.setItem('validInvitationCodes', JSON.stringify(defaultValidCodes));
            
            // Check if the code is in the default list
            return defaultValidCodes.includes(code);
        }
        
        // Check if the code is in the valid codes list
        return validCodes.includes(code);
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
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const invitationCodeInput = document.getElementById('invitationCode');

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

    if (invitationCodeInput) {
        invitationCodeInput.addEventListener('blur', function() {
            if (this.value.trim() !== '' && !isValidInvitationCode(this.value.trim())) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }
});
