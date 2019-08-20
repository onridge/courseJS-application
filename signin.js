let modal = document.getElementById('id01');
const profileBtn = document.getElementById('profile');
const router = '#/profile';
const logOutBtn = document.getElementById('logOut');

profileBtn.addEventListener('click', ()=>{
    window.location.href = router;
});

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function cancel() {
    document.getElementById('id01').style.display='none';
}

function openModal() {
    document.getElementById('id01').style.display='block'
}

logOutBtn.addEventListener("click", function () {
    localStorage.clear();
    window.location.hash = '';
});