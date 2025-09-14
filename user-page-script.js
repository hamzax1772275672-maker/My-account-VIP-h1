
// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const username = localStorage.getItem('username');
    if (username !== 'admin@myaccountvip.com') {
        // Redirect to login page if not admin
        window.location.href = 'login.html';
        return;
    }

    // Get user ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (!userId) {
        // If no user ID, redirect to admin page
        window.location.href = 'admin.html';
        return;
    }

    // Initialize user page
    loadUserData(userId);
    setupTabs();
    setupEventListeners(userId);
});

// Load user data
function loadUserData(userId) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user by ID
    const user = users.find(u => u.id === userId);

    if (user) {
        // Update user info in header
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userAvatar').src = user.avatar || 'https://i.pravatar.cc/150?u=' + user.id;

        // Update profile form
        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileAddress').value = user.address || '';
        document.getElementById('profileBio').value = user.bio || '';

        // Update account settings
        document.getElementById('accountStatus').value = user.active ? 'active' : 'inactive';
        document.getElementById('accountType').value = user.type || 'regular';

        // Load user statistics
        loadUserStats(userId);

        // Load user orders
        loadUserOrders(userId);

        // Load user products
        loadUserProducts(userId);
    } else {
        // User not found
        showNotification('المستخدم غير موجود', 'error');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 2000);
    }
}

// Load user statistics
function loadUserStats(userId) {
    // In a real application, this would fetch data from a server
    // For this demo, we'll use mock data

    // Get user stats from localStorage or use defaults
    const userStats = JSON.parse(localStorage.getItem('userStats_' + userId)) || {
        orders: Math.floor(Math.random() * 50),
        products: Math.floor(Math.random() * 20),
        wishlist: Math.floor(Math.random() * 30),
        reviews: Math.floor(Math.random() * 15)
    };

    // Update stats cards
    document.getElementById('userOrdersCount').textContent = userStats.orders;
    document.getElementById('userProductsCount').textContent = userStats.products;
    document.getElementById('userWishlistCount').textContent = userStats.wishlist;
    document.getElementById('userReviewsCount').textContent = userStats.reviews;
}

// Load user orders
function loadUserOrders(userId) {
    const ordersTable = document.getElementById('ordersTableBody');

    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Filter orders by user ID
    const userOrders = orders.filter(order => order.userId === userId);

    // Clear table
    ordersTable.innerHTML = '';

    // Add orders to table
    userOrders.forEach(order => {
        const row = createOrderRow(order);
        ordersTable.appendChild(row);
    });

    // If no orders, show message
    if (userOrders.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.textContent = 'لا توجد طلبات لهذا المستخدم';
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        row.appendChild(cell);
        ordersTable.appendChild(row);
    }
}

// Create order row
function createOrderRow(order) {
    const row = document.createElement('tr');

    // Order ID
    const idCell = document.createElement('td');
    idCell.textContent = order.id;

    // Order date
    const dateCell = document.createElement('td');
    dateCell.textContent = order.date;

    // Order total
    const totalCell = document.createElement('td');
    totalCell.textContent = order.total + ' ر.س';

    // Order status
    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge ' + order.status;
    statusBadge.textContent = getStatusText(order.status);
    statusCell.appendChild(statusBadge);

    // Actions
    const actionsCell = document.createElement('td');
    const actions = document.createElement('div');
    actions.className = 'action-buttons';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-view btn-small';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.title = 'عرض';
    viewBtn.addEventListener('click', () => {
        viewOrder(order.id);
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-edit btn-small';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = 'تعديل';
    editBtn.addEventListener('click', () => {
        editOrder(order.id);
    });

    actions.appendChild(viewBtn);
    actions.appendChild(editBtn);
    actionsCell.appendChild(actions);

    // Add cells to row
    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(totalCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);

    return row;
}

// Get status text in Arabic
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'قيد الانتظار';
        case 'processing':
            return 'قيد المعالجة';
        case 'shipped':
            return 'تم الشحن';
        case 'delivered':
            return 'تم التسليم';
        case 'cancelled':
            return 'ملغي';
        default:
            return status;
    }
}

// Load user products
function loadUserProducts(userId) {
    const productsGrid = document.getElementById('userProductsGrid');

    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Filter products by user ID
    const userProducts = products.filter(product => product.userId === userId);

    // Clear grid
    productsGrid.innerHTML = '';

    // Add products to grid
    userProducts.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });

    // If no products, show message
    if (userProducts.length === 0) {
        const message = document.createElement('div');
        message.textContent = 'لا توجد منتجات لهذا المستخدم';
        message.style.textAlign = 'center';
        message.style.padding = '20px';
        message.style.gridColumn = '1 / -1';
        productsGrid.appendChild(message);
    }
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Product image
    const imgContainer = document.createElement('div');
    imgContainer.className = 'product-img';

    const img = document.createElement('img');
    img.src = product.image || 'https://picsum.photos/seed/' + product.id + '/300/300.jpg';
    img.alt = product.name;

    imgContainer.appendChild(img);

    // Product info
    const info = document.createElement('div');
    info.className = 'product-info';

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = product.price + ' ر.س';

    const status = document.createElement('div');
    status.className = 'product-status';

    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge ' + (product.active ? 'active' : 'inactive');
    statusBadge.textContent = product.active ? 'نشط' : 'غير نشط';

    status.appendChild(statusBadge);

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(status);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'product-actions';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-view btn-small';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i> عرض';
    viewBtn.addEventListener('click', () => {
        viewProduct(product.id);
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-edit btn-small';
    editBtn.innerHTML = '<i class="fas fa-edit"></i> تعديل';
    editBtn.addEventListener('click', () => {
        editProduct(product.id);
    });

    actions.appendChild(viewBtn);
    actions.appendChild(editBtn);

    // Add all parts to card
    card.appendChild(imgContainer);
    card.appendChild(info);
    card.appendChild(actions);

    return card;
}

// Setup tabs
function setupTabs() {
    const tabs = document.querySelectorAll('.user-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup event listeners
function setupEventListeners(userId) {
    // Back to admin button
    const backToAdminBtn = document.getElementById('backToAdminBtn');
    if (backToAdminBtn) {
        backToAdminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Save changes button
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', () => {
            saveUserChanges(userId);
        });
    }

    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            toggleProfileEdit(true);
        });
    }

    // Cancel profile edit button
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');
    if (cancelProfileBtn) {
        cancelProfileBtn.addEventListener('click', () => {
            toggleProfileEdit(false);
            loadUserData(userId); // Reset form data
        });
    }

    // Save profile button
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            saveUserProfile(userId);
        });
    }

    // Edit account button
    const editAccountBtn = document.getElementById('editAccountBtn');
    if (editAccountBtn) {
        editAccountBtn.addEventListener('click', () => {
            toggleAccountEdit(true);
        });
    }

    // Cancel account edit button
    const cancelAccountBtn = document.getElementById('cancelAccountBtn');
    if (cancelAccountBtn) {
        cancelAccountBtn.addEventListener('click', () => {
            toggleAccountEdit(false);
            loadUserData(userId); // Reset form data
        });
    }

    // Save account button
    const saveAccountBtn = document.getElementById('saveAccountBtn');
    if (saveAccountBtn) {
        saveAccountBtn.addEventListener('click', () => {
            saveUserAccount(userId);
        });
    }
}

// Toggle profile edit mode
function toggleProfileEdit(enable) {
    const profileInputs = document.querySelectorAll('#profile-tab input, #profile-tab textarea');
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');

    profileInputs.forEach(input => {
        input.disabled = !enable;
    });

    if (enable) {
        editBtn.style.display = 'none';
        cancelBtn.style.display = 'inline-block';
        saveBtn.style.display = 'inline-block';
    } else {
        editBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';
    }
}

// Toggle account edit mode
function toggleAccountEdit(enable) {
    const accountInputs = document.querySelectorAll('#account-tab select');
    const editBtn = document.getElementById('editAccountBtn');
    const cancelBtn = document.getElementById('cancelAccountBtn');
    const saveBtn = document.getElementById('saveAccountBtn');

    accountInputs.forEach(input => {
        input.disabled = !enable;
    });

    if (enable) {
        editBtn.style.display = 'none';
        cancelBtn.style.display = 'inline-block';
        saveBtn.style.display = 'inline-block';
    } else {
        editBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';
    }
}

// Save user changes
function saveUserChanges(userId) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user index
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Update user data
        users[userIndex].name = document.getElementById('profileName').value;
        users[userIndex].email = document.getElementById('profileEmail').value;
        users[userIndex].phone = document.getElementById('profilePhone').value;
        users[userIndex].address = document.getElementById('profileAddress').value;
        users[userIndex].bio = document.getElementById('profileBio').value;
        users[userIndex].active = document.getElementById('accountStatus').value === 'active';
        users[userIndex].type = document.getElementById('accountType').value;

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Show notification
        showNotification('تم حفظ التغييرات بنجاح', 'success');
    }
}

// Save user profile
function saveUserProfile(userId) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user index
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Update user profile data
        users[userIndex].name = document.getElementById('profileName').value;
        users[userIndex].email = document.getElementById('profileEmail').value;
        users[userIndex].phone = document.getElementById('profilePhone').value;
        users[userIndex].address = document.getElementById('profileAddress').value;
        users[userIndex].bio = document.getElementById('profileBio').value;

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Disable profile edit mode
        toggleProfileEdit(false);

        // Show notification
        showNotification('تم تحديث الملف الشخصي بنجاح', 'success');
    }
}

// Save user account
function saveUserAccount(userId) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user index
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Update user account data
        users[userIndex].active = document.getElementById('accountStatus').value === 'active';
        users[userIndex].type = document.getElementById('accountType').value;

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Disable account edit mode
        toggleAccountEdit(false);

        // Show notification
        showNotification('تم تحديث إعدادات الحساب بنجاح', 'success');
    }
}

// View order
function viewOrder(orderId) {
    // In a real application, this would navigate to an order details page
    showNotification('عرض الطلب رقم ' + orderId, 'info');
}

// Edit order
function editOrder(orderId) {
    // In a real application, this would open an order edit form
    showNotification('تعديل الطلب رقم ' + orderId, 'info');
}

// View product
function viewProduct(productId) {
    // In a real application, this would navigate to a product details page
    showNotification('عرض المنتج رقم ' + productId, 'info');
}

// Edit product
function editProduct(productId) {
    // In a real application, this would open a product edit form
    showNotification('تعديل المنتج رقم ' + productId, 'info');
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Add type class
    if (type === 'success') {
        notification.classList.add('success');
    } else if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'info') {
        notification.classList.add('info');
    }

    // Add to body
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');

        // Remove from DOM after transition completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
