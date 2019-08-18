const requestTemplate = (function(){
    const cache = {};
    return function(url) {
        if(cache.hasOwnProperty[url]){
            return Promise.resolve(cache[url]);
        } else {
            return fetch(url).then(res => {
                const html = res.text();
                cache[url] = html;
                return Promise.resolve(html);
            });
        }
    }
})();

const runScript = (function(){
    const cache = {};

    return function (url) {
        if(cache.hasOwnProperty(url)){
            cache[url]();
        } else {
            import(url).then( module => {
                cache[url] = module.default;
                module.default();
            }).catch( err => console.error(err));
        }
    }
})();

const render = (function(){
    const content = document.getElementById('content');
    return function(html){
        content.innerHTML = html;
    }
})();

const routes = {
    '': {
        html: './pages/login/login.html',
        src: './pages/login/login.js'
    },
    'feed': {
        html:'./pages/feed/feed.html',
        src: './pages/feed/feed.js'
    },
    'profile': {
        html:'./pages/profile/profile.html',
        src: './pages/profile/profile.js'
    },
};

const handleRouting = (function(){
    let previousHash;
    return function(){
        const hash = window.location.hash.split('#/')[1] || '';
        if(previousHash === hash)
            return;
        if(routes.hasOwnProperty(hash)){
            previousHash = hash;
            requestTemplate(routes[hash].html).then( html => {
                render(html);
                if(routes[hash].hasOwnProperty('src')){
                    runScript(routes[hash].src);
                }
            });
        }
    }
})();

window.addEventListener('DOMContentLoaded', handleRouting);
window.addEventListener('hashchange', handleRouting);