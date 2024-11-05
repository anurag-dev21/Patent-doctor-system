const express = require('express');
const routes = express.Router();
const auth = require('../middlewares/authMiddlewere');
const authControl = require('../controllers/authcontroller');
const appControl = require('../controllers/appoinController');
const presControl = require('../controllers/presController');
const passport = require('passport');

const { registerValidator, loginValidator } = require('../helpers/validator');

routes.post('/register', registerValidator, authControl.registerUser);
routes.post('/login', loginValidator, authControl.loginUser);

// profile
routes.get('/profile', auth, authControl.getProfile);
routes.put('/updateProfile', auth, authControl.UpdateProfile);


// forget password
routes.get('/CheckEmail', authControl.CheckEmail);
routes.post('/emailCheck', authControl.emailCheck);
routes.get('/otpCheck', authControl.otpCheck);
routes.post('/otpEmail', authControl.otpEmail);
routes.post('/NewPass', authControl.NewPass);


// appoinment routes
routes.get('/getAppointments', auth, appControl.getAppointments);
routes.post('/addAppointments', auth, appControl.addAppointments);
routes.delete('/delAppointments', auth, appControl.delAppointments);
routes.put('/uptAppointments', auth, appControl.uptAppointments);

// prescription routes
routes.get('/getPrescription', auth, presControl.getPrescription);
routes.post('/addPrescription', auth, presControl.addPrescription);
routes.delete('/delPrescription', auth, presControl.delPrescription);

module.exports = routes;