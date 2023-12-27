require("dotenv").config();
const path = require("path");
const express = require("express");
const userRoute = require('./routes/user');
const cookieParser = require('cookie-parser');
const reviewRoute = require("./routes/review"); //for connecting the review.ejs file from routes
//dont forget to connect mongodb
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Review = require('./models/review');

const app = express();
const PORT = process.env.PORT || 3000;

//connecting mongodb and naming the database as FilmFeels
//'mongodb://localhost:27017/FilmFeels'
mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("MongoDB Connected"));

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'));

//middleware for form data
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get('/',async(req,res)=>{ 
    const allReviews = await Review.find({}); //sorting reviews based on date
    //console.log("Fetched reviews:", allReviews);
    res.render("home",{
        user: req.user,
        reviews:allReviews,
    });
});
app.use("/user", userRoute);
app.use("/review",reviewRoute); //for adding /review in the display
app.listen(PORT, ()=>console.log(`Server Started at PORT:${PORT}`));
