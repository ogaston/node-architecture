'use strict';

const express = require('express');
const personal = express.Router();
const httpResponse = require('../response');


module.exports = function (db, role) {

    personal.get('/', function (req, res) {

        db.query(`CALL GetAllPersonal(${role})`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(result[0])
        });

    });

    personal.get('/:id', function (req, res) {

        db.query(`CALL 	GetPersonalData('${+req.params['id']}', ${role})`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(httpResponse.validateResult(result))
        });

    });

    personal.post('/:id', function (req, res) {
        const {
            firstname,
            secondname,
            surname,
            lastname,
            ide,
            tutor,
            contract_date,
            birthday,
            phone,
            telephone,
            municipality,
            address,
            neighbor,
        } = req.body;

        const id = +req.params['id'];

        db.query(`CALL AssingPersonalData(
                    '${id}',
                    '${firstname}',
                    '${secondname}',
                    '${surname}',
                    '${lastname}',
                    '${ide}',
                    '${tutor}',
                    '${contract_date}',
                    '${birthday}',
                    '${phone}',
                    '${telephone}',
                    '${municipality}',
                    '${address}',
                    '${neighbor}'
                );`, function (err, result) {
            
            if (err) throw err;
            return res.status(201).json(result[0][0]);

            
        });
    });

    personal.put('/:id', function (req, res) {

    let actualUser = {};

    db.query(`CALL GetPersonalData('${+req.params['id']}', ${role})`, function (err, result) {
        if (err) throw err;

        actualUser = result[0][0];

        if (typeof actualUser === 'undefined') {
            return res.status(404).json(httpResponse.onUserNotFound)
        }

        Object.getOwnPropertyNames(req.body).forEach(val => {
            if (actualUser.hasOwnProperty(val)) {

                actualUser[val] = req.body[val]
            }
        });
        const {
            firstname,
            secondname,
            surname,
            lastname,
            ide,
            tutor,
            contract_date,
            birthday,
            phone,
            telephone,
            municipality,
            address,
            neighbor,
        } = actualUser;

        const id = +req.params['id'];

        db.query(`CALL UpdatePersonalData(
                    '${id}',
                    '${firstname}',
                    '${secondname}',
                    '${surname}',
                    '${lastname}',
                    '${ide}',
                    '${tutor}',
                    '${contract_date}',
                    '${birthday}',
                    '${phone}',
                    '${telephone}',
                    '${municipality}',
                    '${address}',
                    '${neighbor}'
                )`, function (err, result) {
                    if (err) throw err;
                    return res.status(201).json(result[0])
                });

        });

    });

    personal.delete('/:id', function (req, res) {

        db.query(`CALL DeleteUser('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            if (typeof result[0][0] === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            return res.status(202).json(result[0][0])
        });

    });

    return personal
}
