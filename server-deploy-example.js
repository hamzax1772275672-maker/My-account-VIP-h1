
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// الاتصال بقاعدة بيانات MongoDB باستخدام متغيرات البيئة
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/myaccountvip';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة بيانات MongoDB'))
.catch(err => {
    console.error('خطأ في الاتصال بقاعدة بيانات MongoDB:', err);
    process.exit(1); // إنهاء العملية إذا فشل الاتصال بقاعدة البيانات
});

// باقي الكود يبقى كما هو...

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
