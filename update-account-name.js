
// ���� ������ ��� �������� �� ������ ������
function updateAccountName() {
    // ������� ����� ������� �� ������� ������
    const displayName = localStorage.getItem('displayName');

    // ����� �� ���� ������ ������
    const accountElement = document.querySelector('.account');

    if (accountElement && displayName) {
        // ����� �� ���� ���� ���� ������ ������
        const accountSpan = accountElement.querySelector('span');

        if (accountSpan) {
            // ����� ���� ���� ����� ������
            accountSpan.textContent = displayName;
            console.log('�� ����� ��� �������� �� ������ ������:', displayName);
        }
    }
}

// ������� ������ ��� ����� ������
document.addEventListener('DOMContentLoaded', updateAccountName);

// ������� ������ ����� ��� �� ����� �� ������� ������
window.addEventListener('storage', updateAccountName);
