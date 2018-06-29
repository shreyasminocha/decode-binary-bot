'use strict';

import test from 'ava';
import app from '../app.js';

test('Loads credentials', t => {
    const credentials = app.credentials;
    const properties = [
        'CLIENT_ID',
        'CLIENT_SECRET',
        'REDDIT_USER',
        'REDDIT_PASS'
    ];

    for (let propertyName of properties) {
        t.truthy(credentials[propertyName]);
        t.is(typeof credentials[propertyName], 'string');
        t.not(credentials[propertyName], '');
    }
});

test('Creates a Snoostrom client', t => {
    t.true(app.client instanceof require('snoostorm'));
});

test('Creates a valid comment stream', t => {
    t.true(app.comments instanceof require('events'));
    t.true('comment' in app.comments._events);
});

test('Decodes delimited strings', t => {
    t.is(app.decode('01110000 01100001 01110011 01110011'), 'pass');
});

test('Decodes non-delimited strings', t => {
    t.is(app.decode('01110000011000010111001101110011'), 'pass');
});

test('Decodes strings with whitespace padding', t => {
    t.is(app.decode('\t01110000 01100001 01110011 01110011 \n'), 'pass');
});

test('Decodes binary on separate line', t => {
    t.is(app.decode('text \n01110000 01100001 01110011 01110011'), 'pass');
});

test('Decodes UTF-8', t => {
    t.is(app.decode('00100100 11000010 10100010 11100010 10000010 10101100 11110000 10010000 10001101 10001000'), '$¢€𐍈');
});

test('Fails on incomplete bytes (delimited)', t => {
    t.is(app.decode('01110000 01100001 01110011 0111001'), '');
    t.is(app.decode('01110000 0100001 01110011 01110011'), '');
});

test('Fails on incomplete bytes (non-delimited)', t => {
    t.is(app.decode('011100000110000101110011011100101'), '');
});

test('Fails on text followed by binary', t => {
    t.is(app.decode('text text text 01110000 01100001 01110011'), '');
});

test('Fails on less than three bytes', t => {
    t.is(app.decode('01101000 01101001'), '');
    t.is(app.decode('01101001'), '');

    t.not(app.decode('01101000 01101001 01101001'), '');
});

test('Fails on non-binary', t => {
    t.is(app.decode('clearly not binary'), '');
});

test('Fails on empty string', t => {
    t.is(app.decode(''), '');
});

test('Throws `TypeError` on non-string parameters', t => {
    const nonStringTypes = [null, undefined, NaN, true, false, 10101010, [], {}];

    for (let type of nonStringTypes) {
        t.throws(() => app.decode(type), TypeError);
    }
});
