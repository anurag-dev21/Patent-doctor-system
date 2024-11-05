const { validationResult } = require('express-validator');
const Prescription = require('../models/presModel');

const addPrescription = async(req,res) => {
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
            medicine_name, 
            strength, 
            dose, 
            duration, 
            when_to_take } = req.body;

        const prescription = new Prescription({
            medicine_name, 
            strength, 
            dose, 
            duration, 
            when_to_take
        });
        const prescriptionData = await prescription.save();
        return res.status(200).json({
            success: true,
            msg: 'Prescription Created Successfully',
            data:prescriptionData
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
};

const getPrescription = async(req,res) => {
    try{
        const presData = await Prescription.find({});
        return res.status(200).json({
            success: true,
            msg: 'Prescription Data Fetched Successfully!',
            data: presData
        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const delPrescription = async(req,res) => {
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

        const presid = await Prescription.findOne({_id:id});
        if(!presid){
            return res.status(400).json({
                success: false,
                msg: 'Prescription Id Not found!!'
            }) 
        }

        await Prescription.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            success: true,
            msg: 'Prescription Data Deleted Successfully!'
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
    addPrescription,
    getPrescription,
    delPrescription
}