const http = (function () {

    const baseURL = 'https://jsonplaceholder.typicode.com';

    function fetchUsers(url = `${baseURL}/users`) {
        return fetchData({ url });
    }

    function fetchPosts(url = `${baseURL}/posts`) {
        return fetchData({ url });
    }

    function fetchGender(name, url = 'https://api.genderize.io') {
        const [ firstName ] = name.split(' ');
        url = `${url}?name=${firstName}`;

        return fetchData({ url });
    }

    function fetchData(options) {
        const {
            url,
            method = 'GET',
            headers = {
                'Content-Type': 'aplication/json'
            },
            body = null
        } = options;

        const fetchOptions = {
            method,
            headers
        };

        if (method !== 'GET' || method !== 'HEAD' && body) {
            fetchOptions.body = body;
        }

        return fetch(url, fetchOptions);
    }

    return {
        fetchUsers,
        fetchPosts,
        fetchGender
    }

})();

export default http;