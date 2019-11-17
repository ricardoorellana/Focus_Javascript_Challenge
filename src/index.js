import http from './services/http';

let container;
let loader;

init();

function init() {
    container = document.querySelector('.container');
    loader = document.querySelector('.loader');

    const fetchUsers = http.fetchUsers();
    const fetchPosts = http.fetchPosts();

    Promise.all([fetchUsers, fetchPosts]).then((responses) => {
        const responsesToJson = responses.map(response => response.json());
        
        return Promise.all(responsesToJson);
    }).then((responses) => {

        let [users, posts] = responses;

        hideLoader();

        displayUserPosts(users, posts);

    }).catch(() => {
        loader.style.backgroundImage = "url('assets/error.gif')";
    });
}

const displayUserPosts = (users, posts) => {
    users.forEach(user => {

        fetchGender(user.name).then(response => {
            renderProfileImage(user.id, response);
        });

        const postsByUsers = filterPostsByUserId(user.id, posts);

        postsByUsers.forEach(post => {
            const card = renderCardProfile(user, post);

            container.appendChild(card);
        });
    });
}

const filterPostsByUserId = (id, posts) => posts.filter(({ userId }) => userId === id);

const createElement = (element, options) => {
    const {
        className,
        textContent,
        src,
        classList = []
    } = options;

    const elem = document.createElement(element);

    if (className) {
        elem.className = className;
    }

    if (textContent) {
        elem.textContent = textContent;
    }

    if (src) {
        elem.src = src;
    }

    if (classList.length) {
        classList.forEach(classList => {
            elem.classList.add(classList);
        });
    }
    
    return elem;
}


const renderCardProfile = (user, post) => {
    const {
        id,
        name
    } = user;

    const {
        body
    } = post;

    const cardContainer = createElement('div', { classList: ['card-container', 'stripey'] });
    const profile = createElement('div', { className: 'profile' });
    const profileImage = createElement('img', {
        src: '../assets/default-user.png', 
        classList: ['profile-image', 'item-' + id] 
    });
    const profileName = createElement('p', { textContent: name, className: 'profile-name' });

    profile.appendChild(profileImage);
    profile.appendChild(profileName);

    cardContainer.appendChild(profile);

    const paragraphs = body.split('\n');

    paragraphs.forEach((text, index) => {
        let className = index % 2 === 0 ? 'stripey-black' : 'stripey-red';

        cardContainer.appendChild(createElement('p', { textContent: text, className }));
    });

    return cardContainer;
}


const renderProfileImage = (id, { name, gender, url = 'http://joeschmoe.io/api/v1' }) => {
    if (gender) {
        url = `${url}/${gender}`
    }

    if (name) {
        url = `${url}/${name}`;
    }

    if (!gender && !name) {
        url = `${url}/random`;
    }

    const images = document.getElementsByClassName(`item-${id}`);

    for (let i = 0; i < images.length; i++) {
        images[i].src = url;
    }
}

const fetchGender = name => {
    return http.fetchGender(name).then(response => {
        return response.json()
    });
}

const hideLoader = () => {
    loader.remove();
}