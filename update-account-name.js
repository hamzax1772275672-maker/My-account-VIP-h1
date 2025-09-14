
// ÏÇáÉ áÊÍÏíË ÇÓã ÇáãÓÊÎÏã İí ÃíŞæäÉ ÇáÍÓÇÈ
function updateAccountName() {
    // ÇÓÊÑÌÇÚ ÇáÇÓã ÇáãÚÑæÖ ãä ÇáÊÎÒíä ÇáãÍáí
    const displayName = localStorage.getItem('displayName');

    // ÇáÈÍË Úä ÚäÕÑ ÃíŞæäÉ ÇáÍÓÇÈ
    const accountElement = document.querySelector('.account');

    if (accountElement && displayName) {
        // ÇáÈÍË Úä ÚäÕÑ ÇáäÕ ÏÇÎá ÃíŞæäÉ ÇáÍÓÇÈ
        const accountSpan = accountElement.querySelector('span');

        if (accountSpan) {
            // ÊÍÏíË ÇáäÕ áÚÑÖ ÇáÇÓã ÇáßÇãá
            accountSpan.textContent = displayName;
            console.log('Êã ÊÍÏíË ÇÓã ÇáãÓÊÎÏã İí ÃíŞæäÉ ÇáÍÓÇÈ:', displayName);
        }
    }
}

// ÇÓÊÏÚÇÁ ÇáÏÇáÉ ÚäÏ ÊÍãíá ÇáÕİÍÉ
document.addEventListener('DOMContentLoaded', updateAccountName);

// ÇÓÊÏÚÇÁ ÇáÏÇáÉ ÃíÖÇğ ÚäÏ Ãí ÊÛííÑ İí ÇáÊÎÒíä ÇáãÍáí
window.addEventListener('storage', updateAccountName);
