
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// تقديم الملفات الثابتة من المجلد الحالي
app.use(express.static(__dirname));

// قاعدة بيانات محلية للمستخدمين (في التطبيق الحقيقي، ستستخدم قاعدة بيانات حقيقية)
const users = [
    {
        id: '1',
        email: 'admin@myaccountvip.com',
        password: hashPassword('admin123'), // كلمة المرور المشفرة
        displayName: 'مدير النظام',
        role: 'admin',
        points: 1000
    },
    {
        id: '2',
        email: 'user@example.com',
        password: hashPassword('user123'), // كلمة المرور المشفرة
        displayName: 'مستخدم تجريبي',
        role: 'user',
        points: 500
    }
];

// دالة لتشفير كلمات المرور
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// دالة للتحقق من صحة بيانات تسجيل الدخول
function validateLogin(email, password) {
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, message: 'المستخدم غير موجود' };
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
        return { success: false, message: 'كلمة المرور غير صحيحة' };
    }

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
}

// نقطة نهاية لتسجيل الدخول
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' 
        });
    }

    const result = validateLogin(email, password);

    if (result.success) {
        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: result.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: result.message
        });
    }
});

// نقطة نهاية لإنشاء حساب جديد
app.post('/api/register', (req, res) => {
    const { email, password, displayName } = req.body;

    // التحقق من وجود جميع الحقول المطلوبة
    if (!email || !password || !displayName) {
        return res.status(400).json({ 
            success: false, 
            message: 'الرجاء ملء جميع الحقول المطلوبة' 
        });
    }

    // التحقق من وجود المستخدم مسبقاً
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ 
            success: false, 
            message: 'هذا البريد الإلكتروني مسجل بالفعل' 
        });
    }

    // إنشاء مستخدم جديد
    const newUser = {
        id: String(users.length + 1),
        email,
        password: hashPassword(password),
        displayName,
        role: 'user',
        points: 100 // نقاط ترحيبية
    };

    // إضافة المستخدم إلى قاعدة البيانات
    users.push(newUser);

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = newUser;

    res.status(201).json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: userWithoutPassword
    });
});

// نقطة نهاية لإعادة تعيين كلمة المرور
app.post('/api/reset-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'الرجاء إدخال البريد الإلكتروني' 
        });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني' 
        });
    }

    // في تطبيق حقيقي، هنا سيتم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
    // لهذا التطبيق التجريبي، سنقوم فقط بإرجاع رسالة نجاح
    res.json({
        success: true,
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
    console.log(`افتح المتصفح على العنوان: http://localhost:${PORT}`);
});
