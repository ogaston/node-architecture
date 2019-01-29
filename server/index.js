'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandle = require('./services/error');
//const mongoose = require('mongoose');
const mysql = require('mysql');
const passport = require('passport');
const cookieParser = require('cookie-parser');


module.exports = function () {
    const server = express();
    let start, create, db;

    create = function(config, database) {
        let routes = require('./routes');

        // Server settings
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        // Returns middleware that parses json
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(cookieParser());
        server.use(logger('dev'));
        server.use(passport.initialize());

        //require('../configs/passport')(passport);

        // Routes settings
        routes.init(server);

        // Middleware to error handle
        server.use(errorHandle())
    }

    start = function () {
        let hostname = server.get('hostname'),
            port = server.get('port');

        server.listen(port, function () {
            console.log(`Express server is listening on - http://${hostname}:${port}`);    
        });
    }

    return {
        create,
        start
    }
}
