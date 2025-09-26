# دليل نشر مشروع My account VIP

هذا المستند يشرح كيفية نشر مشروع My account VIP على منصات سحابية مختلفة.

## مقدمة

لا يمكن نشر المشروع وهو يعمل على الخادم المحلي فقط. لجعل مشروعك متاحاً للجمهور على الإنترنت، ستحتاج إلى نشره على خادم سحابي. هذا الدليل يشرح كيفية نشر المشروع على منصات مختلفة.

## المتطلبات الأساسية

- حساب GitHub (لمعظم منصات النشر)
- حساب على منصة النشر المختارة
- حساب على MongoDB Atlas (لقاعدة البيانات)

## الخطوة 1: إعداد قاعدة البيانات (MongoDB Atlas)

1. قم بإنشاء حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. قم بإنشاء مشروع جديد
3. قم بإنشاء مجموعة (Cluster) مجانية:
   - اختر "Shared Clusters"
   - اختر "M0 Sandbox" (الخيار المجاني)
   - اختر المنطقة الأقرب لجمهورك المستهدف
4. قم بإعداد وصول الشبكة (Network Access):
   - اذهب إلى "Network Access" في القائمة الجانبية
   - انقر على "Add IP Address"
   - اختر "Allow Access FromAnywhere" (للتسهيل) أو أضف عنوان IP الخاص بك
5. قم بإنشاء مستخدم قاعدة البيانات:
   - اذهب إلى "Database Access" في القائمة الجانبية
   - انقر على "Add New Database User"
   - أدخل اسم المستخدم وكلمة المرور (احفظهما في مكان آمن)
   - اختر "Read and write to any database"
6. احصل على سلسلة الاتصال:
   - اذهب إلى صفحة Cluster الرئيسية
   - انقر على "Connect"
   - اختر "Connect your application"
   - اختر "Node.js" كبرنامج التشغيل
   - انسخ سلسلة الاتصال (استبدل `<password>` بكلمة المرور التي أنشأتها)

## الخطوة 2: تحديث الكود للنشر

1. قم بتعديل ملف `server-mongo.js` لاستخدام متغيرات البيئة:
   ```javascript
   // استبدل هذا السطر
   mongoose.connect('mongodb://localhost:27017/myaccountvip', {
       useNewUrlParser: true,
       useUnifiedTopology: true
   })

   // بهذا السطر
   const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/myaccountvip';

   mongoose.connect(mongoUrl, {
       useNewUrlParser: true,
       useUnifiedTopology: true
   })
   ```

2. تأكد من أن الخادم يستخدم PORT من متغيرات البيئة:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

## الخطوة 3: نشر المشروع

### الخيار الأول: Render (الأسهل للمبتدئين)

1. قم بإنشاء حساب على [Render](https://render.com/)
2. قم بربط حساب GitHub بـ Render
3. انقر على "New +" واختر "Web Service"
4. اختر مستودع GitHub الخاص بمشروعك
5. املأ التفاصيل:
   - **Name**: my-account-vip
   - **Region**: اختر المنطقة الأقرب لجمهورك
   - **Branch**: main أو master
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server-mongo.js`
   - **Instance Type**: Free
6. أضف متغيرات البيئة:
   - انقر على "Environment" علامة التبويب
   - أضف المتغيرات التالية:
     - **Key**: `MONGODB_URI`
     - **Value**: سلسلة الاتصال من MongoDB Atlas
7. انقر على "Create Web Service"
8. انتظر حتى يكتمل النشر، ثم انقر على الرابط لفتح موقعك

### الخيار الثاني: Heroku

1. قم بإنشاء حساب على [Heroku](https://www.heroku.com/)
2. قم بتثبيت Heroku CLI:
   - على Windows: قم بتنزيله من [الموقع الرسمي](https://devcenter.heroku.com/articles/heroku-cli)
   - على macOS: `brew install heroku/brew/heroku`
   - على Linux: اتبع التعليمات في [الموقع الرسمي](https://devcenter.heroku.com/articles/heroku-cli)
3. قم بتسجيل الدخول إلى Heroku:
   ```
   heroku login
   ```
4. قم بإنشاء ملف `Procfile` في جذر المشروع:
   ```
   web: node server-mongo.js
   ```
5. قم بإنشاء تطبيق Heroku:
   ```
   heroku create your-app-name
   ```
6. أضف متغيرات البيئة:
   ```
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   ```
7. قم بدفع الكود إلى Heroku:
   ```
   git add .
   git commit -m "Ready for deployment"
   git push heroku main
   ```
8. افتح التطبيق:
   ```
   heroku open
   ```

### الخيار الثالث: Glitch

1. قم بإنشاء حساب على [Glitch](https://glitch.com/)
2. انقر على "New Project" واختر "Import from GitHub"
3. أدخل رابط مستودع GitHub الخاص بمشروعك
4. انتظر حتى يتم استيراد المشروع
5. انقر على ".env" file في المحرر
6. أضف متغيرات البيئة:
   ```
   MONGODB_URI=your-mongodb-connection-string
   ```
7. انقر على "Show" ثم "In a New Window" لفتح موقعك

## استكشاف الأخطاء وإصلاحها

### مشاكل شائعة:

1. **خطأ في الاتصال بقاعدة البيانات**:
   - تأكد من أن سلسلة الاتصال صحيحة
   - تأكد من أن عنوان IP الخاص بك مضاف في MongoDB Atlas
   - تأكد من أن مستخدم قاعدة البيانات لديه الصلاحيات المناسبة

2. **خطأ في بدء الخادم**:
   - تأكد من أن جميع الاعتماديات مثبتة
   - تأكد من أن ملف `package.json` يحتوي على جميع السكريبتات اللازمة
   - تحقق من سجلات الأخطاء في منصة النشر

3. **مشاكل في الواجهة الأمامية**:
   - تأكد من أن جميع المسارات إلى الملفات الثابتة صحيحة
   - تأكد من أن الملفات الثابتة يتم تقديمها بشكل صحيح

## نصائح للنشر الناجح

1. **استخدم متغيرات البيئة**: لا تضع معلومات حساسة مثل كلمات المرور في الكود
2. **اختبر النشر**: اختبر جميع وظائف الموقع بعد النشر
3. **راقب الأداء**: استخدم أدوات المراقبة لتتبع أداء الموقع
4. **احتفظ بنسخ احتياطية**: قم بعمل نسخ احتياطية منتظمة لقاعدة البيانات
5. **حافظ على التحديثات**: حافظ على تحديث الاعتماديات بانتظام

## الخلاصة

نشر مشروعك على منصة سحابية يجعله متاحاً للجمهور على الإنترنت. اختر المنصة التي تناسب احتياجاتك ومستوى خبرتك. للمبتدئين، أنصح بـ Render أو Glitch لأنهما سهلان الاستخدام ومجانيان.
