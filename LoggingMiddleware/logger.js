const axios = require('axios');

async function Log(stack, level, pkg, ...messages) {
    try {
        await axios.post('http://20.244.56.144/evaluation-service/logs', {
            stack,
            level,
            package: pkg,
            message: messages.join(',')
        });
    } catch (err) {
        console.error('Failed to log:', err.message);
    }
}

module.exports = Log;