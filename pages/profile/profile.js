export default function () {

    const form = document.forms.namedItem('uploadFile');
    const conteiner = document.getElementById('profilePhoto');
    const lastImg = document.getElementById('contentUpload');
    const userName = document.getElementById('usernameConteiner');
    const modal = document.getElementById("myModal1");
    const uploadBtn = document.getElementById('uploadBtn');
    const postsBtn = document.getElementById('posts');
    const addCommentbtn = document.querySelector('#setComment');
    const fieldComment = document.getElementById('addComment');
    const modalImage = document.getElementById('img011');
    const commentDiv = document.getElementById('div-comment');
    let parent = localStorage.getItem('parentId');
    let amountPost = 0;

    uploadBtn.addEventListener('input', function (event) {
        if (uploadBtn.files) {
            let formD = new FormData(form);
            formD.append('parentEntityId', parent);
            uploadImage('/file', 'POST', formD,{'token': localStorage.getItem('token')});
            event.preventDefault();
        }
    });

    conteiner.addEventListener('click', function (event) {
        if(event.target.nodeName === 'IMG' && event.target.id !== 'uploadImage'){
            wrapper(event.target.src);
            loadComment(localStorage.getItem('token'),event.target.src)
        }
    });

    addCommentbtn.addEventListener('click', function(event){
        let textComment = fieldComment.value;
        let token = localStorage.getItem('token');
        addComment(textComment, token, modalImage.src);
    });

    function uploadImage(url, method, body, headers) {
        fetch('https://intern-staging.herokuapp.com/api' + url, {
            method: method,
            body:body,
            headers:headers,
        }).then(
            resp => resp.json()
        ).then(
            json => {
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
                amountPost++;
                postsBtn.textContent = amountPost + ' Posts';
            }
        );
    }

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
                amountPost = json.length - 1;
                postsBtn.textContent = amountPost + ' Posts';
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

    function wrapper(src) {
        let modalImg = document.getElementById("img011");

        modal.style.display = "block";
        modalImg.src = src;
        let span = document.getElementsByClassName("close1")[0];

        span.onclick = function() {
            modal.style.display = "none";
            commentDiv.innerHTML = '';
        };
    }

    function addComment(data, token, urlImage) {
        fetch('https://intern-staging.herokuapp.com/api/file/', {
            method: 'GET',
            headers: {
                'token': token,
            }
        }).then(
            resp => resp.json(),
        ).then(
            json => {
                console.log(json);
                for (let image of json) {
                    if(image.url === urlImage){
                        return image.public_id;
                    }
                }
            }
        ).then( imageId => {
                console.log(imageId);
                return fetch('https://intern-staging.herokuapp.com/api/comment', {
                    method: 'POST',
                    body: JSON.stringify({
                        message: data,
                        parentId: imageId
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                })
            }

        ).then(
            () =>{
                let containerComment = document.createElement('div');
                containerComment.classList.add('containerComment');
                let user = document.createElement('p');
                user.textContent = 'Anonymous';
                containerComment.appendChild(user);
                let text = document.createElement('p');
                text.textContent = fieldComment.value;
                containerComment.appendChild(text);
                fieldComment.value = '';
                commentDiv.appendChild(containerComment);
            }
        )
    }

    function loadComment(token, urlImage) {
        fetch('https://intern-staging.herokuapp.com/api/file/', {
            method: 'GET',
            headers: {
                'token': token,
            }
        }).then(
            resp => resp.json(),
        ).then(
            json => {
                console.log(json);
                for (let image of json) {
                    if (image.url === urlImage) {
                        return image.public_id;
                    }
                }
            }
        ).then(imageId => {
            return fetch('https://intern-staging.herokuapp.com/api/comment?parentId=' + imageId, {
                method: 'GET',
                headers: {
                    'token': token,
                }
            }).then( resp => resp.json()
            ).then(json => {
                json.forEach(function (comment) {
                    let containerComment = document.createElement('div');
                    containerComment.classList.add('containerComment');
                    let user = document.createElement('p');
                    user.textContent = 'Anonymous';
                    containerComment.appendChild(user);
                    let text = document.createElement('p');
                    text.textContent = comment.message;
                    containerComment.appendChild(text);
                    commentDiv.appendChild(containerComment);
                })
            })
        })
    }
}