
// Document Ready Function
// تم إضافة مدير الإشعارات الموحد (notification-manager.js) لاستبدال الدوال المكررة
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const username = localStorage.getItem('username');
    if (username !== 'admin@myaccountvip.com') {
        // Redirect to login page if not admin
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    loadDashboardData();
    setupTabs();
    setupUserManagement();
    setupProductManagement();
    setupInvitationCodes();
});

// Load dashboard data
function loadDashboardData() {
    // Load users count
    const usersCount = localStorage.getItem('usersCount') || 0;
    document.getElementById('usersCount').textContent = usersCount;

    // Load products count
    const productsCount = localStorage.getItem('productsCount') || 0;
    document.getElementById('productsCount').textContent = productsCount;

    // Load orders count
    const ordersCount = localStorage.getItem('ordersCount') || 0;
    document.getElementById('ordersCount').textContent = ordersCount;

    // Load revenue
    const revenue = localStorage.getItem('revenue') || 0;
    document.getElementById('revenue').textContent = revenue + ' ر.س';
}

// Setup tabs
function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
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

// Setup user management
function setupUserManagement() {
    const usersTable = document.getElementById('usersTableBody');
    const searchBox = document.getElementById('userSearch');
    const addUserBtn = document.getElementById('addUserBtn');
    const userForm = document.getElementById('userForm');
    const cancelUserBtn = document.getElementById('cancelUserBtn');

    // Load users
    loadUsers();

    // Search users
    if (searchBox) {
        searchBox.addEventListener('input', () => {
            const searchTerm = searchBox.value.toLowerCase();
            filterUsers(searchTerm);
        });
    }

    // Add user button
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            showUserForm();
        });
    }

    // Cancel user form
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', () => {
            hideUserForm();
        });
    }

    // Submit user form
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveUser();
        });
    }

    // Load users function
    function loadUsers() {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Clear table
        if (usersTable) {
            usersTable.innerHTML = '';

            // Add users to table
            users.forEach(user => {
                const row = createUserRow(user);
                usersTable.appendChild(row);
            });
        }
    }

    // Create user row
    function createUserRow(user) {
        const row = document.createElement('tr');

        // User info
        const userInfoCell = document.createElement('td');
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';

        const avatar = document.createElement('img');
        avatar.className = 'user-avatar';
        avatar.src = user.avatar || 'https://i.pravatar.cc/150?u=' + user.id;
        avatar.alt = user.name;

        const userDetails = document.createElement('div');
        userDetails.className = 'user-details';

        const name = document.createElement('div');
        name.className = 'user-name';
        name.textContent = user.name;

        const email = document.createElement('div');
        email.className = 'user-email';
        email.textContent = user.email;

        userDetails.appendChild(name);
        userDetails.appendChild(email);
        userInfo.appendChild(avatar);
        userInfo.appendChild(userDetails);
        userInfoCell.appendChild(userInfo);

        // Join date
        const joinDateCell = document.createElement('td');
        joinDateCell.textContent = user.joinDate || 'غير متوفر';

        // Status
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = 'status-badge ' + (user.active ? 'active' : 'inactive');
        statusBadge.textContent = user.active ? 'نشط' : 'غير نشط';
        statusCell.appendChild(statusBadge);

        // Actions
        const actionsCell = document.createElement('td');
        const actions = document.createElement('div');
        actions.className = 'action-buttons';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'عرض';
        viewBtn.addEventListener('click', () => {
            viewUser(user.id);
        });

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'تعديل';
        editBtn.addEventListener('click', () => {
            editUser(user.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'حذف';
        deleteBtn.addEventListener('click', () => {
            deleteUser(user.id);
        });

        actions.appendChild(viewBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        actionsCell.appendChild(actions);

        // Add cells to row
        row.appendChild(userInfoCell);
        row.appendChild(joinDateCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);

        return row;
    }

    // Filter users
    function filterUsers(searchTerm) {
        const rows = usersTable.querySelectorAll('tr');

        rows.forEach(row => {
            const userName = row.querySelector('.user-name').textContent.toLowerCase();
            const userEmail = row.querySelector('.user-email').textContent.toLowerCase();

            if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Show user form
    function showUserForm(user = null) {
        const userForm = document.getElementById('userForm');
        const formTitle = document.getElementById('userFormTitle');

        if (user) {
            // Edit mode
            formTitle.textContent = 'تعديل المستخدم';
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').value = '';
            document.getElementById('userStatus').value = user.active ? 'active' : 'inactive';
        } else {
            // Add mode
            formTitle.textContent = 'إضافة مستخدم جديد';
            userForm.reset();
            document.getElementById('userId').value = '';
        }

        document.getElementById('userFormContainer').style.display = 'block';
    }

    // Hide user form
    function hideUserForm() {
        document.getElementById('userFormContainer').style.display = 'none';
    }

    // Save user
    function saveUser() {
        const userId = document.getElementById('userId').value;
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const status = document.getElementById('userStatus').value;

        // Get users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (userId) {
            // Update existing user
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index].name = name;
                users[index].email = email;
                if (password) {
                    users[index].password = password;
                }
                users[index].active = status === 'active';
            }
        } else {
            // Add new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                active: status === 'active',
                joinDate: new Date().toLocaleDateString('ar-SA')
            };
            users.push(newUser);
        }

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('usersCount', users.length);

        // Reload users
        loadUsers();
        loadDashboardData();

        // Hide form
        hideUserForm();

        // Show notification
        showNotification(userId ? 'تم تحديث المستخدم بنجاح' : 'تمت إضافة المستخدم بنجاح', 'success');
    }

    // View user
    function viewUser(userId) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);

        if (user) {
            // Store current user being viewed
            localStorage.setItem('viewingUserId', userId);

            // Redirect to user page
            window.location.href = 'user-page.html?userId=' + userId;
        }
    }

    // Edit user
    function editUser(userId) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);

        if (user) {
            showUserForm(user);
        }
    }

    // Delete user
    function deleteUser(userId) {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            // Get users from localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // Remove user
            users = users.filter(u => u.id !== userId);

            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('usersCount', users.length);

            // Reload users
            loadUsers();
            loadDashboardData();

            // Show notification
            showNotification('تم حذف المستخدم بنجاح', 'success');
        }
    }
}

// Setup product management
function setupProductManagement() {
    // Similar implementation to user management
    // This would include functions for adding, editing, viewing, and deleting products
}

// Setup invitation codes
function setupInvitationCodes() {
    const generateCodesBtn = document.getElementById('generateCodesBtn');
    const codesTable = document.getElementById('codesTableBody');

    // Load invitation codes
    loadInvitationCodes();

    // Generate codes button
    if (generateCodesBtn) {
        generateCodesBtn.addEventListener('click', () => {
            generateNewInvitationCodes();
        });
    }

    // Load invitation codes function
    function loadInvitationCodes() {
        // Get codes from localStorage
        const codes = JSON.parse(localStorage.getItem('invitationCodes')) || [];

        // Clear table
        if (codesTable) {
            codesTable.innerHTML = '';

            // Add codes to table
            codes.forEach(code => {
                const row = createCodeRow(code);
                codesTable.appendChild(row);
            });
        }
    }

    // Create code row
    function createCodeRow(code) {
        const row = document.createElement('tr');

        // Code
        const codeCell = document.createElement('td');
        codeCell.textContent = code.code;

        // Status
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = 'status-badge ' + (code.used ? 'inactive' : 'active');
        statusBadge.textContent = code.used ? 'مستخدم' : 'متاح';
        statusCell.appendChild(statusBadge);

        // Created date
        const createdDateCell = document.createElement('td');
        createdDateCell.textContent = code.createdDate || 'غير متوفر';

        // Used by
        const usedByCell = document.createElement('td');
        usedByCell.textContent = code.usedBy || '-';

        // Actions
        const actionsCell = document.createElement('td');
        const actions = document.createElement('div');
        actions.className = 'action-buttons';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-view';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = 'نسخ';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(code.code);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'حذف';
        deleteBtn.addEventListener('click', () => {
            deleteCode(code.id);
        });

        actions.appendChild(copyBtn);
        actions.appendChild(deleteBtn);
        actionsCell.appendChild(actions);

        // Add cells to row
        row.appendChild(codeCell);
        row.appendChild(statusCell);
        row.appendChild(createdDateCell);
        row.appendChild(usedByCell);
        row.appendChild(actionsCell);

        return row;
    }

    // Generate new invitation codes
    function generateNewInvitationCodes() {
        const count = prompt('كم عدد رموز الدعوة التي تريد إنشاءها؟', '10');

        if (count && !isNaN(count) && parseInt(count) > 0) {
            // Get existing codes
            let codes = JSON.parse(localStorage.getItem('invitationCodes')) || [];

            // Generate new codes
            const newCodes = [];
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            for (let j = 0; j < parseInt(count); j++) {
                let code = 'VIP-';

                // First part (4 characters)
                for (let i = 0; i < 4; i++) {
                    code += characters.charAt(Math.floor(Math.random() * characters.length));
                }

                code += '-';

                // Second part (4 characters)
                for (let i = 0; i < 4; i++) {
                    code += characters.charAt(Math.floor(Math.random() * characters.length));
                }

                newCodes.push({
                    id: Date.now().toString() + j,
                    code,
                    createdDate: new Date().toLocaleDateString('ar-SA'),
                    used: false,
                    usedBy: null
                });
            }

            // Add to existing codes
            codes = [...codes, ...newCodes];

            // Save to localStorage
            localStorage.setItem('invitationCodes', JSON.stringify(codes));

            // Reload codes
            loadInvitationCodes();

            // Show notification
            showNotification(`تم إنشاء ${count} رموز دعوة بنجاح`, 'success');
        }
    }

    // Copy to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('تم نسخ الرمز بنجاح!', 'success');
        }).catch(err => {
            showNotification('فشل نسخ الرمز. يرجى نسخه يدوياً', 'error');
            console.error('Could not copy text: ', err);
        });
    }

    // Delete code
    function deleteCode(codeId) {
        if (confirm('هل أنت متأكد من حذف هذا الرمز؟')) {
            // Get codes from localStorage
            let codes = JSON.parse(localStorage.getItem('invitationCodes')) || [];

            // Remove code
            codes = codes.filter(c => c.id !== codeId);

            // Save to localStorage
            localStorage.setItem('invitationCodes', JSON.stringify(codes));

            // Reload codes
            loadInvitationCodes();

            // Show notification
            showNotification('تم حذف الرمز بنجاح', 'success');
        }
    }
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
