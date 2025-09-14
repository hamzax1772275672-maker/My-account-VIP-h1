// Firebase configuration
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
    const registerForm = document.getElementById('registerForm');
    const telegramLoginBtn = document.getElementById('telegramLoginBtn');

    // ����� ����� ��� ������� ����� Telegram
    if (telegramLoginBtn) {
        telegramLoginBtn.addEventListener('click', function() {
            try {
                // ����� ����� ������ ������ ������ ��� Telegram
                const telegramWindow = window.open('', 'Telegram Login', 'width=600,height=500');

                // ����� ������� �������� ������ ��� ���� ��������
                telegramWindow.location.href = 'https://oauth.telegram.org/auth?bot_id=6803998447&origin=https://myaccountvip.com&return_to=https://myaccountvip.com/telegram-auth-callback&request_access=write';

                // �������� ��� ����� �� ������� ��������
                window.addEventListener('message', function(event) {
                    // ������ �� ���� ������� ������
                    if (event.origin !== window.location.origin) return;

                    // ����� ������� ��������
                    telegramWindow.close();

                    // ������ �� ���� ��������
                    if (event.data && event.data.type === 'telegram-auth-success') {
                        const userData = event.data.userData;

                        // ����� ����� ������� ��������� �������� �� Telegram
                        document.getElementById('firstName').value = userData.first_name || '';
                        document.getElementById('lastName').value = userData.last_name || '';
                        document.getElementById('email').value = userData.email || '';
                        document.getElementById('phone').value = userData.phone || '';

                        // ��� ������ Telegram �� localStorage ��������� ������
                        localStorage.setItem('telegramAuthData', JSON.stringify(userData));

                        // ����� ����� ����� ��������
                        showNotification('�� ����� ������ ����� Telegram �����! ���� ����� �������� ��������.', 'success');
                    } else if (event.data && event.data.type === 'telegram-auth-error') {
                        showNotification('��� ����� ������ ����� Telegram: ' + event.data.error, 'error');
                    }
                });
            } catch (error) {
                showNotification('��� �� ������� �������', 'error');
                console.error('Error:', error);
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
                errorMessage = '������ ����� ����� �����';
            }

            // Validate last name
            if (isValid && lastName === '') {
                isValid = false;
                errorMessage = '������ ����� ����� ������';
            }

            // Validate email
            if (isValid && email === '') {
                isValid = false;
                errorMessage = '������ ����� ������ ����������';
            } else if (isValid && !isValidEmail(email)) {
                isValid = false;
                errorMessage = '������ ����� ���� �������� ����';
            }

            // Validate phone
            if (isValid && phone === '') {
                isValid = false;
                errorMessage = '������ ����� ��� ������';
            } else if (isValid && !isValidPhone(phone)) {
                isValid = false;
                errorMessage = '������ ����� ��� ���� ����';
            }

            // Validate password
            if (isValid && password === '') {
                isValid = false;
                errorMessage = '������ ����� ���� ������';
            } else if (isValid && password.length < 6) {
                isValid = false;
                errorMessage = '���� ������ ��� �� ���� 6 ���� ��� �����';
            }

            // Validate confirm password
            if (isValid && confirmPassword === '') {
                isValid = false;
                errorMessage = '������ ����� ���� ������';
            } else if (isValid && password !== confirmPassword) {
                isValid = false;
                errorMessage = '����� ������ ��� ���������';
            }

            // Validate invitation code
            if (isValid && invitationCode === '') {
                isValid = false;
                errorMessage = '������ ����� ��� ������';
            } else if (isValid && !isValidInvitationCode(invitationCode)) {
                isValid = false;
                errorMessage = '��� ������ ��� ����. ���� ������ �� ��� ������ ��������� ��� ����';
            }



            // Validate terms acceptance
            if (isValid && !termsAccepted) {
                isValid = false;
                errorMessage = '��� �������� ��� ������ �������� ������ ��������';
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
                                    showNotification('�� ����� ����� �����!', 'success');

                                    // Reset form
                                    registerForm.reset();

                                    // Redirect to login page after 5 seconds
                                    setTimeout(() => {
                                        window.location.href = 'login.html';
                                    }, 5000);
                                }).catch((error) => {
                                    console.error('Error updating profile:', error);
                                    showNotification('��� ��� ����� ����� ������ ����� ������: ' + error.message, 'error');
                                });
                            })
                            .catch((error) => {
                                console.error('Error sending verification email:', error);
                                showNotification('��� ��� ����� ����� ����� ������: ' + error.message, 'error');
                            });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        let errorMessage = '';

                        // Check if the error is related to Firebase configuration
                        if (error.message.includes("API key") || error.message.includes("invalid") || error.code === "auth/invalid-api-key") {
                            errorMessage = '��� �� ������� Firebase. ���� ������� �� ����� ������ ������ ������� ��������.';
                        } else {
                            switch(errorCode) {
                                case 'auth/email-already-in-use':
                                    errorMessage = '������ ���������� ������ ������';
                                    break;
                                case 'auth/invalid-email':
                                    errorMessage = '������ ���������� ��� ����';
                                    break;
                                case 'auth/operation-not-allowed':
                                    errorMessage = '����� �������� ��� ���� ������';
                                    break;
                                case 'auth/weak-password':
                                    errorMessage = '���� ������ ����� ����';
                                    break;
                                default:
                                    errorMessage = '��� ��� ����� ����� ������: ' + error.message;
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

        // In a real application, you would also check against a database
        // For now, we'll accept any code that matches the pattern
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