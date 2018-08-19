const restify = require('restify');
const builder = require('botbuilder');
const _ = require('underscore');
const dajare = require('./dajare');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

const inMemoryStorage = new builder.MemoryBotStorage();

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    async function (session) {
        const puns = await dajare(session.message.text);
        const pun = _.sample(puns);

        session.send(pun);
        return session.endDialog();
    }
]).set('storage', inMemoryStorage);