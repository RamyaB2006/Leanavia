const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    feedbacks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Feedback"
        }
    ]
},{
    timestamps:true
});

const Faculty = mongoose.model("Faculty" , facultySchema)
module.exports = Faculty
