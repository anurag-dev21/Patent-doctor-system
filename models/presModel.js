const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    medicine_name:{
        type:String,
        required:true
    },
    strength:{
        type:String,
        required:true
    },
    dose:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    when_to_take:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);