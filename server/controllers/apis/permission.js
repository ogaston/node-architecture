'use strict';

const express = require('express');
const httpResponse = require('../response');
const permission = express.Router();

module.exports = function (db) {

    permission.get('/', function (req, res) {

        db.query("CALL GetAllPermissions()", function (err, result) {
            if (err) throw err;
            return res.status(200).json(result[0])
        });

    });

    
    permission.get('/:id', function (req, res) {

        db.query(`CALL GetRolePermissions('${+req.params['id']}')`, function (err, result) {
            if (err) throw err;
            return res.status(200).json(
                    httpResponse.validateResult(
                        result, 
                        httpResponse.onRolePermissionNotFound
                    )
                )
        });

    });


    permission.post('/', function (req, res) {

        const {
            id_role,
            permission
        } = req.body;

        const sql = `CALL InsertRolePermission('${id_role}', '${permission}');`;

        db.query(sql, function (err, result) {
            if (err) throw err;

            return res.status(201).json(result[0][0]);
        });

    });

    /** No implemented */
    permission.put('/:id', function (req, res) {
        return res.status(404).json(httpResponse.onUserNotFound)


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

    permission.delete('/:id', function (req, res) {

        const id = +req.params['id'];

        db.query(`CALL UnsetPermissionById('${id}')`, function (err, result) {
            if (err) throw err;

            return res.status(200).json(httpResponse.onPermissionUnset)
        });

    });

    return permission
}
