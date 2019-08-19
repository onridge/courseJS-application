let modal = document.getElementById("myModal1");
let conteiner = document.getElementById('photo');
const addCommentbtn = document.querySelector('#setComment');

conteiner.addEventListener('click', function (event) {
    if(event.target.nodeName === 'IMG'){
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

addCommentbtn.addEventListener('click', function(event){
    let textComment = {message: 'Hello Dima', parentId: 'test-Dima'};
    let token = localStorage.getItem('token');
    addComment(textComment, token );
});

function addComment(data, token) {
    fetch('https://intern-staging.herokuapp.com/api/comment', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'token': token,
        },
    }).then(
        resp => resp.json()
    ).then(
        json => console.log(json)
    );
}