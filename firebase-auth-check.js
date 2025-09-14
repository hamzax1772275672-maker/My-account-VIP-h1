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

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            // Use display name if available, otherwise use email
            const displayName = user.displayName || user.email;
            usernameDisplay.textContent = displayName;
        }

        // Update localStorage with user info
        localStorage.setItem('username', user.email);
        if (user.displayName) {
            localStorage.setItem('displayName', user.displayName);
        }

        // Show/hide admin panel based on email
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            if (user.email === 'admin@myaccountvip.com') {
                adminPanel.style.display = 'block';
            } else {
                adminPanel.style.display = 'none';
            }
        }

        // Update logout button functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                auth.signOut()
                    .then(() => {
                        // Clear localStorage
                        localStorage.removeItem('username');
                        localStorage.removeItem('displayName');
                        localStorage.removeItem('firstName');
                        localStorage.removeItem('lastName');

                        // Show notification
                        showNotification('تم تسجيل الخروج بنجاح', 'success');

                        // Redirect to login page
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 1500);
                    })
                    .catch((error) => {
                        showNotification('حدث خطأ أثناء تسجيل الخروج: ' + error.message, 'error');
                    });
            });
        }
    } else {
        // User is signed out
        // Check if there's a username in localStorage (for backward compatibility)
        const storedUsername = localStorage.getItem('username');
        const usernameDisplay = document.getElementById('username-display');

        if (usernameDisplay) {
            if (storedUsername) {
                const displayName = localStorage.getItem('displayName') || storedUsername;
                usernameDisplay.textContent = displayName;
            } else {
                usernameDisplay.textContent = 'مستخدم';
            }
        }

        // Hide admin panel
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'none';
        }
    }
});

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
