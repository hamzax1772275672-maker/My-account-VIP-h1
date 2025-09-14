
// Notification Manager - مدير الإشعارات الموحد
// هذا الملف يحتوي على دالة الإشعار الموحدة لتجنب التكرار في الملفات المختلفة

/**
 * عرض إشعار للمستخدم
 * @param {string} message - رسالة الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 * @param {number} duration - مدة ظهور الإشيار بالمللي ثانية (الافتراضي 5000)
 */
function showNotification(message, type = 'info', duration = 5000) {
    // إزالة أي إشعارات موجودة
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // إضافة فئة النوع
    if (type === 'success') {
        notification.classList.add('success');
    } else if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'warning') {
        notification.classList.add('warning');
    } else if (type === 'info') {
        notification.classList.add('info');
    }

    // إضافة إلى الصفحة
    document.body.appendChild(notification);

    // عرض الإشعار مع تأثير الحركة
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // إخفاء الإشعار بعد المدة المحددة
    setTimeout(() => {
        notification.classList.remove('show');

        // إزالة من الـ DOM بعد اكتمال الانتقال
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * إضافة أنماط الإشعار إلى الصفحة
 */
function addNotificationStyles() {
    // التحقق إذا كانت الأنماط موجودة مسبقًا
    if (document.getElementById('notification-styles')) {
        return;
    }

    // إنشاء عنصر الأنماط
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #232f3e;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 16px;
            font-weight: 600;
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .notification.success {
            background-color: #4CAF50;
        }

        .notification.error {
            background-color: #f44336;
        }

        .notification.warning {
            background-color: #ff9800;
        }

        .notification.info {
            background-color: #2196F3;
        }

        @media (max-width: 768px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;

    // إضافة إلى رأس الصفحة
    document.head.appendChild(notificationStyles);
}

// استدعاء د إضافة الأنماط عند تحميل الملف
document.addEventListener('DOMContentLoaded', addNotificationStyles);

// إضافة الدالة إلى النطاق العام
window.showNotification = showNotification;
