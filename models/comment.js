const {Schema,model} = require("mongoose");

const commentSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    reviewId:{
        type:Schema.Types.ObjectId,
        ref:"review",
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
},{timestamps:true});

const Comment = model("Comment", commentSchema);
module.exports = Comment;