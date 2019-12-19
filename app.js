import fs from 'fs';
import utf from 'utf-8';
import Snoowrap from 'snoowrap';
import snoostorm from 'snoostorm';
import dotenv from 'dotenv';

// Awaiting top level await 😭
let ignoredUsers;
fs.promises
    .readFile('.userignore', { encoding: 'utf8' })
    .then((contents) => {
        ignoredUsers = contents.split('\n');
    });

const credentials = dotenv.config().parsed;
const client = new Snoowrap(credentials);

const { CommentStream } = snoostorm;
const comments = new CommentStream(client, {
    subreddit: 'all',
    limit: 100,
    pollTime: 2000
});

const botNotice = '\n\n^(I am a bot. I\'m sorry if I ruined your surprise.)';

comments.on('item', (comment) => {
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
