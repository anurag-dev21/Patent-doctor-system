const { validationResult } = require('express-validator');
const Appointment = require('../models/apoinModel');

const addAppointments = async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors:errors.array()
            })
        }

        const { 
                first_name, 
                last_name, 
                diese_name, 
                patient_issue, 
                hospital, 
                app_date, 
                app_time, 
                app_type } = req.body;

        const appointments = new Appointment({
                first_name, 
                last_name, 
                diese_name, 
                patient_issue, 
                hospital, 
                app_date, 
                app_time, 
                app_type
        });
        const appointmentsData = await appointments.save();
        return res.status(200).json({
            success: true,
            msg: 'Appointments_Data Created Successfully',
            data:appointmentsData
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
};

const getAppointments = async(req,res) => {
    try{
        const apoinData = await Appointment.find({});
        return res.status(200).json({
            success: true,
            msg: 'Appoinment Data Fetched Successfully!',
            data: apoinData
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const delAppointments = async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors:errors.array()
            })
        }
        const { id } = req.body;

        const apoinid = await Appointment.findOne({_id:id});
        if(!apoinid){
            return res.status(400).json({
                success: false,
                msg: 'Appoinment Id Not found!!'
            }) 
        }

        await Appointment.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            success: true,
            msg: 'Appointment Data Deleted Successfully!'
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const uptAppointments = async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors:errors.array()
            })
        }
        const { 
            id,
            first_name, 
            last_name, 
            diese_name, 
            patient_issue, 
            hospital, 
            app_date, 
            app_time, 
            app_type } = req.body;


        const apoinid = await Appointment.findOne({_id:id});
        if(!apoinid){
            return res.status(400).json({
                success: false,
                msg: 'Appoinment Id Not Exist!!'
            }) 
        }

        var updateobj = {
            first_name, 
            last_name, 
            diese_name, 
            patient_issue, 
            hospital, 
            app_date, 
            app_time, 
            app_type
        }

        const updateData = await Appointment.findByIdAndUpdate({ _id: id },
            {
                $set:updateobj
            },{ new:true }
        );
        return res.status(200).json({
            success: true,
            msg: 'Appointments Updated Successfully!',
            data: updateData
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = {
    addAppointments,
    getAppointments,
    delAppointments,
    uptAppointments
}