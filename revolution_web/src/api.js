import fetch from 'whatwg-fetch'

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
};

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
        return new Promise((resolve, reject) => {
            if (!this.authToken.length)
                return reject(new Error('You are not logged in.'));

            return fetch('/api/cta', {
                body: JSON.stringify(data),
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(checkStatus)
                .then(parseJSON)
                .catch(reject);
        });
    }
}