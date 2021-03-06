'use strict';

const express = require('express');
const httpResponse = require('../response');
const course = express.Router();

module.exports = function (db) {

    course.get('/', function (req, res) {

        db.query("CALL GetAllCourses()", function (err, result) {
            if (err) throw err;
            return res.status(200).json(result[0])
        });

    });

    course.get('/:id', function (req, res) {

        db.query(`CALL GetCourse('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(httpResponse.validateResult(result))
        });

    });

    course.post('/', function (req, res) {

        const {
            name,
            no,
            academic_level
        } = req.body;

        const sql = `CALL CreateCourse('${name}', '${no}', '${academic_level}');`;

        db.query(sql, function (err, result) {
            if (err) throw err;

            return res.status(201).json(result[0][0]);
        });

    });

    course.put('/:id', function (req, res) {

        let actualCourse = {};

        db.query(`CALL GetCourse('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            actualCourse = result[0][0];

            if (typeof actualCourse === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            Object.getOwnPropertyNames(req.body).forEach(val => {
                if (actualCourse.hasOwnProperty(val)) {

                    actualCourse[val] = req.body[val]
                }
            });

            const id = +req.params['id'];

            const {
                name,
                no,
                academic_level,
                status
            } = actualCourse;

            db.query(
                `CALL UpdateCourse(
                        '${id}', 
                        '${name}', 
                        '${no}', 
                        '${academic_level}', 
                        '${status}'
                    )`,
                function (err, result) {
                    if (err) throw err;
                    return res.status(201).json(result[0])
                });

        });

    });

    course.delete('/:id', function (req, res) {

        db.query(`CALL DeleteCourse('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            if (typeof result[0][0] === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            return res.status(202).json(result[0][0])
        });

    });

    return course
}
