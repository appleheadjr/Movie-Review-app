const JWT = require('jsonwebtoken');
const secret = "Shfdddsdsds";


//the below function takes a user and generates a token for it
function createTokenForUser(user){
    const payload = {
        _id:user._id,
        email: user.email,
        profileImageURL : user.profileImageURL,
        role: user.role,
    };
    
    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){  //takes a token and validates it
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports ={
    createTokenForUser,
    validateToken,
}