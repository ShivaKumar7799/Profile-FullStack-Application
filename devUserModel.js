const mongoose = require("mongoose")

const devUser = new mongoose.Schema({
  fullName : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  mobile : {
    type : Number,
    required : true
  },
  skill : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  confirmPassword : {
    type : String,
    required : true
  }
})

module.exports = mongoose.model("devUserModel",devUser)