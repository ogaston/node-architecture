'use strict';

const express = require('express');
const httpResponse = require('../response');
const grade = express.Router();

module.exports = function (db) {

    grade.get('/', function (req, res) {

        db.query("CALL GetAllGrades()", function (err, result) {
            if (err) throw err;
            return res.status(200).json(result[0])
        });

    });

    grade.get('/:id', function (req, res) {

        db.query(`CALL GetGrade('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(httpResponse.validateResult(result))
        });

    });

    grade.post('/', function (req, res) {

        const {
            description,
            shortname,
        } = req.body;

        const sql = `CALL CreateGrade('${description}', '${shortname}');`;

        db.query(sql, function (err, result) {
            if (err) throw err;

            return res.status(201).json(result[0][0]);
        });

    });

    grade.put('/:id', function (req, res) {

        let actualGrade = {};

        db.query(`CALL GetGrade('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            actualGrade = result[0][0];

            if (typeof actualGrade === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            Object.getOwnPropertyNames(req.body).forEach(val => {
                if (actualGrade.hasOwnProperty(val)) {

                    actualGrade[val] = req.body[val]
                }
            });

            const id = +req.params['id'];

            const {
                description,
                shortname,
                status
            } = actualGrade;

            db.query(
                `CALL UpdateGrade(
                        '${id}', 
                        '${description}', 
                        '${shortname}',
                        '${status}'
                    )`,
                function (err, result) {
                    if (err) throw err;
                    return res.status(201).json(result[0])
                });

        });

    });

    grade.delete('/:id', function (req, res) {

        db.query(`CALL DeleteGrade('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            if (typeof result[0][0] === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            return res.status(202).json(result[0][0])
        });

    });

    return grade
}
