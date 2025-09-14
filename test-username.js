
// ��� ������� ����� ���� ��� ��������
function testUsernameDisplay() {
    // ����� ������ ������
    localStorage.setItem('username', 'test@example.com');
    localStorage.setItem('firstName', '����');
    localStorage.setItem('lastName', '����');

    // ����� ������� �� ������
    const accountSpan = document.querySelector('.account span');
    const usernameDisplay = document.getElementById('username-display');

    if (accountSpan) {
        accountSpan.textContent = '���� ����';
        console.log('�� ����� ������ ������');
    } else {
        console.error('�� ��� ������ ��� ���� ������ ������');
    }

    if (usernameDisplay) {
        usernameDisplay.textContent = '���� ����';
        console.log('�� ����� ��� �������� �� ������� ��������');
    } else {
        console.error('�� ��� ������ ��� ���� ��� ��� ��������');
    }

    // ����� ����� ������ ��� �������
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// ����� ��������
testUsernameDisplay();
