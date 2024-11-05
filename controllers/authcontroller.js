const User = require('../models/userModel');
const nodemailer = require("nodemailer");

const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors:errors.array()
            })
        }

        const { first_name, 
                last_name, 
                email, 
                number, 
                age, 
                height, 
                weight, 
                gender, 
                bloodg, 
                birth,
                country, 
                state, 
                city, 
                address,
                hospital, 
                password, 
                confirm_password } = req.body;

        const isExistUser = await User.findOne({ email });
        if(isExistUser){
            return res.status(200).json({
                success: false,
                msg: 'Email is already exist!'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const user = new User({
            first_name,
            last_name,
            email,
            number,
            age,
            height,
            weight,
            gender,
            bloodg,
            birth,
            country,
            state,
            city,
            address,
            hospital,
            password: hashedPassword,
            confirm_password,
        })

        const userData = await user.save();

        return res.status(200).json({
            success: true,
            msg: 'Register Successful!',
            data: userData
        })

    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const GenerateAccessToken = async(user) => {
    const Token = jwt.sign(user, 'secret_token', { expiresIn: "24h" });
    return Token;
}

const loginUser = async(req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors:errors.array()
            })
        }

        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if(!userData){
            return res.status(400).json({
                success: false,
                msg: 'Email and Password Is Incorrect'
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                msg: 'Email and Password Is Incorrect'
            })
        }

        const accessToken = await GenerateAccessToken({ user: userData })
        
        return res.status(200).json({
            success: true,
            msg: 'Login Successfully',
            accessToken: accessToken,
            tokenType:'Bearer',
            data: userData
        })

    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getProfile = async(req,res) => {
    try{
        const user_id = req.user._id;
        const userData = await User.findOne({ _id: user_id });
        return res.status(200).json({
            success: true,
            msg: 'Profile Data',
            data: userData
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

// Update for profile------------------------------------------------

const UpdateProfile = async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors:errors.array()
            })
        }

        const { id,
                first_name, 
                last_name, 
                email, 
                number, 
                age, 
                height, 
                weight, 
                gender, 
                bloodg, 
                birth,
                country, 
                state, 
                city, 
                address,
                hospital } = req.body;

        // console.log(req.body);

        const isExist = await User.findOne({ _id: id });
        if(!isExist){
            return res.status(400).json({
                success: false,
                msg: "profile id not found!"
            })
        }

        const isNameAssigned = await User.findOne({
            _id: {$ne: id},
            permision_name:{
                $regex: first_name,
                $options: 'i'
            } 
        });
        if(isNameAssigned){
            return res.status(400).json({
                success: false,
                msg: "Profile Name is already exits!"
            })
        }

        var UpdateObject = { first_name, 
                            last_name, 
                            email, 
                            number, 
                            age, 
                            height, 
                            weight, 
                            gender, 
                            bloodg, 
                            birth,
                            country, 
                            state, 
                            city, 
                            address,
                            hospital }

        if(req.body.default != null){
            UpdateObject.is_default = parseInt(req.body.default);
        }

        // console.log(UpdateObject);

        const UpdateData = await User.findByIdAndUpdate({ _id: id },{
            $set: UpdateObject
        }, {new: true});

        // console.log(UpdateData);

        return res.status(200).json({
            success: true,
            msg: "Profile Update Successfully!",
            data: UpdateData
        })

    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}


// FORGET PASSWORD CODE-------------------------------------------------------

const CheckEmail = async (req, res) => {
    return res.render('fogetpass/emailcheck');
};

const emailCheck = async (req, res) => {
    try {
        let checkEmail = await User.findOne({ email: req.body.email });
        if (checkEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net> ( not for you )
                    // change it user email as person who using it
                    user: 'blah@gmail.com',
                    pass: 'dehycqoqqepjnrwi'
                }
            });
            var OTP = Math.round(Math.random() * 10000);
            res.cookie('otp', OTP);
            res.cookie('email', checkEmail.email);

            const info = await transporter.sendMail({
                from: 'blahbah@gmail.com', // sender email address
                to: "blahblah@gmail.com", // receivers email address
                subject: "OTP", // Subject line
                html: `<b>${OTP}</b>`, // html body
            });
            // console.log('send Mail');
            if (info) {
                return res.render('fogetpass/otpCheck');
            }
            else {
                return res.redirect('back');
            }
        }
        else {
            console.log('email is not match');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log('something wrong');
        return res.redirect('back');
    }
};

const otpCheck = async (req, res) => {
    return res.render('fogetpass/otpCheck');
};

const otpEmail = async (req, res) => {
    // console.log(req.body.OTP);
    // console.log(req.cookies.otp);
    if (req.body.OTP == req.cookies.otp) {
        // console.log('hi');
        return res.render('fogetpass/veryFive');
    }
    else {
        // console.log('lo');
        return res.redirect('back');
    }
};

const NewPass = async (req, res) => {
    // console.log(req.body);
    let NewAdmin = await User.findOne({ email: req.cookies.email });
    // console.log(NewAdmin.email);
    if (NewAdmin.email == req.cookies.email) {
        if (req.body.nPass == req.body.cPass) {
            // console.log('hi');
            await User.findByIdAndUpdate(NewAdmin.id, { confirm_password: req.body.nPass });
            res.clearCookie('otp');
            res.clearCookie('email');
            return res.render('fogetpass/forgetdone');
        }
        else {
            return res.redirect('back');
        }
    }
    else {
        return res.redirect('back');
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    UpdateProfile,
    CheckEmail,
    emailCheck,
    otpCheck,
    otpEmail,
    NewPass,
}