const { WebClient } = require('@slack/web-api');

const options = {};
const web = new WebClient(process.env.SLACK_TOKEN, options);

const sendSlackMessage = async (message = null, blocks = null, channelId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await web.chat.postMessage({
                text: message,
                blocks,
                channel: channelId,
            });
            return resolve(true);
        } catch (error) {
            console.log(error)
            const errorMessage = error?.data?.error;
            if (errorMessage == 'not_in_channel') {
                console.log('not in channel')
                await joinSlackChannel(channelId, message, blocks);
                return resolve(true);
            }
            return reject(error);
        }
    });
};

const joinSlackChannel = (channel, message = null, blocks = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await web.conversations.join({
                channel: channel,
            });
            if (message) {
                await sendSlackMessage(message, blocks, channel);
            }
            return resolve(true);
        } catch (error) {
            return reject(error);
        }
    });
};

module.exports = {
    sendSlackMessage
};