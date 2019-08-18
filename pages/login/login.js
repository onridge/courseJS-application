const loginBtn = document.getElementById('loginBtn');
const feedHeader = document.getElementById('feedHeader');
const mainHeader = document.getElementById('header');
const router = '#/feed';

loginBtn.addEventListener('click', function () {
    mainHeader.style.display = 'none';
    feedHeader.style.display = 'block';
    window.location.href = router;
});

