'use strict';

const dotenv = require('dotenv').config();
const _ = require('lodash');
const env = process.env.NODE_ENV || 'local';
const envConfig = require('./' + env);

let defaultConfig = {
    env
};

module.exports = function () {

    process.on('uncaughtException', (err) => {
        //fs.writeSync(1, `Caught exception: ${err}\n`);
        console.error(err.name + ":" + err.message);
        console.error(err.stack);
    });

    if (dotenv.error) {
        throw dotenv.error
    }

    return _.merge(defaultConfig, envConfig);
}

