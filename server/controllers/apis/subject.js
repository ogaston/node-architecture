'use strict';

const express = require('express');
const httpResponse = require('../response');
const subject = express.Router();

module.exports = function (db) {

    subject.get('/', function (req, res) {

        db.query("CALL GetAllSubjects()", function (err, result) {
            if (err) throw err;
            return res.status(200).json(result[0])
        });

    });

    subject.get('/:id', function (req, res) {

        db.query(`CALL GetSubject('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(httpResponse.validateResult(result))
        });

    });

    subject.post('/', function (req, res) {

        const {
            name,
        } = req.body;

        const sql = `CALL CreateSubject('${name}');`;

        db.query(sql, function (err, result) {
            if (err) throw err;

            return res.status(201).json(result[0][0]);
        });

    });

    subject.put('/:id', function (req, res) {

        let actualSubject = {};

        db.query(`CALL GetSubject('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            actualSubject = result[0][0];

            if (typeof actualSubject === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            Object.getOwnPropertyNames(req.body).forEach(val => {
                if (actualSubject.hasOwnProperty(val)) {

                    actualSubject[val] = req.body[val]
                }
            });

            const id = +req.params['id'];

            const {
                name,
                status
            } = actualSubject;

            db.query(
                `CALL UpdateSubject(
                        '${id}',
                        '${name}',
                        '${status}'
                    )`,
                function (err, result) {
                    if (err) throw err;
                    return res.status(201).json(result[0])
                });

        });

    });

    subject.delete('/:id', function (req, res) {

        db.query(`CALL DeleteSubject('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            if (typeof result[0][0] === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            return res.status(202).json(result[0][0])
        });

    });

    return subject
}
