import utf from 'utf-8';

function decodeBytes(bytes) {
    let decoded;

    try {
        decoded = utf.getStringFromBytes(bytes.map(byte => parseInt(byte, 2)));
    } catch (error) {
        decoded = '';
    }

    return decoded;
}

export default decodeBytes;
