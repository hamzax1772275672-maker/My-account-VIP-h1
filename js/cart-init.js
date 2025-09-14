// ملف تهيئة السلة لجميع صفحات الموقع
document.addEventListener('DOMContentLoaded', function() {
  // التأكد من ظهور عداد السلة في جميع الصفحات
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    // إظهار العداد دائماً
    cartCount.style.display = 'flex';
    cartCount.style.visibility = 'visible';
    cartCount.style.opacity = '1';
    
    // إذا كانت السلة فارغة، اجعل لون الخلفية رمادي
    if (cartCount.textContent === '0' || cartCount.textContent === '') {
      cartCount.style.backgroundColor = '#95a5a6';
    }
  }
  
  // تهيئة مدير السلة
  if (typeof CartManager !== 'undefined') {
    const cartManager = new CartManager();
    cartManager.init();
  }
  
  // إضافة مستمع لفتح صفحة السلة عند الضغط على الأيقونة
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', function() {
      window.location.href = 'cart.html';
    });
  }
});
