'use strict';

const utf = require('utf-8');
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const credentials = require('dotenv').config().parsed;

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

const devUserName = 'ShreyasMinocha';
const botNotice = `\n\n^I ^am ^a ^bot. ^If ^I'm ^doing ^something ^silly, ^please ^PM [^the ^guy ^who ^programmed ^me ](https://reddit.com/user/${devUserName})`;

comments.on('comment', (comment) => {
    const body = comment.body.trim();
    let translated = decode(body);

    if (translated !== '') {
        comment.reply(`That translates to: "${translated}". ${botNotice}`);
    }
});


function decode(string) {
    const delimitedBinary = /^(?:[01]{8} ){3,}$/gm;
    const nonDelimitedBinary = /^(?:[01]{8}){3,}$/gm;
    const byteRegex = /[01]{8}/gm;

    string = string.trim();
    let bytes;

    if (delimitedBinary.test(string + ' ')) {
        bytes = (string + ' ').match(byteRegex);
    } else if(nonDelimitedBinary.test(string)) {
        bytes = string.match(byteRegex);
    }

    if (bytes) {
        return decodeBytes(bytes);
    }

    return '';
}

function decodeBytes(bytes) {
    return utf.getStringFromBytes(bytes.map(byte => parseInt(byte, 2)));
}

module.exports = {
    credentials,
    client,
    comments,
    decode
};
