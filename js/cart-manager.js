class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.init();
  }

  // تحميل السلة من التخزين المحلي
  loadCart() {
    const cartData = localStorage.getItem('shoppingCart');
    return cartData ? JSON.parse(cartData) : this.createEmptyCart();
  }

  // إنشاء سلة فارغة
  createEmptyCart() {
    return {
      cartId: "cart_" + Date.now(),
      items: [],
      coupons: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }

  // حفظ السلة في التخزين المحلي
  saveCart() {
    this.cart.lastUpdated = new Date().toISOString();
    localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
    this.updateCartUI();
  }

  // إضافة منتج للسلة
  addItem(product) {
    const existingItem = this.cart.items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.items.push({
        id: "item_" + Math.random().toString(36).substr(2, 9),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    
    // تحديث واجهة المستخدم فوراً
    this.updateCartUI();
    
    // تحقق من حجم الشاشة قبل عرض الإشعار
    if (window.innerWidth <= 768) {
      // على الشاشات الصغيرة، عرض إشعار صغير في الأعلى
      this.showNotification(`تمت إضافة ${product.name} للسلة`);
    } else {
      // على الشاشات الكبيرة، الإشعار الحالي
      this.showNotification(`تمت إضافة ${product.name} للسلة`);
    }
  }

  // تحديث كمية منتج
  updateItemQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.cart.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
    }
  }

  // إزالة منتج من السلة
  removeItem(itemId) {
    this.cart.items = this.cart.items.filter(item => item.id !== itemId);
    this.saveCart();
  }

  // حساب المجموع الفرعي
  getSubtotal() {
    return this.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // حساب الخصم
  getDiscount() {
    const subtotal = this.getSubtotal();
    let discount = 0;

    this.cart.coupons.forEach(coupon => {
      if (coupon.type === 'percentage') {
        discount += subtotal * (coupon.discount / 100);
      } else {
        discount += coupon.discount;
      }
    });

    return discount;
  }

  // حساب الضريبة (افتراضياً 15%)
  getTax() {
    return (this.getSubtotal() - this.getDiscount()) * 0.15;
  }

  // حساب الشحن (مثال: شحن مجاني فوق 200 ريال)
  getShipping() {
    return this.getSubtotal() > 200 ? 0 : 15;
  }

  // حساب الإجمالي
  getTotal() {
    return this.getSubtotal() - this.getDiscount() + this.getTax() + this.getShipping();
  }

  // تطبيق كوبون خصم
  applyCoupon(code) {
    // هنا يمكن التحقق من صحة الكوبون
    // مثال مبسط:
    const validCoupons = {
      "SUMMER2023": { discount: 15, type: "percentage" },
      "FIXED10": { discount: 10, type: "fixed" }
    };

    if (validCoupons[code]) {
      // التحقق من عدم تكرار الكوبون
      const existingCoupon = this.cart.coupons.find(c => c.code === code);
      if (!existingCoupon) {
        this.cart.coupons.push({
          code: code,
          ...validCoupons[code]
        });
        this.saveCart();
        this.showNotification(`تم تطبيق كوبون الخصم: ${code}`);
        return true;
      } else {
        this.showNotification(`كوبون الخصم ${code} مستخدم بالفعل`);
        return false;
      }
    } else {
      this.showNotification(`كوبون الخصم ${code} غير صالح`);
      return false;
    }
  }

  // إزالة كوبون خصم
  removeCoupon(code) {
    this.cart.coupons = this.cart.coupons.filter(coupon => coupon.code !== code);
    this.saveCart();
  }

  // إفراغ السلة
  clearCart() {
    this.cart = this.createEmptyCart();
    this.saveCart();
    this.showNotification("تم إفراغ السلة");
  }

  // تحديث واجهة المستخدم
  updateCartUI() {
    // تحديث عداد السلة في الأيقونة
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const totalItems = this.cart.items.reduce((count, item) => count + item.quantity, 0);
      cartCount.textContent = totalItems;
      // إظهار العداد دائماً، مع تغيير لون الخلفية إذا كان فارغاً
      if (totalItems > 0) {
        cartCount.style.backgroundColor = '#e74c3c';
      } else {
        cartCount.style.backgroundColor = '#95a5a6';
      }
    }

    // تحديث نافذة السلة المنبثقة أو صفحة السلة
    this.renderCart();
  }

  // عرض محتويات السلة
  renderCart() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;

    if (this.cart.items.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart-message">سلة التسوق فارغة</p>';
      return;
    }

    let cartHTML = '<div class="cart-items">';

    this.cart.items.forEach(item => {
      cartHTML += `
        <div class="cart-item" data-id="${item.id}">
          <div class="item-details">
            <h3>${item.name}</h3>
            <p class="item-price">${item.price.toFixed(2)} ريال</p>
            <div class="quantity-controls">
              <button class="decrease-quantity">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="increase-quantity">+</button>
            </div>
          </div>
          <div class="item-total">
            <p>${(item.price * item.quantity).toFixed(2)} ريال</p>
            <button class="remove-item">حذف</button>
          </div>
        </div>
      `;
    });

    cartHTML += '</div>';

    // إضافة ملخص الطلب
    cartHTML += `
      <div class="cart-summary">
        <div class="summary-row">
          <span>المجموع الفرعي:</span>
          <span>${this.getSubtotal().toFixed(2)} ريال</span>
        </div>
        <div class="summary-row">
          <span>الخصم:</span>
          <span>-${this.getDiscount().toFixed(2)} ريال</span>
        </div>
        <div class="summary-row">
          <span>الضريبة (15%):</span>
          <span>${this.getTax().toFixed(2)} ريال</span>
        </div>
        <div class="summary-row">
          <span>الشحن:</span>
          <span>${this.getShipping().toFixed(2)} ريال</span>
        </div>
        <div class="summary-row total">
          <span>الإجمالي:</span>
          <span>${this.getTotal().toFixed(2)} ريال</span>
        </div>
      </div>
    `;

    // إضافة نموذج الخصم
    cartHTML += `
      <div class="coupon-section">
        <input type="text" id="coupon-code" placeholder="أدخل كود الخصم">
        <button id="apply-coupon">تطبيق</button>
      </div>
    `;

    // إضافة أزرار الإجراءات
    cartHTML += `
      <div class="cart-actions">
        <button id="clear-cart">إفراغ السلة</button>
        <button id="checkout">إتمام الشراء</button>
      </div>
    `;

    cartContainer.innerHTML = cartHTML;

    // إضافة مستمعي الأحداث
    this.attachCartEventListeners();
  }

  // إضافة مستمعي الأحداث لعناصر السلة
  attachCartEventListeners() {
    // أزرار التحكم في الكمية
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        const item = this.cart.items.find(i => i.id === itemId);
        if (item) {
          this.updateItemQuantity(itemId, item.quantity - 1);
        }
      });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        const item = this.cart.items.find(i => i.id === itemId);
        if (item) {
          this.updateItemQuantity(itemId, item.quantity + 1);
        }
      });
    });

    // أزرار حذف العناصر
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        this.removeItem(itemId);
      });
    });

    // زر تطبيق الخصم
    const applyCouponButton = document.getElementById('apply-coupon');
    if (applyCouponButton) {
      applyCouponButton.addEventListener('click', () => {
        const couponCode = document.getElementById('coupon-code').value.trim();
        if (couponCode) {
          this.applyCoupon(couponCode);
        }
      });
    }

    // زر إفراغ السلة
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
      clearCartButton.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من أنك تريد إفراغ السلة؟')) {
          this.clearCart();
        }
      });
    }

    // زر إتمام الشراء
    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        this.processCheckout();
      });
    }
  }

  // معالجة عملية الدفع
  processCheckout() {
    // هنا يمكن إضافة منطق معالجة الدفع
    // مثال: عرض نموذج الدفع أو التحويل لصفحة الدفع

    // في هذا المثال البسيط، سنعرض رسالة تأكيد
    alert(`شكراً لشرائك! المبلغ الإجمالي: ${this.getTotal().toFixed(2)} ريال`);

    // إفراغ السلة بعد الشراء
    this.clearCart();
  }

  // عرض إشعارات للمستخدم
  showNotification(message) {
    // إزالة أي إشعارات موجودة قبل عرض الإشعار الجديد
    const existingNotifications = document.querySelectorAll('.cart-notification, .notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;

    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);

    // إظهار الإشعار
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // تهيئة مدير السلة
  init() {
    // تحديث واجهة المستخدم عند التحميل
    this.updateCartUI();

    // إضافة مستمعي الأحداث لأزرار "إضافة للسلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        // الحصول على بيانات المنتج
        const productElement = e.target.closest('.product-card');
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
            this.addItem(product);
          }
        }
      });
    });

    // إضافة مستمع لفتح صفحة السلة عند الضغط على الأيقونة
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        // الانتقال إلى صفحة السلة
        window.location.href = 'cart.html';
      });
    }
    
    // إضافة مستمع لفتح/إغلاق السلة الجانبية في صفحة السلة
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');

    if (closeCart && cartSidebar) {
      closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
      });
    }
  }
}

// إنشاء نسخة من مدير السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  window.cartManager = new CartManager();
});
