const mongoose = require('mongoose');



// Create schema

const userSchema = mongoose.Schema({
    name: {
        type : String,
        required: true,
        minlength: 3 

    },
    username: {
        type : String,
        required: true,
        unique:true,
        minlength: 3 

    },
    password: {
        type : String,
        required: true,
        minlength: 3 

    },
    
    phone: {
        type : String,
        minlength: 3 ,
        required: true


    },
    photo: {
        type : String,
        minlength: 3 ,

    },
    galary: {
        type : Array,
        minlength: 3 

    },
    accessToken: {
        type : String,
        minlength: 3 

    },
    isAdmin: {
        type : String,
        minlength: 3 

    },
    verified:{
        type: Boolean,
        default: false

    },

    

   
    email: {
        type: String,
        required:true,
        unique: true
    }
},{
    timestamps: true 
})













//Create Collection

module.exports = mongoose.model('user', userSchema);