'use strict';

import test from 'ava';
import app from '../app.js';

test('Decodes delimited strings', t => {
    t.is(app.decode('01110000 01100001 01110011 01110011'), 'pass');
});

test('Decodes non-delimited strings', t => {
    t.is(app.decode('01110000011000010111001101110011'), 'pass');
});

test('Works with whitespace padding', t => {
    t.is(app.decode('\t01110000 01100001 01110011 01110011 \n'), 'pass');
});

test('Fails on incomplete bytes (delimited)', t => {
    t.is(app.decode('01110000 01100001 01110011 0111001'), '');
    t.is(app.decode('01110000 0100001 01110011 01110011'), '');
});

test('Fails on incomplete bytes (non-delimited)', t => {
    t.is(app.decode('011100000110000101110011011100101'), '');
});

test('Fails on non-binary', t => {
    t.is(app.decode('clearly not binary'), '');
});

test('Fails on empty string', t => {
    t.is(app.decode(''), '');
});

test('Throws `TypeError` on non-string parameters', t => {
    t.throws(() => app.decode(null), TypeError);
    t.throws(() => app.decode(undefined), TypeError);
    t.throws(() => app.decode(NaN), TypeError);
    t.throws(() => app.decode(true), TypeError);
    t.throws(() => app.decode(false), TypeError);
    t.throws(() => app.decode(10101010), TypeError);
    t.throws(() => app.decode([]), TypeError);
    t.throws(() => app.decode({}), TypeError);
});
