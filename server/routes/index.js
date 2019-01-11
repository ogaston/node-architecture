'use strict';

const apiRoute = require('./apis');

function init(server) {
    server.get('*', function (req, res, next) {
        console.log(`Resquest was made to ${req.originalUrl} - GET`);
        return next();
    });
    
    server.use('/api', apiRoute);
}


module.exports = { init };
