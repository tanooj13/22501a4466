const express = require('express');
const dotenv = require('dotenv').config();
const Log = require('../LoggingMiddleware/logger');
const { saveUrl, getUrl, incrementHits } = require('./urlStore');
const { generateShortcode, isValidShortcode } = require('./utils');

const app = express();
const port = process.env.PORT || 5000;
const HOST = `http://localhost:${port}`;

app.use(express.json());

// For Creating a Short URL
app.post('/shorturls', async (req, res) => {
    try {
        const { url, validity, shortcode } = req.body;
        if (!url) {
            Log("backend", "error", "handler", "Missing URL in request");
            return res.status(400).json({ error: "Missing URL in request" });
        }

        let code = shortcode;
        if (code) {
            if (!isValidShortcode(code)) {
                Log("backend", "error", "handler", "Invalid shortcode format");
                return res.status(400).json({ error: "Invalid shortcode format" });
            }
            if (getUrl(code)) {
                Log("backend", "error", "handler", "Shortcode already exists");
                return res.status(409).json({ error: "Shortcode already exists" });
            }
        } else {
            // generating unique shortcode
            do {
                code = generateShortcode();
            } while (getUrl(code));
        }

        const validMins = typeof validity === 'number' && validity > 0 ? validity : 30;
        const expiry = new Date(Date.now() + validMins * 60000);

        saveUrl(code, url, expiry);

        Log("backend", "info", "handler", `Short URL created: ${code}`);

        res.status(201).json({
            shortLink: `${HOST}/${code}`,
            expiry: expiry.toISOString()
        });
    } catch (err) {
        Log("backend", "error", "handler", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
// redirects to original URL
app.get('/:shortcode', (req, res) => {
    try {
        const { shortcode } = req.params;
        const record = getUrl(shortcode);
        if (!record) {
            Log("backend", "error", "handler", "Shortcode not found");
            return res.status(404).json({ error: "Shortcode not found" });
        }
        if (new Date() > new Date(record.expiry)) {
            Log("backend", "error", "handler", "Shortcode expired");
            return res.status(410).json({ error: "Shortcode expired" });
        }
        incrementHits(shortcode);
        Log("backend", "info", "handler", `Redirected: ${shortcode}`);
        res.redirect(record.url);
    } catch (err) {
        Log("backend", "error", "handler", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Middleware for error handle
app.use((err, req, res, next) => {
    Log("backend", "error", "handler", err.message);
    res.status(500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});