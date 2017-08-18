import 'whatwg-fetch'

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
};

const notLoggedIn = () => Promise.reject(new Error('You are not logged in. Connect via Twitter, and make your voice heard!'));

const parseJSON = response => response.json();

export default class Api {
    constructor() {
        this.authToken = '';
    }

    /**
     *
     * @param data
     * @returns {Promise}
     */
    createCallToAction(data) {
        if (!this.authToken.length)
            return notLoggedIn();

        return fetch('/api/cta', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.authToken}`,
                'Content-Type': 'application/json',
                'X-HTTP-Method-Override': 'POST'
            },
        })
            .then(checkStatus)
            .then(parseJSON);
    }

    /**
     *
     * @param dispatch {Function}
     * @returns {Promise.<*>}
     */
    fetchSecureData(dispatch) {
        return Promise.all([
        ]);
    }

    /**
     * @returns {Promise}
     */
    fetchCta() {
        return fetch('/api/cta', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.authToken}`
            }
        })
            .then(checkStatus)
            .then(parseJSON)
    }

    fetchCtaById(id, websocket) {
        console.info(`Fetching CTA #${id}`);
        websocket.send({
            id,
            eventName: 'api/cta::read'
        });
    }

    /**
     *
     * @param jwt {string}
     * @param websocket {WebSocket}
     * @returns {Promise}
     */
    revive(jwt, websocket) {
        return fetch('/auth/token', {
            body: JSON.stringify({}),
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            .then(parseJSON)
            .then(response => {
                window.localStorage.setItem('token', this.authToken = jwt);
                console.info(response.data);

                if (websocket) {
                    websocket.send(JSON.stringify({
                        eventName: 'authenticate',
                        params: {
                            query: jwt
                        }
                    }));
                }

                return response.data;
            });
    }
}