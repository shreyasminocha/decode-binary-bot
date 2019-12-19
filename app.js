import fs from 'fs';
import dotenv from 'dotenv';
import Snoowrap from 'snoowrap';
import snoostorm from 'snoostorm';
import decode from './util/decode.mjs';

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
