/**
 * دالة لضمان التوافق مع الشاشات الصغيرة
 * تعطي الأولوية للشاشات الصغيرة وتمنع أي تعديل يتعارض معها
 */
function ensureMobileCompatibility() {
    // الحد الأقصى لحجم الشاشة الصغيرة
    const MOBILE_BREAKPOINT = 768;

    // التحقق من حجم الشاشة الحالي
    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // واجهة API للتحقق من التوافق
    return {
        // تنفيذ دالة فقط إذا كانت متوافقة مع الشاشات الصغيرة
        executeIfMobileCompatible: function(actionName, mobileAction, desktopAction) {
            if (isMobile()) {
                // إذا كان الجهاز محمولاً، نفذ إجراء الشاشات الصغيرة
                return mobileAction();
            } else {
                // إذا كان الجهاز سطح مكتب، تحقق من عدم تضارب الإجراء مع الشاشات الصغيرة
                // قبل تنفيذ إجراء سطح المكتب
                if (this.isMobileCompatible(desktopAction)) {
                    return desktopAction();
                } else {
                    console.warn(`تم منع الإجراء "${actionName}" لأنه غير متوافق مع الشاشات الصغيرة`);
                    return null;
                }
            }
        },

        // التحقق من أن الإجراء متوافق مع الشاشات الصغيرة
        isMobileCompatible: function(action) {
            // هنا يمكن إضافة قواعد التحقق من التوافق
            // مثلاً، التحقق من أن الإجراء لا يخفي عناصر مهمة للشاشات الصغيرة
            // أو لا يغير الأحجام بشكل يجعل العناصر غير قابلة للاستخدام

            // للتبسيط، سنعيد true دائمًا
            // في التطبيق الحقيقي، يجب إضافة منطق تحقق دقيق
            return true;
        },

        // تطبيق أنماط CSS فقط إذا كانت متوافقة مع الشاشات الصغيرة
        applyMobileFirstStyles: function(styles) {
            const styleElement = document.createElement('style');
            let cssText = '';

            // تطبيق الأنماط الأساسية (للشاشات الصغيرة أولاً)
            if (styles.base) {
                cssText += styles.base;
            }

            // تطبيق أنماط الشاشات المتوسطة فقط إذا لم تتعارض مع الشاشات الصغيرة
            if (styles.medium && !isMobile()) {
                cssText += `@media (min-width: 769px) and (max-width: 992px) { ${styles.medium} }`;
            }

            // تطبيق أنماط الشاشات الكبيرة فقط إذا لم تتعارض مع الشاشات الصغيرة
            if (styles.large && !isMobile()) {
                cssText += `@media (min-width: 993px) { ${styles.large} }`;
            }

            styleElement.textContent = cssText;
            document.head.appendChild(styleElement);

            return styleElement;
        },

        // إضافة مستمع للأحداث مع مراعاة التوافق مع الشاشات الصغيرة
        addMobileFirstEventListener: function(element, event, mobileHandler, desktopHandler) {
            const handler = isMobile() ? mobileHandler : desktopHandler;

            if (this.isMobileCompatible(() => handler)) {
                element.addEventListener(event, handler);
                return true;
            }

            return false;
        }
    };
}

// إنشاء نسخة من الدالة للاستخدام العام
const mobileCompatibility = ensureMobileCompatibility();

// مثال على الاستخدام:
// mobileCompatibility.executeIfMobileCompatible(
//     'changeHeaderColor',
//     () => { /* كود تغيير لون الهيدر للشاشات الصغيرة */ },
//     () => { /* كود تغيير لون الهيدر للشاشات الكبيرة */ }
// );
// 
// mobileCompatibility.applyMobileFirstStyles({
//     base: '.header { background-color: blue; }',
//     medium: '.header { background-color: green; }',
//     large: '.header { background-color: red; }'
// });
