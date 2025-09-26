
// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const displayName = document.getElementById('displayName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            // Validation flags
            let isValid = true;
            let errorMessage = '';

            // Validate display name
            if (displayName === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال الاسم';
            }

            // Validate email
            if (isValid && email === '') {
                isValid = false;
                errorMessage = 'الرجاء إدخال البريد الإلكتروني';
            } else if (isValid && !isValidEmail(email)) {
                isValid = false;
                errorMessage = 'الرجاء إدخال بريد إلكتروني صحيح';
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

            // Validate terms agreement
            if (isValid && !agreeTerms) {
                isValid = false;
                errorMessage = 'يجب الموافقة على الشروط والأحكام';
            }

            // Show notification based on validation
            if (isValid) {
                showNotification('جاري إنشاء الحساب...', 'info');

                // Send registration request to local server
                fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        displayName: displayName,
                        email: email,
                        password: password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Registration successful');

                        // Store user data in localStorage
                        localStorage.setItem('username', data.user.email);
                        localStorage.setItem('displayName', data.user.displayName);
                        localStorage.setItem('userId', data.user.id);
                        localStorage.setItem('userRole', data.user.role);
                        localStorage.setItem('userPoints', data.user.points);

                        // Update registration timestamp
                        localStorage.setItem('registrationDate', new Date().toISOString());

                        showNotification('تم إنشاء الحساب بنجاح! جاري توجيهك إلى الصفحة الرئيسية', 'success');

                        // Redirect to home page after successful registration
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    } else {
                        showNotification(data.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    showNotification('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'error');
                });
            } else {
                showNotification(errorMessage, 'error');
            }
        });
    }

    // Password visibility toggle
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    if (confirmPasswordToggle && confirmPasswordInput) {
        confirmPasswordToggle.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);

            // Toggle icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Check password strength
    const passwordStrength = document.getElementById('passwordStrength');
    if (passwordInput && passwordStrength) {
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

            // Update strength indicator
            passwordStrength.className = 'password-strength';

            if (password.length === 0) {
                passwordStrength.style.width = '0';
            } else if (strength <= 1) {
                passwordStrength.classList.add('weak');
                passwordStrength.style.width = '25%';
            } else if (strength === 2) {
                passwordStrength.classList.add('medium');
                passwordStrength.style.width = '50%';
            } else if (strength === 3) {
                passwordStrength.classList.add('good');
                passwordStrength.style.width = '75%';
            } else {
                passwordStrength.classList.add('strong');
                passwordStrength.style.width = '100%';
            }
        });
    }
});

// دالة التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// دالة لعرض الإشعارات
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification based on type
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1001';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';

    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
            break;
        case 'info':
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
            break;
        default:
            notification.style.backgroundColor = '#333';
            notification.style.color = 'white';
    }

    // Add to body
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
