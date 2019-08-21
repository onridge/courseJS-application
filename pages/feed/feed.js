export default function () {

    const modal = document.getElementById("myModal1");
    const conteiner = document.getElementById('photo');
    const addCommentbtn = document.querySelector('#setComment');
    const fieldComment = document.getElementById('addComment');
    const modalImage = document.getElementById('img011');
    const commentDiv = document.getElementById('div-comment');

    conteiner.addEventListener('click', function (event) {
        if(event.target.nodeName === 'IMG'){
            wrapper(event.target.src);
            loadComment(localStorage.getItem('token'),event.target.src);
        }
    });

    addCommentbtn.addEventListener('click', function(event){
        let textComment = fieldComment.value;
        let token = localStorage.getItem('token');
        addComment(textComment, token, modalImage.src);
    });

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

    function getImage(token) {
        fetch('https://intern-staging.herokuapp.com/api/file/', {
            method: 'GET',
            headers: {
                'token': token,
            }
        }).then(
            resp => resp.json(),
        ).then(
            json =>{ console.log(json);
                json.forEach(function (image) {
                    let containerImage = document.createElement('div');
                    containerImage.classList.add('containerImage');
                    let content = document.createElement('div');
                    content.classList.add('content');
                    containerImage.appendChild(content);
                    let img = document.createElement('img');
                    img.classList.add('image');
                    img.src = image.url;
                    content.appendChild(img);
                    conteiner.appendChild(containerImage);
                })
            }
        )
    }

    getImage(localStorage.getItem('token'));

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

