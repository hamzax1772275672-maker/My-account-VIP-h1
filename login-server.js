
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

                // Send login request to local server
                fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Login successful');

                        // Store user data in localStorage
                        localStorage.setItem('username', data.user.email);
                        localStorage.setItem('displayName', data.user.displayName);
                        localStorage.setItem('userId', data.user.id);
                        localStorage.setItem('userRole', data.user.role);
                        localStorage.setItem('userPoints', data.user.points);

                        // Update last login timestamp
                        localStorage.setItem('lastLogin', new Date().toISOString());

                        showNotification('تم تسجيل الدخول بنجاح! جاري توجيهك إلى الصفحة الرئيسية', 'success');

                        // Redirect to home page after successful login
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    } else {
                        showNotification(data.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                    showNotification('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'error');
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

            // Send password reset request to local server
            fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: resetEmail
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');

                    // Hide reset section and show login form after a delay
                    setTimeout(() => {
                        resetPasswordSection.style.display = 'none';
                        loginForm.style.display = 'block';
                        document.getElementById('resetEmail').value = '';
                    }, 3000);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Password reset error:', error);
                showNotification('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'error');
            });
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
