'use strict';

const express = require('express');
const db = require('../../../configs/db').con;

const registerController = require('../../controllers/apis/register');
const loginController = require('../../controllers/apis/login');
const dashboardController = require('../../controllers/apis/dashboard');
const userController = require('../../controllers/apis/user');

const courseController = require('../../controllers/apis/course');
const studentController = require('../../controllers/apis/student');

let router = express.Router();

db.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

router.use('/register', registerController);
router.use('/login', loginController);
router.use('/dashboard', dashboardController);


router.use('/user', userController(db));
router.use('/course', courseController(db));
router.use('/student', studentController(db));




module.exports = router;