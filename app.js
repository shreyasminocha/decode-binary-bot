require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const env = process.env;

const client = new Snoostorm(new Snoowrap({
    userAgent: env.REDDIT_USER,
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    username: env.REDDIT_USER,
    password: env.REDDIT_PASS
}));

const comments = client.CommentStream({
    subreddit: 'all',
    results: 100,
    pollTime: 5000
});

const devUserName = 'ShreyasMinocha';
const botNotice = `\n\n^I ^am ^a ^bot. ^If ^I'm ^doing ^something ^silly, ^please ^PM [^the ^guy ^who ^programmed ^me ](https://reddit.com/user/${devUserName})`;

const isBinaryAscii = /(?:[01]{8} )+/;

comments.on('comment', (comment) => {
    const body = comment.body.trim() + ' ';

    if (isBinaryAscii.test(body)) {
        const bytes = body.match(/[01]{8}/gm);
        const translated = bytes.reduce((accumulator, byte) => accumulator + String.fromCharCode(parseInt(byte, 2)),  '');

        comment.reply(`That translates to: '${translated}'. ${botNotice}`);
    }
});
