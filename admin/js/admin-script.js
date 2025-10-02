// ===== وظائف عامة =====
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الشريط الجانبي
    initSidebar();

    // تهيئة النماذج المنبثقة
    initModals();

    // تهيئة الجداول
    initTables();

    // تهيئة إدارة المنتجات
    initProducts();
});

// ===== الشريط الجانبي =====
function initSidebar() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // تفعيل عناصر القائمة
    const menuItems = document.querySelectorAll('.nav-menu li');
    menuItems.forEach(item => {
        // تجاهل عنصر المنتجات لأنه معالج بشكل منفصل
        if (item.querySelector('#products-link')) return;

        item.addEventListener('click', () => {
            // إزالة الفئة النشطة من جميع العناصر
            menuItems.forEach(i => i.classList.remove('active'));
            // إضافة الفئة النشطة للعنصر المضغوط
            item.classList.add('active');

            // إخفاء جميع الأقسام
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });

            // إظهار قسم إدارة المستخدمين افتراضيًا
            document.querySelector('.content-section').style.display = 'block';
        });
    });

    // إظهار قسم المنتجات عند النقر على رابط المنتجات
    const productsLink = document.getElementById('products-link');
    if (productsLink) {
        productsLink.addEventListener('click', (e) => {
            e.preventDefault();

            // إزالة الفئة النشطة من جميع العناصر
            menuItems.forEach(i => i.classList.remove('active'));
            // إضافة الفئة النشطة لعنصر المنتجات
            productsLink.parentElement.classList.add('active');

            // إخفاء جميع الأقسام
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });

            // إظهار قسم المنتجات
            const productsSection = document.getElementById('products-section');
            if (productsSection) {
                productsSection.style.display = 'block';
            }
        });
    }
}

// ===== النماذج المنبثقة =====
function initModals() {
    // زر إضافة مستخدم جديد
    const addUserBtn = document.querySelector('.section-header .btn');
    // النافذة المنبثقة
    const modal = document.getElementById('user-modal');
    // زر الإغلاق
    const closeBtn = document.querySelector('.close-modal');
    // زر الإلغاء
    const cancelBtn = document.querySelector('.cancel-btn');

    if (addUserBtn && modal) {
        addUserBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // معالجة نموذج المستخدم
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // الحصول على بيانات النموذج
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const password = document.getElementById('user-password').value;
            const role = document.getElementById('user-role').value;
            const status = document.getElementById('user-status').value;

            // الحصول على جدول المستخدمين
            const table = document.querySelector('.data-table tbody');

            // التحقق من وجود رسالة "لا توجد بيانات متاحة" وإزالتها
            const emptyRow = table.querySelector('.empty-table');
            if (emptyRow) {
                table.removeChild(emptyRow);
            }

            // إنشاء معرف جديد للمستخدم
            const rows = table.querySelectorAll('tr');
            const newId = rows.length > 0 ? rows.length + 1 : 1;

            // إنشاء تاريخ التسجيل الحالي
            const currentDate = new Date().toISOString().split('T')[0];

            // إنشاء صف جديد للمستخدم
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>#${newId}</td>
                <td>${name}</td>
                <td>${email}</td>
                <td>${currentDate}</td>
                <td><span class="status ${status}">${status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;

            // إضافة الصف إلى الجدول
            table.appendChild(newRow);

            // تحديث إحصائية عدد المستخدمين
            const userCountCard = document.querySelector('.dashboard-cards .card:first-child .card-info h3');
            if (userCountCard) {
                userCountCard.textContent = rows.length + 1;
            }

            // إغلاق النافذة
            modal.style.display = 'none';

            // عرض رسالة نجاح
            showNotification('تم حفظ بيانات المستخدم بنجاح!', 'success');

            // إعادة تعيين النموذج
            userForm.reset();

            // إعادة تهيئة أزرار التعديل والحذف للصفوف الجديدة
            initTableActions();
        });
    }
}

// ===== الجداول =====
function initTables() {
    initTableActions();
}

// وظيفة تهيئة أزرار التعديل والحذف (لإعادة استخدامها)
function initTableActions() {
    // أزرار التعديل
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // الحصول على صف الجدول
            const row = btn.closest('tr');
            // الحصول على بيانات الصف
            const cells = row.querySelectorAll('td');

            // تعبئة النموذج بالبيانات
            document.getElementById('user-name').value = cells[1].textContent;
            document.getElementById('user-email').value = cells[2].textContent;
            document.getElementById('user-password').value = '';
            document.getElementById('user-role').value = 'customer';
            document.getElementById('user-status').value = cells[4].querySelector('.status').classList.contains('active') ? 'active' : 'inactive';

            // تغيير عنوان النافذة
            document.querySelector('.modal-header h3').textContent = 'تعديل بيانات المستخدم';

            // عرض النافذة
            document.getElementById('user-modal').style.display = 'flex';
        });
    });

    // أزرار الحذف
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // الحصول على صف الجدول
            const row = btn.closest('tr');
            // الحصول على اسم المستخدم
            const userName = row.querySelectorAll('td')[1].textContent;

            // عرض رسالة تأكيد
            if (confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) {
                // الحصول على جدول المستخدمين
                const table = document.querySelector('.data-table tbody');

                // إزالة الصف من الجدول
                row.remove();

                // تحديث إحصائية عدد المستخدمين
                const userCountCard = document.querySelector('.dashboard-cards .card:first-child .card-info h3');
                if (userCountCard) {
                    const currentCount = parseInt(userCountCard.textContent) || 0;
                    userCountCard.textContent = Math.max(0, currentCount - 1);
                }

                // التحقق إذا كان الجدول فارغاً الآن
                const remainingRows = table.querySelectorAll('tr:not(.empty-table)');
                if (remainingRows.length === 0) {
                    // إضافة رسالة "لا توجد بيانات متاحة"
                    const emptyRow = document.createElement('tr');
                    emptyRow.className = 'empty-table';
                    emptyRow.innerHTML = '<td colspan="6">لا توجد بيانات متاحة</td>';
                    table.appendChild(emptyRow);
                }

                // عرض رسالة نجاح
                showNotification('تم حذف المستخدم بنجاح!', 'success');
            }
        });
    });
}

// ===== عرض الإشعارات =====
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);

    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('show');

        // إزالة الإشعار من الصفحة بعد انتهاء الانتقال
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== إدارة المنتجات =====
function initProducts() {
    // زر إضافة منتج جديد
    const addProductBtn = document.getElementById('add-product-btn');
    // النافذة المنبثقة
    const productModal = document.getElementById('product-modal');
    // زر الإغلاق
    const closeProductModal = document.querySelector('#product-modal .close-modal');
    // زر الإلغاء
    const cancelProductBtn = document.querySelector('#product-modal .cancel-btn');

    // التأكد من وجود العناصر قبل إضافة المستمعين
    if (!addProductBtn || !productModal) {
        console.error('عناصر إدارة المنتجات غير موجودة');
        return;
    }

    // فتح النافذة عند النقر على زر الإضافة
    addProductBtn.addEventListener('click', () => {
        // إعادة تعيين النموذج
        document.getElementById('product-form').reset();
        // تغيير عنوان النافذة
        document.querySelector('#product-modal .modal-header h3').textContent = 'إضافة منتج جديد';
        // عرض النافذة
        productModal.style.display = 'flex';
    });

    // إغلاق النافذة عند النقر على زر الإغلاق
    if (closeProductModal) {
        closeProductModal.addEventListener('click', () => {
            productModal.style.display = 'none';
        });
    }

    // إغلاق النافذة عند النقر على زر الإلغاء
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', () => {
            productModal.style.display = 'none';
        });
    }

    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // معالجة نموذج المنتج
    const productForm = document.getElementById('product-form');
    if (!productForm) {
        console.error('نموذج المنتج غير موجود');
        return;
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // الحصول على بيانات النموذج
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const image = document.getElementById('product-image').value;
        const rating = document.getElementById('product-rating').value;
        const status = document.getElementById('product-status').value;

        // الحصول على جدول المنتجات
        const table = document.querySelector('#products-section .data-table tbody');
        if (!table) {
            console.error('جدول المنتجات غير موجود');
            return;
        }

        // التحقق من وجود رسالة "لا توجد منتجات متاحة" وإزالتها
        const emptyRow = table.querySelector('.empty-table');
        if (emptyRow) {
            table.removeChild(emptyRow);
        }

        // إنشاء معرف جديد للمنتج
        const rows = table.querySelectorAll('tr:not(.empty-table)');
        const newId = rows.length > 0 ? rows.length + 1 : 1;

        // إنشاء صف جديد للمنتج
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>#${newId}</td>
            <td>${name}</td>
            <td><img src="${image}" alt="${name}" width="50"></td>
            <td>$${price}</td>
            <td>${generateRatingStars(rating)}</td>
            <td><span class="status ${status}">${status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="edit-product-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-product-btn"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;

        // إضافة الصف إلى الجدول
        table.appendChild(newRow);

        // تحديث إحصائية عدد المنتجات
        const productCountCard = document.querySelector('.dashboard-cards .card:nth-child(2) .card-info h3');
        if (productCountCard) {
            const currentCount = parseInt(productCountCard.textContent) || 0;
            productCountCard.textContent = currentCount + 1;
        }

        // إغلاق النافذة
        productModal.style.display = 'none';

        // عرض رسالة نجاح
        showNotification('تم حفظ بيانات المنتج بنجاح!', 'success');

        // إعادة تعيين النموذج
        productForm.reset();

        // إعادة تهيئة أزرار التعديل والحذف للصفوف الجديدة
        initProductActions();
    });

    // تهيئة أزرار المنتجات
    initProductActions();
}

// وظيفة إنشاء نجوم التقييم
function generateRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// وظيفة تهيئة أزرار المنتجات
function initProductActions() {
    // أزرار التعديل
    const editBtns = document.querySelectorAll('.edit-product-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // الحصول على صف الجدول
            const row = btn.closest('tr');
            // الحصول على بيانات الصف
            const cells = row.querySelectorAll('td');

            // تعبئة النموذج بالبيانات
            document.getElementById('product-name').value = cells[1].textContent;
            document.getElementById('product-price').value = cells[3].textContent.replace('$', '');
            document.getElementById('product-image').value = cells[2].querySelector('img').src;

            // استخراج التقييم من النجوم
            const stars = cells[4].querySelectorAll('.fas.fa-star').length;
            document.getElementById('product-rating').value = stars;

            document.getElementById('product-status').value = cells[5].querySelector('.status').classList.contains('active') ? 'active' : 'inactive';

            // تغيير عنوان النافذة
            document.querySelector('#product-modal .modal-header h3').textContent = 'تعديل بيانات المنتج';

            // عرض النافذة
            document.getElementById('product-modal').style.display = 'flex';
        });
    });

    // أزرار الحذف
    const deleteBtns = document.querySelectorAll('.delete-product-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // الحصول على صف الجدول
            const row = btn.closest('tr');
            // الحصول على اسم المنتج
            const productName = row.querySelectorAll('td')[1].textContent;

            // عرض رسالة تأكيد
            if (confirm(`هل أنت متأكد من حذف المنتج "${productName}"؟`)) {
                // الحصول على جدول المنتجات
                const table = document.querySelector('#products-section .data-table tbody');

                // إزالة الصف من الجدول
                row.remove();

                // تحديث إحصائية عدد المنتجات
                const productCountCard = document.querySelector('.dashboard-cards .card:nth-child(2) .card-info h3');
                if (productCountCard) {
                    const currentCount = parseInt(productCountCard.textContent) || 0;
                    productCountCard.textContent = Math.max(0, currentCount - 1);
                }

                // التحقق إذا كان الجدول فارغاً الآن
                const remainingRows = table.querySelectorAll('tr:not(.empty-table)');
                if (remainingRows.length === 0) {
                    // إضافة رسالة "لا توجد منتجات متاحة"
                    const emptyRow = document.createElement('tr');
                    emptyRow.className = 'empty-table';
                    emptyRow.innerHTML = '<td colspan="7">لا توجد منتجات متاحة</td>';
                    table.appendChild(emptyRow);
                }

                // عرض رسالة نجاح
                showNotification('تم حذف المنتج بنجاح!', 'success');
            }
        });
    });
}