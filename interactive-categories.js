// وظيفة لتبديل عرض الفئات الفرعية
function toggleSubCategories(categoryId) {
    const subCategories = document.getElementById(categoryId + '-subcategories');
    const categoryCard = subCategories.parentElement;
    const toggleIcon = categoryCard.querySelector('.toggle-icon');

    if (subCategories.classList.contains('show')) {
        subCategories.classList.remove('show');
        setTimeout(() => {
            if (!subCategories.classList.contains('show')) {
                subCategories.style.display = 'none';
            }
        }, 400); // نفس مدة الانتقال في CSS
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
    } else {
        subCategories.style.display = 'flex';
        // إضافة تأخر بسيط للسماح للمتصفح بتطبيق تغيير العرض أولاً
        setTimeout(() => {
            subCategories.classList.add('show');
        }, 10);
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
    }

    // منع الانتقال إلى الرابط عند النقر على زر التبديل
    event.stopPropagation();
    event.preventDefault();
}

// إضافة الأنماط اللازمة للفئات التفاعلية
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .interactive-category {
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .interactive-category:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .interactive-category a {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: inherit;
        }

        .category-toggle {
            position: absolute;
            top: 10px;
            left: 10px;
            cursor: pointer;
            z-index: 2;
        }

        .toggle-icon {
            font-size: 18px;
            color: #555;
            transition: transform 0.3s ease;
        }

        .sub-categories {
            display: none;
            flex-direction: column;
            background-color: #f9f9f9;
            padding: 10px;
            border-top: 1px solid #eee;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, padding 0.4s ease;
        }

        .sub-categories.show {
            display: flex;
            max-height: 500px;
            padding: 10px;
        }

        .sub-category {
            display: flex;
            align-items: center;
            padding: 8px 10px;
            margin: 5px 0;
            text-decoration: none;
            color: #333;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .sub-category:hover {
            background-color: #f0f0f0;
            transform: translateX(5px);
        }

        .sub-category i {
            margin-left: 10px;
            color: #555;
        }
    `;
    document.head.appendChild(style);

    // إخفاء الفئات الفرعية عند تحميل الصفحة
    const homeKitchenSubCategories = document.getElementById('home-kitchen-subcategories');
    if (homeKitchenSubCategories) {
        homeKitchenSubCategories.style.display = 'none';
        homeKitchenSubCategories.classList.remove('show');
        const toggleIcon = document.querySelector('.home-kitchen-category .toggle-icon');
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-chevron-up');
            toggleIcon.classList.add('fa-chevron-down');
        }
    }
});
