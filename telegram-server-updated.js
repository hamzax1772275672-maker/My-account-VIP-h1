
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

// استبدل هذا بالتوكن الذي ستحصل عليه من BotFather
const TELEGRAM_BOT_TOKEN = '6803998447:AAHtK8Qv8h8pD6T8G4Y5J7R9tU2V3X1bW6c';

// قاعدة بيانات مؤقتة لتخزين العلاقة بين أرقام الهواتف ومعرفات Telegram
// في التطبيق الحقيقي، يجب استخدام قاعدة بيانات حقيقية مثل Firebase
const phoneToTelegramMap = {};

// نقطة نهاية لاستقبال رسائل /start من المستخدمين
app.post('/telegram-webhook', async (req, res) => {
    const message = req.body.message;

    if (message && message.text && message.text.startsWith('/start')) {
        const chatId = message.chat.id;
        const username = message.chat.username;

        // استخراج رقم الهاتف من الرسالة إذا كان موجودًا
        const parts = message.text.split(' ');
        let phone = null;

        if (parts.length > 1) {
            phone = parts[1];
        }

        if (phone) {
            // تخزين العلاقة بين رقم الهاتف ومعرف Telegram
            phoneToTelegramMap[phone] = {
                chatId: chatId,
                username: username
            };

            // إرسال رسالة تأكيد للمستخدم
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: chatId,
                text: 'تم ربط رقم هاتفك بحساب Telegram بنجاح! يمكنك الآن استخدام كود التحقق المرسل إلى هذا الحساب.'
            });
        } else {
            // طلب رقم الهاتف من المستخدم
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: chatId,
                text: 'يرجى إرسال رقم هاتفك مع الأمر /start، مثال: /start 1234567890'
            });
        }
    }

    res.sendStatus(200);
});

// نقطة نهاية لإرسال كود التحقق
app.post('/send-telegram-verification', async (req, res) => {
    const { phone, telegramUsername, verificationCode } = req.body;

    try {
        // البحث عن chat_id المرتبط برقم الهاتف
        const telegramData = phoneToTelegramMap[phone];

        if (!telegramData) {
            return res.json({
                success: false,
                message: 'لم يتم العثور على حساب Telegram مرتبط بهذا الرقم. يرجى التأكد من أنك أرسلت /start مع رقم هاتفك إلى البوت.'
            });
        }

        // التحقق من تطابق اسم المستخدم
        if (telegramData.username !== telegramUsername.replace('@', '')) {
            return res.json({
                success: false,
                message: 'اسم المستخدم في Telegram لا يتطابق مع الرقم المدخل.'
            });
        }

        // إرسال رسالة إلى المستخدم عبر Telegram
        const message = `كود التحقق الخاص بك هو: ${verificationCode}`;

        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: telegramData.chatId,
            text: message
        });

        if (response.data.ok) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'فشل إرسال الرسالة' });
        }
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        res.json({ success: false, message: error.message });
    }
});

// نقطة نهاية للحصول على رابط مصادقة Telegram
app.get('/telegram-auth-url', async (req, res) => {
    try {
        // استبدل YOUR_BOT_USERNAME باسم مستخدم البوت الفعلي
        const botUsername = 'MyAccountVIPBot';

        // إنشاء رابط المصادقة
        // يمكنك إضافة معلمات إضافية حسب الحاجة
        const authUrl = `https://oauth.telegram.org/auth?bot_id=${TELEGRAM_BOT_TOKEN.split(':')[0]}&origin=${encodeURIComponent(req.protocol + '://' + req.get('host'))}&return_to=${encodeURIComponent(req.protocol + '://' + req.get('host') + '/telegram-auth-callback')}&request_access=write`;

        res.json({
            success: true,
            authUrl: authUrl
        });
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating auth URL',
            error: error.message
        });
    }
});

// نقطة نهاية لمعالجة رد الاتصال من Telegram
app.get('/telegram-auth-callback', async (req, res) => {
    try {
        // استخراج بيانات المصادقة من استعلام الطلب
        const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.query;

        // هنا يمكنك التحقق من صحة البيانات باستخدام hash
        // في بيئة الإنتاج، يجب التحقق من صحة البيانات لأغراض الأمان

        // إعادة توجيه المستخدم إلى صفحة التسجيل مع إرسال البيانات
        res.send(`
            <html>
            <head>
                <title>Telegram Authentication</title>
            </head>
            <body>
                <script>
                    // إرسال البيانات إلى النافذة الأصل
                    window.opener.postMessage({
                        type: 'telegram-auth-success',
                        userData: {
                            id: '${id}',
                            first_name: '${first_name || ''}',
                            last_name: '${last_name || ''}',
                            username: '${username || ''}',
                            photo_url: '${photo_url || ''}',
                            auth_date: '${auth_date}'
                        }
                    }, '${req.protocol}://${req.get('host')}');

                    // إغلاق النافذة
                    window.close();
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error processing Telegram auth callback:', error);

        // إرسال رسالة خطأ إلى النافذة الأصل
        res.send(`
            <html>
            <head>
                <title>Telegram Authentication Error</title>
            </head>
            <body>
                <script>
                    window.opener.postMessage({
                        type: 'telegram-auth-error',
                        error: '${error.message}'
                    }, '${req.protocol}://${req.get('host')}');

                    window.close();
                </script>
            </body>
            </html>
        `);
    }
});

// نقطة نهاية لإعداد webhook
app.get('/setup-webhook', async (req, res) => {
    try {
        const webhookUrl = req.query.url || `https://myaccountvip.com/telegram-webhook`;

        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
            url: webhookUrl
        });

        res.json({
            success: true,
            message: 'Webhook set successfully',
            response: response.data
        });
    } catch (error) {
        console.error('Error setting webhook:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting webhook',
            error: error.message
        });
    }
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
