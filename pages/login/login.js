const loginBtn = document.getElementById('loginBtn');
const feedHeader = document.getElementById('feedHeader');
const mainHeader = document.getElementById('header');

loginBtn.addEventListener('click', function () {
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let newUser = {email:email, password: password};
    localStorage.setItem('email', email);
    doRequest(newUser);
});

function doRequest(data) {
    fetch('https://intern-staging.herokuapp.com/api/identification/sign_in',{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(
        resp => resp.json()
    ).then(
        json =>{
           if (json.token){
                localStorage.setItem('token', json.token);
                mainHeader.style.display = 'none';
                feedHeader.style.display = 'block';
                window.location.href = window.location.origin + '#/feed';
                return fetch('https://intern-staging.herokuapp.com/api/identification',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            }
        }

    ).then(
        resp => resp.json()

    ).then( json => {
        console.log(json);
        if(json){
           json.forEach(function (user) {
               if(user.email === localStorage.getItem('email')){
                   console.log(user);
                   localStorage.setItem('parentId', user._id);
               }
           })
        }
        }
    ).catch(
        resp => alert('Incorrect E-mail or password')
    );
}