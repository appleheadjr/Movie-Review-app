const {Schema,model} = require("mongoose");

const reviewSchema = new Schema({
    title:{
        type : String,
        required:true,
    },
    body:{
        type:String,
        required: true,
    },
    coverImageURL:{
        type:String,
        required:false,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"user",
    },
    rating:{
        type: Number, // Assuming the rating is a numeric value
        required: true, // Adjust as needed based on your requirements
        min: 1, // Minimum rating value
        max: 5,
    }
},
{
    timestamps:true
});

const Review = model("Review", reviewSchema);
module.exports = Review;