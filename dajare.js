const request = require('request-promise-native');

fetch = async function(text) {
    const options = {
        json: true,
        body: {
            text: text
        }
    }
    try {
        const response = await request.post(process.env.DAJARE_API_ENDPOINT, options);

        return response['puns'];
    } catch(err) {
        throw err;
    }
};

module.exports = fetch;