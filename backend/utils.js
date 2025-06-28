const crypto = require('crypto');

function generateShortcode(length = 6) {
    return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

function isValidShortcode(code) {
    return /^[a-zA-Z0-9_-]{4,}$/.test(code);
}

module.exports = { generateShortcode, isValidShortcode };