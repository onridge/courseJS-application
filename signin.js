const modal = document.getElementById('id01');
const profileBtn = document.getElementById('profile');
const logOutBtn = document.getElementById('logOut');
const feedHeader = document.getElementById('feedHeader');
const mainHeader = document.getElementById('header');
const logo = document.getElementById('logoFeed');
const emailReg = document.getElementById('email-registered');
const registerBtn = document.getElementById('registerBtn');
const API = 'https://intern-staging.herokuapp.com/api';

profileBtn.addEventListener('click', ()=>{
    window.location.href = window.location.origin + '#/profile';
});

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

logOutBtn.addEventListener("click", function () {
    localStorage.clear();
    window.location.href = window.location.origin;
    mainHeader.style.display = 'block';
    feedHeader.style.display = 'none';
});

logo.addEventListener('click',function () {
    window.location.href = window.location.origin + '#/feed';
});

registerBtn.addEventListener('click', function (){
    registered()
});

document.addEventListener('DOMContentLoaded', function () {
        if (localStorage.getItem('token')) {
            feedHeader.style.display = 'block';
            mainHeader.style.display = 'none';
            window.location.href = window.location.origin + '#/feed';
        }
});

function cancel() {
    document.getElementById('id01').style.display='none';
}

function openModal() {
    document.getElementById('id01').style.display='block'
}

function registered() {
    fetch(API + '/identification', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        resp =>
            resp.json()
    ).then(json =>{
        console.log(json);
        json.forEach(function (user) {
            if (emailReg.value === user.email) {
                alert('This email already exists!');
                throw new Error('This email already exists!')
            }
        });
        console.log(emailReg.value);
        fetch(API + '/identification', {
            method: 'POST',
            body: JSON.stringify({
                email: emailReg.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }).then( () => {
        return fetch(API + '/identification', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }).then(
resp => resp.json()
    ).then(json => {
        for (let user of json){
            if(user.email === emailReg.value){
                fetch(API + '/identification/activate', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: user._id
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        }
    })
}