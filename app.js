var restify = require('restify');
var builder = require('botbuilder');

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

const inMemoryStroage = builder.MemoryBotStorage();

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send('This is the bot for you.')
        session.beginDialog('greetings', session.userData.profile);
    },
    function (session, results) {
        if (results.response) {
            let profile = results.response;
            session.userData.profile = profile;

            session.send(`Hi, ${profile.name}!`);
            return session.endDialog(`Thank you.`);
        } else {
            return session.endDialog(`Bye.`);
        }
    }
]).set('storage', inMemoryStroage);

bot.dialog('greetings', [
    function(session, args, next) {
        let profile = args || {};
        session.dialogData.profile = profile;

        if (!profile.name) {
            session.send('Nice to meet you!')
            builder.Prompts.text(session, 'What is your name?');
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }

        session.endDialogWithResult({response: { name: session.dialogData.profile.name }});
    }
]);
