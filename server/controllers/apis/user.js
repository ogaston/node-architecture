'use strict';

const express = require('express');
const cryp = require('../../services/encryptor');
const httpResponse = require('../response');
const user = express.Router();

module.exports = function (db) {

        user.get('/', function (req, res) {
    
            db.query("CALL GetAllUsers()", function (err, result) {
                if (err) throw err;
                return res.status(200).json(result[0])
            });
    
        });
    
        user.get('/:id', function (req, res) {
    
            db.query(`CALL GetUser('${+req.params['id']}')`, function (err, result) {
                if (err) throw err;
                return res.status(200).json(httpResponse.validateResult(result))
            });
    
        });
    
        user.post('/', function (req, res) {
    
            const {
                username,
                email,
                id_role
            } = req.body;
    
            const password = cryp.encrypt(req.body.password)
    
            const sql = `CALL CreateUser('${username}', '${password}', '${email}', '${id_role}');`;
    
            db.query(sql, function (err, result) {
                if (err) throw err;
                
                return res.status(201).json(result[0][0]);
            });
    
        });
    
        user.put('/:id', function (req, res) {
    
            let actualUser = {};
    
            db.query(`CALL GetUser('${+req.params['id']}')`, function (err, result) {
                if (err) throw err;
    
                actualUser = result[0][0];
    
                if (typeof actualUser === 'undefined') {
                    return res.status(404).json(httpResponse.onUserNotFound)
                }
    
                Object.getOwnPropertyNames(req.body).forEach(val => {
                    if (actualUser.hasOwnProperty(val)) {
                
                        if (val === 'password') {
                            req.body[val] = cryp.encrypt(req.body[val])
                        }
    
                        actualUser[val] = req.body[val]
                    }
                });
    
                const {
                    id_user,
                    username,
                    email,
                    id_role,
                    status
                } = actualUser;
    
                db.query(
                    `CALL UpdateUser(
                        '${id_user}', 
                        '${username}', 
                        '${password}', 
                        '${email}', 
                        '${id_role}', 
                        '${status}'
                    )`, function (err, result) {
                    if (err) throw err;
                    return res.status(201).json(result[0])
                });
        
            });
            
        });
    
        user.delete('/:id', function (req, res) {
    
            db.query(`CALL DeleteUser('${+req.params['id']}')`, function (err, result) {
                if (err) throw err;
    
                if (typeof result[0][0] === 'undefined') {
                    return res.status(404).json(httpResponse.onUserNotFound)
                }
    
                return res.status(202).json(result[0][0])
            });
    
        });

    return user
}


