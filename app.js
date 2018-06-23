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
    pollTime: 2000
});

const devUserName = 'ShreyasMinocha';
const botNotice = `\n\n^I ^am ^a ^bot. ^If ^I'm ^doing ^something ^silly, ^please ^PM [^the ^guy ^who ^programmed ^me ](https://reddit.com/user/${devUserName})`;

comments.on('comment', (comment) => {
    const body = comment.body.trim();
    let translated = decode(comment.body);

    if (decode(translated) !== '') {
        comment.reply(`That translates to: "${translated}". ${botNotice}`);
    }
});

const isDecodable = /^(?:[01]{8} )+$/g;
const isDecodableNoSpaces = /^[01]+$/g;
const byteRegex = /[01]{8}/gm;

function decode(string) {
    string = string.trim();
    let bytes = '';

    if (isDecodable.test(string + ' ')) {
        bytes = (string + ' ').match(byteRegex);
    } else if(isDecodableNoSpaces.test(string) && string.length % 8 == 0) {
        bytes = string.match(byteRegex);
    }

    if (bytes) {
        return decodeBytes(bytes);
    }

    return '';
}

function decodeBytes(bytes) {
    return bytes.reduce((accumulator, byte) => accumulator + String.fromCharCode(parseInt(byte, 2)),  '');
}


module.exports = {decode};
