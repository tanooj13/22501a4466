const urlDatabase = {};

function saveUrl(shortcode, url, expiry) {
    urlDatabase[shortcode] = {
        url,
        expiry,
        createdAt: new Date(),
        hits: 0
    };
}

function getUrl(shortcode) {
    return urlDatabase[shortcode];
}

function incrementHits(shortcode) {
    if (urlDatabase[shortcode]) {
        urlDatabase[shortcode].hits += 1;
    }
}

module.exports = { saveUrl, getUrl, incrementHits };