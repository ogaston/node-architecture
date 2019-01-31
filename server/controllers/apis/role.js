'use strict';

const express = require('express');
const httpResponse = require('../response');
const role = express.Router();

module.exports = function (db) {

    role.get('/', function (req, res) {

        db.query("CALL GetAllRoles()", function (err, result) {
            if (err) throw err;
            return res.status(200).json(result[0])
        });

    });

    role.get('/:id', function (req, res) {

        db.query(`CALL GetRole('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(httpResponse.validateResult(result))
        });

    });

    role.post('/', function (req, res) {

        const {
            name,
        } = req.body;

        const sql = `CALL CreateRole('${name}');`;

        db.query(sql, function (err, result) {
            if (err) throw err;

            return res.status(201).json(result[0][0]);
        });

    });

    role.put('/:id', function (req, res) {

        let actualRole = {};

        db.query(`CALL GetRole('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;

            actualRole = result[0][0];

            if (typeof actualRole === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            Object.getOwnPropertyNames(req.body).forEach(val => {
                if (actualRole.hasOwnProperty(val)) {

                    actualRole[val] = req.body[val]
                }
            });

            const id = +req.params['id'];

            const {
                name,
                status
            } = actualRole;

            db.query(
                `CALL UpdateRole(
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

    role.delete('/:id', function (req, res) {

        const id = +req.params['id'];

        db.query(`CALL DeleteRole('${id}')`, function (err, result) {
            if (err) throw err;

            if (id == process.env.STUDENT_ROLE || id == process.env.TEACHER_ROLE) {
                return res.status(403).json(httpResponse.onRoleNotDeleted)
            }

            if (typeof result[0][0] === 'undefined') {
                return res.status(404).json(httpResponse.onUserNotFound)
            }

            return res.status(202).json(result[0][0])
        });

    });

    return role
}
