const request = require("request-promise-native");

fetch = async function(text) {
  const options = {
    uri: process.env.DAJARE_API_ENDPOINT,
    json: true,
    body: { text }
  };

  const response = await request.post(options);

  return response["puns"];
};

module.exports = fetch;
