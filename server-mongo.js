
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
// يمكنك تغيير عنوان الاتصال حسب إعدادات MongoDB الخاصة بك
mongoose.connect('mongodb://localhost:27017/myaccountvip', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة بيانات MongoDB'))
.catch(err => {
    console.error('خطأ في الاتصال بقاعدة بيانات MongoDB:', err);
    console.log('سيتم استخدام التخزين المؤقت بدلاً من MongoDB');
});

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

// قاعدة بيانات محلية للمستخدمين (كنسخة احتياطية إذا فشل الاتصال بـ MongoDB)
const localUsers = [
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

// دالة للتحقق من صحة بيانات تسجيل الدخول (مع دعم MongoDB والتخزين المحلي)
async function validateLogin(email, password) {
    try {
        // محاولة البحث في MongoDB أولاً
        if (mongoose.connection.readyState === 1) { // 1 يعني أن الاتصال نشط
            const user = await User.findOne({ email });

            if (!user) {
                return { success: false, message: 'المستخدم غير موجود', source: 'mongodb' };
            }

            const hashedPassword = hashPassword(password);
            if (user.password !== hashedPassword) {
                return { success: false, message: 'كلمة المرور غير صحيحة', source: 'mongodb' };
            }

            // تحديث تاريخ آخر تسجيل دخول
            user.lastLogin = new Date();
            await user.save();

            // إرجاع بيانات المستخدم بدون كلمة المرور
            const userObj = user.toObject();
            delete userObj.password;

            return { success: true, user: userObj, source: 'mongodb' };
        }
    } catch (error) {
        console.error('MongoDB login error:', error);
    }

    // إذا فشل الاتصال بـ MongoDB، استخدم التخزين المحلي
    console.log('Using local storage for login validation');
    const user = localUsers.find(u => u.email === email);

    if (!user) {
        return { success: false, message: 'المستخدم غير موجود', source: 'local' };
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
        return { success: false, message: 'كلمة المرور غير صحيحة', source: 'local' };
    }

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword, source: 'local' };
}

// دالة لإنشاء حساب جديد (مع دعم MongoDB والتخزين المحلي)
async function createUser(email, password, displayName) {
    try {
        // محاولة الإنشاء في MongoDB أولاً
        if (mongoose.connection.readyState === 1) { // 1 يعني أن الاتصال نشط
            // التحقق من وجود المستخدم مسبقاً
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل', source: 'mongodb' };
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

            return { success: true, message: 'تم إنشاء الحساب بنجاح', user: userObj, source: 'mongodb' };
        }
    } catch (error) {
        console.error('MongoDB registration error:', error);
    }

    // إذا فشل الاتصال بـ MongoDB، استخدم التخزين المحلي
    console.log('Using local storage for user creation');

    // التحقق من وجود المستخدم مسبقاً
    const existingUser = localUsers.find(u => u.email === email);
    if (existingUser) {
        return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل', source: 'local' };
    }

    // إنشاء مستخدم جديد
    const newUser = {
        id: String(localUsers.length + 1),
        email,
        password: hashPassword(password),
        displayName,
        role: 'user',
        points: 100 // نقاط ترحيبية
    };

    // إضافة المستخدم إلى قاعدة البيانات المحلية
    localUsers.push(newUser);

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = newUser;

    return { success: true, message: 'تم إنشاء الحساب بنجاح', user: userWithoutPassword, source: 'local' };
}

// نقطة نهاية لتسجيل الدخول
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' 
        });
    }

    try {
        const result = await validateLogin(email, password);

        if (result.success) {
            res.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                user: result.user,
                source: result.source
            });
        } else {
            res.status(401).json({
                success: false,
                message: result.message
            });
        }
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
    const { email, password, displayName } = req.body;

    // التحقق من وجود جميع الحقول المطلوبة
    if (!email || !password || !displayName) {
        return res.status(400).json({ 
            success: false, 
            message: 'الرجاء ملء جميع الحقول المطلوبة' 
        });
    }

    try {
        const result = await createUser(email, password, displayName);

        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
                user: result.user,
                source: result.source
            });
        } else {
            res.status(409).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
});

// نقطة نهاية لإعادة تعيين كلمة المرور
app.post('/api/reset-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'الرجاء إدخال البريد الإلكتروني' 
        });
    }

    try {
        let userExists = false;

        // محاولة البحث في MongoDB أولاً
        if (mongoose.connection.readyState === 1) { // 1 يعني أن الاتصال نشط
            const user = await User.findOne({ email });
            userExists = !!user;
        }

        // إذا فشل الاتصال بـ MongoDB، استخدم التخزين المحلي
        if (!userExists) {
            const user = localUsers.find(u => u.email === email);
            userExists = !!user;
        }

        if (!userExists) {
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
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
});

// نقطة نهاية لفحص حالة الخادم وقاعدة البيانات
app.get('/api/status', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'متصل' : 'غير متصل';
    const dbType = mongoose.connection.readyState === 1 ? 'MongoDB' : 'التخزين المحلي';

    res.json({
        server: 'يعمل',
        database: {
            status: dbStatus,
            type: dbType
        }
    });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
    console.log(`افتح المتصفح على العنوان: http://localhost:${PORT}`);
    console.log(`لتفقد حالة الخادم وقاعدة البيانات: http://localhost:${PORT}/api/status`);
});
