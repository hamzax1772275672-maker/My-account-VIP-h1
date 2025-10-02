/**
 * مدير المشروع - منع تكرار الكود والأخطاء
 * يوفر واجهة موحدة للتعامل مع جميع عناصر المشروع
 */
const ProjectManager = (function() {
    // كائن لتخزين العناصر التي تمت معالجتها بالفعل لمنع التكرار
    const processedElements = new Set();

    // كائن لتخزين الإعدادات العامة للمشروع
    const settings = {
        mobileBreakpoint: 768,
        animations: true,
        debugMode: false
    };

    // كائن لتخزين الأحداث المسجلة لمنع التكرار
    const registeredEvents = new Set();

    /**
     * تسجيل عنصر تمت معالجته لمنع التكرار
     * @param {string} elementId - معرف العنصر
     * @returns {boolean} - إذا كان العنصر مسجلاً بالفعل
     */
    function registerElement(elementId) {
        if (processedElements.has(elementId)) {
            if (settings.debugMode) {
                console.warn(`العنصر "${elementId}" تمت معالجته بالفعل. تم منع التكرار.`);
            }
            return false;
        }
        processedElements.add(elementId);
        return true;
    }

    /**
     * تسجيل حدث لمنع التكرار
     * @param {string} eventId - معرف الحدث
     * @returns {boolean} - إذا كان الحدث مسجلاً بالفعل
     */
    function registerEvent(eventId) {
        if (registeredEvents.has(eventId)) {
            if (settings.debugMode) {
                console.warn(`الحدث "${eventId}" مسجل بالفعل. تم منع التكرار.`);
            }
            return false;
        }
        registeredEvents.add(eventId);
        return true;
    }

    /**
     * التحقق من صحة المعطيات
     * @param {*} value - القيمة المراد التحقق منها
     * @param {string} type - النوع المتوقع
     * @param {string} functionName - اسم الدالة للإبلاغ عن الخطأ
     * @returns {boolean} - إذا كانت القيمة صالحة
     */
    function validateParam(value, type, functionName) {
        if (typeof value !== type) {
            console.error(`خطأ في ${functionName}: المتوقع ${type} ولكن تم تمرير ${typeof value}`);
            return false;
        }
        return true;
    }

    /**
     * إضافة مستمع حدث مع منع التكرار
     * @param {string} elementId - معرف العنصر
     * @param {string} event - نوع الحدث
     * @param {Function} callback - الدالة المنفذة
     */
    function addEvent(elementId, event, callback) {
        const eventId = `${elementId}_${event}`;

        if (!registerEvent(eventId)) {
            return;
        }

        const element = document.getElementById(elementId) || document.querySelector(elementId);
        if (!element) {
            console.error(`العنصر "${elementId}" غير موجود`);
            return;
        }

        element.addEventListener(event, callback);
    }

    /**
     * تطبيق أنماط CSS مع منع التكرار
     * @param {string} elementId - معرف العنصر
     * @param {Object} styles - كائن الأنماط
     */
    function applyStyles(elementId, styles) {
        if (!registerElement(elementId)) {
            return;
        }

        const element = document.getElementById(elementId) || document.querySelector(elementId);
        if (!element) {
            console.error(`العنصر "${elementId}" غير موجود`);
            return;
        }

        Object.assign(element.style, styles);
    }

    /**
     * إنشاء عنصر HTML مع التحقق من الصحة
     * @param {string} tagName - اسم العنصر
     * @param {Object} attributes - خصائص العنصر
     * @param {string|HTMLElement} content - محتوى العنصر
     * @returns {HTMLElement} - العنصر الذي تم إنشاؤه
     */
    function createElement(tagName, attributes = {}, content = '') {
        if (!validateParam(tagName, 'string', 'createElement')) {
            return null;
        }

        const element = document.createElement(tagName);

        // إضافة الخصائص
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        }

        // إضافة المحتوى
        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        }

        return element;
    }

    /**
     * إضافة عنصر إلى الحاوية مع منع التكرار
     * @param {string} containerId - معرف الحاوية
     * @param {HTMLElement} element - العنصر المراد إضافته
     * @param {string} position - موضع الإضافة (beforebegin, afterbegin, beforeend, afterend)
     */
    function appendElement(containerId, element, position = 'beforeend') {
        const container = document.getElementById(containerId) || document.querySelector(containerId);
        if (!container) {
            console.error(`الحاوية "${containerId}" غير موجودة`);
            return;
        }

        container.insertAdjacentElement(position, element);
    }

    /**
     * الحصول على بيانات من الخادم مع معالجة الأخطاء
     * @param {string} url - رابط الطلب
     * @param {Object} options - خيارات الطلب
     * @returns {Promise} - وعد بالبيانات
     */
    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('فشل جلب البيانات:', error);
            return null;
        }
    }

    /**
     * تحديث الإعدادات
     * @param {Object} newSettings - الإعدادات الجديدة
     */
    function updateSettings(newSettings) {
        Object.assign(settings, newSettings);
    }

    /**
     * الحصول على إعدادات حالية
     * @returns {Object} - الإعدادات الحالية
     */
    function getSettings() {
        return { ...settings };
    }

    // واجهة API العامة
    return {
        addEvent,
        applyStyles,
        createElement,
        appendElement,
        fetchData,
        updateSettings,
        getSettings,

        // دوال مساعدة
        validateParam,
        isElementProcessed: (elementId) => processedElements.has(elementId),
        isEventRegistered: (eventId) => registeredEvents.has(eventId),
        clearProcessedElements: () => processedElements.clear(),
        clearRegisteredEvents: () => registeredEvents.clear()
    };
})();

// مثال على الاستخدام:
// ProjectManager.addEvent('myButton', 'click', () => {
//     console.log('تم النقر على الزر');
// });
// 
// ProjectManager.applyStyles('myDiv', {
//     color: 'red',
//     fontSize: '16px'
// });
// 
// const newElement = ProjectManager.createElement('div', { className: 'my-class' }, 'محتوى العنصر');
// ProjectManager.appendElement('container', newElement);
