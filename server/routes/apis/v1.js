'use strict';

const express = require('express');
const db = require('../../../configs/db').con;

const registerController = require('../../controllers/apis/register');
const loginController = require('../../controllers/apis/login');
const dashboardController = require('../../controllers/apis/dashboard');

const userController = require('../../controllers/apis/user');
const personalController = require('../../controllers/apis/personal');

const courseController = require('../../controllers/apis/course');
const gradeController = require('../../controllers/apis/grade');
const subjectController = require('../../controllers/apis/subject');

const roleController = require('../../controllers/apis/role')
const permissionController = require('../../controllers/apis/permission')
const periodeController = require('../../controllers/apis/periode')


let router = express.Router();

db.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

router.use('/register', registerController);
router.use('/login', loginController);
router.use('/dashboard', dashboardController);

router.use('/user', userController(db));
router.use('/student', personalController(db, process.env.STUDENT_ROLE));
router.use('/teacher', personalController(db, process.env.TEACHER_ROLE));

router.use('/course', courseController(db));
router.use('/grade', gradeController(db));
router.use('/subject', subjectController(db));

router.use('/role', roleController(db));
router.use('/permission', permissionController(db));
router.use('/periode', periodeController(db));





module.exports = router;