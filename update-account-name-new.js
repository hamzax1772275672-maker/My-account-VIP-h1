
// دالة لتحديث اسم المستخدم في أيقونة الحساب
function updateAccountName() {
    // استرجاع البريد الإلكتروني من التخزين المحلي
    const username = localStorage.getItem('username');

    // البحث عن عنصر أيقونة الحساب
    const accountElement = document.querySelector('.account');

    if (accountElement && username) {
        // البحث عن عنصر النص داخل أيقونة الحساب
        const accountSpan = accountElement.querySelector('span');

        if (accountSpan) {
            // تحديث النص لعرض البريد الإلكتروني
            accountSpan.textContent = username;
            console.log('تم تحديث البريد الإلكتروني في أيقونة الحساب:', username);
        }
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateAccountName);

// استدعاء الدالة أيضاً عند أي تغيير في التخزين المحلي
window.addEventListener('storage', updateAccountName);
