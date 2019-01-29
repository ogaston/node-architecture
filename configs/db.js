mysql = require('mysql');

const mongodb = {
    'secret': 'putsomethingsecretehere',
    'database': 'mongodb://127.0.0.1:27017/formediumblog'
};

const credentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
}

const con = mysql.createConnection(credentials);


/* Mock 
const con = {
    connect: function (cb) {
        cb(false)
    },
    query: function (str, cb) {
        cb(false, [])
    }
}
*/

module.exports = { mongodb, mysql, con }
