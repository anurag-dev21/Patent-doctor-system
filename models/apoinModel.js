const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    diese_name:{
        type:String,
        required:true
    },
    patient_issue:{
        type:String,
        required:true
    },
    hospital:{
        type:String,
        required:true
    },
    app_date:{
        type:String,
        required:true
    },
    app_time:{
        type:String,
        required:true
    },
    app_type:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model('Appointment', appointmentSchema);