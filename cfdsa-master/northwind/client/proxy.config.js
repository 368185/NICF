module.exports = [
    {
        context: [ '/api/**'],
        target: 'http://localhost:3000',
        logLevel: 'debug',
        secure: false
    }
];