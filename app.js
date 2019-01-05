const fs = require('fs');
const utf = require('utf-8');
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const credentials = require('dotenv').config().parsed;

let ignoredUsers;

fs.promises
    .readFile('.userignore', { encoding: 'utf8' })
    .then((contents) => {
        ignoredUsers = contents.split('\n');
    });

const client = new Snoostorm(new Snoowrap({
    userAgent: credentials.REDDIT_USER,
    clientId: credentials.CLIENT_ID,
    clientSecret: credentials.CLIENT_SECRET,
    username: credentials.REDDIT_USER,
    password: credentials.REDDIT_PASS
}));

const comments = client.CommentStream({
    subreddit: 'all',
    results: 100,
    pollTime: 2000
});

const botNotice = '\n\n^(I am a bot. I\'m sorry if I ruined your surprise.)';

comments.on('comment', (comment) => {
    const body = comment.body.trim();
    const translated = decode(body);
    const authorIsIgnored = ignoredUsers.includes(comment.author.name);

    if (translated !== '' && !authorIsIgnored) {
        comment.reply(`That translates to: "${translated}". ${botNotice}`);
    }
});


function decode(string) {
    const delimited = /^(?:[01]{8} ){3,}$/gm;
    const nonDelimited = /^(?:[01]{8}){3,}$/gm;
    const byteRegex = /[01]{8}/gm;

    string = string.trim();

    if (delimited.test(`${string} `) || nonDelimited.test(string)) {
        const bytes = string.replace(/ /g, '').match(byteRegex);
        return decodeBytes(bytes);
    }

    return '';
}

function decodeBytes(bytes) {
    let decoded;

    try {
        decoded = utf.getStringFromBytes(bytes.map(byte => parseInt(byte, 2)));
    } catch (error) {
        decoded = '';
    }

    return decoded;
}

module.exports = {
    credentials,
    client,
    comments,
    decode
};
