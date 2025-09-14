// ملف إصلاح مشكلة النقر المزدوج على زر إضافة للسلة
document.addEventListener('DOMContentLoaded', function() {
  // التأكد من أن مدير السلة متاح
  if (typeof CartManager !== 'undefined') {
    const cartManager = new CartManager();

    // تعطيل أي مستمعات موجودة على أزرار "إضافة للسلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
      // استنساخ الزر لإزالة جميع مستمعي الأحداث
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // إضافة مستمع حدث جديد مع منع النقر المزدوج
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // منع النقر المتعدد
        if (this.dataset.processing === 'true') {
          return;
        }

        // تعليم الزر كقيد المعالجة
        this.dataset.processing = 'true';

        // الحصول على بيانات المنتج
        const productElement = this.closest('.product-card');
        if (productElement) {
          // استخراج معلومات المنتج من العناصر المرئية
          // محاولة العثور على العنوان (h3 أو h4)
          const nameElement = productElement.querySelector('h3') || productElement.querySelector('h4');
          // محاولة العثور على السعر
          const priceElement = productElement.querySelector('.current-price') || productElement.querySelector('.product-price span:first-child');
          const imageElement = productElement.querySelector('.product-img img');

          if (nameElement && priceElement) {
            // استخراج النصوص ومعالجتها
            const name = nameElement.textContent.trim();
            const priceText = priceElement.textContent.trim();
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            const image = imageElement ? imageElement.src : '';

            // إنشاء معرف فريد للمنتج
            const id = 'product_' + name.replace(/\s+/g, '_').toLowerCase();

            const product = {
              id: id,
              name: name,
              price: price,
              image: image,
              category: 'general'
            };

            // إضافة المنتج للسلة
            cartManager.addItem(product);
          }
        }

        // إعادة تفعيل الزر بعد فترة وجيزة
        setTimeout(() => {
          this.dataset.processing = 'false';
        }, 500);
      });
    });
  }
});
