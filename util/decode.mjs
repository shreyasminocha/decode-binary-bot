import decodeBytes from './decode-bytes.mjs';

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

export default decode;
