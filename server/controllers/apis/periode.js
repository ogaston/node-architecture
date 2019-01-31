'use strict';

const express = require('express');
const httpResponse = require('../response');
const periode = express.Router();

module.exports = function (db) {

    periode.get('/', function (req, res) {

        db.query("CALL GetAllPeriodes()", function (err, result) {
            if (err) throw err;
            return res.status(200).json(result[0])
        });

    });

    periode.get('/:id', function (req, res) {

        db.query(`CALL GetPeriode('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(httpResponse.validateResult(result))
        });

    });

    periode.post('/', function (req, res) {

        const {
            start,
            end,
        } = req.body;

        if (!validateDate(start) || !validateDate(end)){
            return res.status(400).json(httpResponse.onDateWrong)
        }

        const sql = `CALL CreatePeriode('${start}', '${end}');`;

        db.query(sql, function (err, result) {
            if (err) throw err;

            return res.status(201).json(result[0][0]);
        });

    });

    periode.put('/:id', function (req, res) {

        let actualPeriode = {};

        db.query(`CALL GetPeriode('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            actualPeriode = result[0][0];

            if (typeof actualPeriode === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            Object.getOwnPropertyNames(req.body).forEach(val => {
                if (actualPeriode.hasOwnProperty(val)) {

                    actualPeriode[val] = req.body[val]
                }
            });

            const id = +req.params['id'];
            
            const {
                start,
                end,
            } = actualPeriode;
            
            if (!validateDate(start) || !validateDate(end)) {
                return res.status(400).json(httpResponse.onDateWrong)
            }

            db.query(
                `CALL UpdatePeriode(
                        '${id}',
                        '${start}', 
                        '${end}'
                    )`,
                function (err, result) {
                    if (err) throw err;
                    return res.status(201).json(result[0])
                });

        });

    });

    /**No implement */
    periode.delete('/:id', function (req, res) {

        db.query(`CALL DeletePeriode('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            if (typeof result[0][0] === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            return res.status(202).json(result[0][0])
        });

    });

    return periode
}


function validateDate(date) {
    return !(date.getDate() === NaN)
}