const {Router} = require("express");
const User = require('../models/user');
const router = Router();

router.get('/signin', (req,res)=>{
    return res.render("signin");
})

router.get("/signup", (req,res)=>{
    return res.render("signup");
})

router.post("/signin", async(req,res)=>{
    const {email,password} = req.body; //need to convert salt to hash so match pw to sign in
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password);
        console.log("You have signed in");  
        return res.cookie('token', token).redirect("/");
    } catch(error){ // if our password is incorrect we will be redirected to homepage
        return res.render("signin",{
            error:"Incorrect Email or Password",
        })
    }
    


})

router.post('/signup', async(req,res)=>{
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    return res.redirect("/");  //when we signup we will be redirected to homepage
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
});

module.exports = router;