//creating a schema for users
const {Schema, model} = require('mongoose')
const {createHmac,randomBytes } = require("crypto"); 
const { createTokenForUser } = require('../services/authentication');
const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    salt:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:'/images/default.png',
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:"USER",
    },

}, 
    {timestamps:true}
);


//function for hashing user's password
userSchema.pre("save", function(next){ //before saving the user this code will run
    const user = this;
    if(!user.isModified('password')) return;
    const salt = randomBytes(16).toString() ; //salt is a secret key for each user
    const hashedPassword = createHmac('sha256',salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static(
    "matchPasswordAndGenerateToken", async function (email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found'); // if user not found matching the same email
    //else
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac('sha256',salt)
        .update(password)
        .digest("hex");

    if(hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");

    const token = createTokenForUser(user); //creating a token for user for authentication
    return token;
});

const User = model('user', userSchema);
module.exports = User;