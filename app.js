'use strict';

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

const delimitedBinary = /^(?:[01]{8} )+$/g;
const nonDelimitedBinary = /^(?:[01]{8})+$/g;
const byteRegex = /[01]{8}/gm;

function decode(string) {
    string = string.trim();
    let bytes = '';

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
    return bytes.reduce((accumulator, byte) => {
        return accumulator + String.fromCharCode(parseInt(byte, 2));
    },  '');
}

module.exports = {
    credentials,
    client,
    comments,
    decode
};
