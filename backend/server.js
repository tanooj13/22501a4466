const express = require('express');
const dotenv = require('dotenv').config();
const Log = require('../LoggingMiddleware/logger');


const app = express();
const port = process.env.PORT || 5000;
const HOST = `http://localhost:${port}`;

app.use(express.json());



// Middleware for error handle
app.use((err, req, res, next) => {
    Log("backend", "error", "handler", err.message);
    res.status(500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});