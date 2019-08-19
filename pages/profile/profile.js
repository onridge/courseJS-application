const form = document.forms.namedItem('uploadFile');
let parent = "5d361abd0d5fce0004063c91";
let conteiner = document.getElementById('profilePhoto');
const lastImg = document.getElementById('contentUpload');

function uploadImage(url, method, body, headers) {
    fetch('https://intern-staging.herokuapp.com/api' + url, {
        method: method,
        body:body,
        headers:headers,
    }).then(
        resp => resp.json()
    ).then(
        json => console.log(json)
    );
}

uploadImage('/identification', 'GET', null);

form.addEventListener('submit', function (event) {
    let formD = new FormData(this);
    formD.append('parentEntityId', parent);
    uploadImage('/file', 'POST', formD,{'token': localStorage.getItem('token')});
    event.preventDefault();
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
            json.forEach(function (imageProfile) {
                let containerImage = document.createElement('div');
                containerImage.classList.add('containerImage');
                let content = document.createElement('div');
                content.classList.add('content');
                containerImage.appendChild(content);
                let img = document.createElement('img');
                img.classList.add('image');
                img.src = imageProfile.url;
                content.appendChild(img);
                conteiner.insertBefore(containerImage,lastImg);
        }
        )})
}

getImageParent(localStorage.getItem('token'), parent);


