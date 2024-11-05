const { check } = require('express-validator');

exports.registerValidator = [
    check('first_name', 'first Name is required').not().isEmpty(),
    check('last_name', 'Last Name is required').not().isEmpty(),
    check('email', 'Please Provide Valid Email').isEmail().normalizeEmail({
        gmail_remove_dots:true,
    }),
    check('password', 'Password is required').not().isEmpty(),
    check('confirm_password', 'confirm_password is required').not().isEmpty(),
]

exports.loginValidator = [
    check('email', 'Please Provide Valid Email').isEmail().normalizeEmail({
        gmail_remove_dots:true,
    }),
    check('password', 'Password is required').not().isEmpty(),
]


// User Validation -------------------------------------------------------------
exports.UserValidator = [
    check('first_name', 'first Name is required').not().isEmpty(),
    check('last_name', 'Last Name is required').not().isEmpty(),
    check('email', 'Please Provide Valid Email').isEmail().normalizeEmail({
        gmail_remove_dots:true,
    })
]