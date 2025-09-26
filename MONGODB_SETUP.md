# إعداد MongoDB لمشروع My account VIP

هذا المستند يشرح كيفية إعداد وتشغيل MongoDB مع مشروع My account VIP.

## المتطلبات

- Node.js مثبت على جهازك
- npm أو yarn
- MongoDB (محلي أو سحابي)

## خيارات تثبيت MongoDB

### الخيار 1: تثبيت MongoDB محلياً (للمطورين)

#### على Windows:
1. قم بتنزيل MongoDB Community Server من [الموقع الرسمي](https://www.mongodb.com/try/download/community)
2. قم بتشغيل المثبت واتبع التعليمات
3. أضف MongoDB إلى متغيرات البيئة (PATH)
4. قم بإنشاء مجلد للبيانات (مثلاً: `C:\data\db`)
5. افتح موجه الأوامر كمسؤول وقم بتشغيل:
   ```
   mongod --dbpath="C:\data\db"
   ```

#### على macOS:
1. قم بتثبيت MongoDB باستخدام Homebrew:
   ```
   brew tap mongodb/brew
   brew install mongodb-community
   ```
2. قم بتشغيل خدمة MongoDB:
   ```
   brew services start mongodb-community
   ```

#### على Linux (Ubuntu/Debian):
1. قم باستيراد المفتاح العام لـ MongoDB:
   ```
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```
2. قم بإضافة مستودع MongoDB:
   ```
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```
3. قم بتحديث قائمة الحزم وتثبيت MongoDB:
   ```
   sudo apt update
   sudo apt install -y mongodb-org
   ```
4. قم بتشغيل خدمة MongoDB:
   ```
   sudo systemctl start mongod
   ```

### الخيار 2: استخدام MongoDB Atlas (سحابي)

1. قم بإنشاء حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. قم بإنشاء مشروع جديد ومجموعة (cluster) مجانية
3. قم بإعداد وصول الشبكة (Network Access) للسماح بالاتصال من عنوان IP الخاص بك
4. قم بإنشاء مستخدم قاعدة بيانات (Database User)
5. احصل على سلسلة الاتصال (Connection String) من لوحة التحكم

## تشغيل المشروع مع MongoDB

1. افتح الطرفية (Terminal) أو موجه الأوامر (Command Prompt)
2. انتقل إلى مجلد المشروع
3. قم بتثبيت الاعتماديات المطلوبة:
   ```
   npm install
   ```
4. إذا كنت تستخدم MongoDB محلياً، تأكد من أن خدمة MongoDB تعمل
5. قم بتشغيل الخادم مع MongoDB:
   ```
   npm run start-mongo
   ```
   أو للوضع التطويري (مع إعادة التشغيل التلقائي عند تغيير الملفات):
   ```
   npm run dev-mongo
   ```
6. افتح المتصفح على العنوان: `http://localhost:3000`

## التحقق من حالة الخادم وقاعدة البيانات

للتأكد من أن الخادم يعمل ومتصل بقاعدة البيانات، افتح المتصفح على العنوان:
`http://localhost:3000/api/status`

ستظهر لك معلومات عن حالة الخادم وقاعدة البيانات المستخدمة.

## تعديل إعدادات الاتصال بقاعدة البيانات

إذا كنت تستخدم MongoDB Atlas أو تريد تغيير إعدادات الاتصال، قم بتعديل السطر التالي في ملف `server-mongo.js`:

```javascript
mongoose.connect('mongodb://localhost:27017/myaccountvip', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
```

واستبدل `mongodb://localhost:27017/myaccountvip` بسلسلة الاتصال الخاصة بك.

## حسابات المستخدمين الافتراضية

يحتوي الخادم على حسابين افتراضيين للاختبار:

1. حساب المدير:
   - البريد الإلكتروني: `admin@myaccountvip.com`
   - كلمة المرور: `admin123`

2. حساب المستخدم:
   - البريد الإلكتروني: `user@example.com`
   - كلمة المرور: `user123`

## ملاحظات هامة

- الخادم يدعم التخزين المحلي كنسخة احتياطية إذا فشل الاتصال بـ MongoDB
- جميع كلمات المرور يتم تخزينها بشكل مشفر باستخدام خوارزمية SHA-256
- في بيئة الإنتاج، يجب استخدام متغيرات البيئة لتخزين معلومات الاتصال بقاعدة البيانات
- يجب استخدام HTTPS في بيئة الإنتاج لتأمين الاتصال
