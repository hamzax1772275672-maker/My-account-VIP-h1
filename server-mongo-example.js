
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose'); // إضافة mongoose للتعامل مع MongoDB

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// الاتصال بقاعدة بيانات MongoDB
mongoose.connect('mongodb://localhost:27017/myaccountvip', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة بيانات MongoDB'))
.catch(err => console.error('خطأ في الاتصال بقاعدة بيانات MongoDB:', err));

// تعريف نموذج المستخدم
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true },
    role: { type: String, default: 'user' },
    points: { type: Number, default: 100 },
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date
});

const User = mongoose.model('User', UserSchema);

// دالة لتشفير كلمات المرور
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// نقطة نهاية لتسجيل الدخول
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' 
            });
        }

        // البحث عن المستخدم في قاعدة البيانات
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            return res.status(401).json({
                success: false,
                message: 'كلمة المرور غير صحيحة'
            });
        }

        // تحديث تاريخ آخر تسجيل دخول
        user.lastLogin = new Date();
        await user.save();

        // إرجاع بيانات المستخدم بدون كلمة المرور
        const userObj = user.toObject();
        delete userObj.password;

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: userObj
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
});

// نقطة نهاية لإنشاء حساب جديد
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;

        // التحقق من وجود جميع الحقول المطلوبة
        if (!email || !password || !displayName) {
            return res.status(400).json({ 
                success: false, 
                message: 'الرجاء ملء جميع الحقول المطلوبة' 
            });
        }

        // التحقق من وجود المستخدم مسبقاً
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'هذا البريد الإلكتروني مسجل بالفعل' 
            });
        }

        // إنشاء مستخدم جديد
        const newUser = new User({
            email,
            password: hashPassword(password),
            displayName,
            role: 'user',
            points: 100 // نقاط ترحيبية
        });

        // حفظ المستخدم في قاعدة البيانات
        await newUser.save();

        // إرجاع بيانات المستخدم بدون كلمة المرور
        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            user: userObj
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
    console.log(`افتح المتصفح على العنوان: http://localhost:${PORT}`);
});
