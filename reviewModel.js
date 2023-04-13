const mongoose = require("mongoose")

const review = new mongoose.Schema({
  taskProvider : {
    type : String,
    required : true
  },
  taskWorker : {
    type : String,
    required : true
  },
  rating : {
    type : Number,
    required : true
  }
})

module.exports = mongoose.model("review", review)