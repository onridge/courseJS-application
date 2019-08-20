const form = document.forms.namedItem('uploadFile');
let parent = localStorage.getItem('parentId');
let conteiner = document.getElementById('profilePhoto');
const lastImg = document.getElementById('contentUpload');
const userName = document.getElementById('usernameConteiner');
let modal = document.getElementById("myModal1");
const uploadBtn = document.getElementById('uploadBtn');
const addCommentbtn = document.querySelector('#setComment');

function uploadImage(url, method, body, headers) {
    fetch('https://intern-staging.herokuapp.com/api' + url, {
        method: method,
        body:body,
        headers:headers,
    }).then(
        resp => resp.json()
    ).then(
        json => {
            console.log(json)
            let containerImage = document.createElement('div');
            containerImage.classList.add('containerImage');
            let content = document.createElement('div');
            content.classList.add('content');
            containerImage.appendChild(content);
            let img = document.createElement('img');
            img.classList.add('image');
            img.src = json.url;
            content.appendChild(img);
            conteiner.insertBefore(containerImage, lastImg.nextSibling);
        }

    );
}

uploadBtn.addEventListener('input', function (event) {
    if (uploadBtn.files) {
        let formD = new FormData(form);
        formD.append('parentEntityId', parent);
        uploadImage('/file', 'POST', formD,{'token': localStorage.getItem('token')});
        event.preventDefault();
    }
});

function getImageParent(token, parentEntityId) {
    fetch('https://intern-staging.herokuapp.com/api/file/' + parentEntityId, {
        method: 'GET',
        headers: {
            'token': token,
            'parentEntityId': parentEntityId,
        }
    }).then(
        resp => resp.json(),
    ).then(
        json => {
            console.log(json);
            for(let i = json.length - 1; i > 0; i--) {
                let imageProfile = json[i];
                let containerImage = document.createElement('div');
                containerImage.classList.add('containerImage');
                let content = document.createElement('div');
                content.classList.add('content');
                containerImage.appendChild(content);
                let img = document.createElement('img');
                img.classList.add('image');
                img.src = imageProfile.url;
                content.appendChild(img);
                conteiner.appendChild(containerImage);
            }

        })
}

getImageParent(localStorage.getItem('token'), parent);

function addUsername(email) {
    let spanUser = document.createElement('span');
    spanUser.classList.add('username');
    userName.appendChild(spanUser);
    spanUser.textContent = email;
}

addUsername(localStorage.getItem('email'));

conteiner.addEventListener('click', function (event) {
    if(event.target.nodeName === 'IMG' && event.target.id !== 'uploadImage'){
        wrapper(event.target.src);
    }
});

function wrapper(src) {
    let modalImg = document.getElementById("img011");

    modal.style.display = "block";
    modalImg.src = src;
    let span = document.getElementsByClassName("close1")[0];

    span.onclick = function() {
        modal.style.display = "none";
    };
}