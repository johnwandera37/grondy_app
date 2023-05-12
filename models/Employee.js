const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema   = new Schema({
    firstname:{
        type:String,
        required: true
    },
    secondname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type:String,
    },
    dateOfBirth:{
        type:Date
    },
    gender:{
        type:String,
    },
    // avatar: {
    //     type:String
    // }
}
// ,{timestamps: true}
)

const Employee = mongoose.model('Employee', employeeSchema)
module.exports = Employee