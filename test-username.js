
// ﬂÊœ ·«Œ »«—  Œ“Ì‰ Ê⁄—÷ «”„ «·„” Œœ„
function testUsernameDisplay() {
    //  Œ“Ì‰ »Ì«‰«  «Œ »«—
    localStorage.setItem('username', 'test@example.com');
    localStorage.setItem('firstName', '√Õ„œ');
    localStorage.setItem('lastName', '„Õ„œ');

    //  ÕœÌÀ «·⁄‰«’— ›Ì «·’›Õ…
    const accountSpan = document.querySelector('.account span');
    const usernameDisplay = document.getElementById('username-display');

    if (accountSpan) {
        accountSpan.textContent = '√Õ„œ „Õ„œ';
        console.log(' „  ÕœÌÀ √ÌﬁÊ‰… «·Õ”«»');
    } else {
        console.error('·„ Ì „ «·⁄ÀÊ— ⁄·Ï ⁄‰’— √ÌﬁÊ‰… «·Õ”«»');
    }

    if (usernameDisplay) {
        usernameDisplay.textContent = '√Õ„œ „Õ„œ';
        console.log(' „  ÕœÌÀ «”„ «·„” Œœ„ ›Ì «·Ê«ÃÂ… «·—∆Ì”Ì…');
    } else {
        console.error('·„ Ì „ «·⁄ÀÊ— ⁄·Ï ⁄‰’— ⁄—÷ «”„ «·„” Œœ„');
    }

    // ≈⁄«œ…  Õ„Ì· «·’›Õ… »⁄œ À«‰Ì Ì‰
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

//  ‘€Ì· «·«Œ »«—
testUsernameDisplay();
