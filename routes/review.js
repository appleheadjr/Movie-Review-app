const {Router} = require("express");
const multer = require('multer');
const path = require('path');
const Review = require('../models/review');
const Comment = require('../models/comment');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    },
  });
  
const upload = multer({storage:storage});

router.get("/add-new", (req,res)=>{
    return res.render("addreview",{
        user:req.user,
    });
});

router.get('/:id', async (req,res)=>{
    const review = await Review.findById(req.params.id).populate("createdBy", "fullName");
    const comment = await Comment.find({reviewId: req.params.id}).populate('createdBy');
    console.log("comment", comment);
    return res.render("review",{
        
        user:req.user,
        review,
        comment,
    })
})

router.post('/comment/:reviewId', async(req,res)=>{
    await Comment.create({
        content : req.body.content,
        reviewId:req.params.reviewId,
        createdBy : req.user._id,
    });

    return res.redirect(`/review/${req.params.reviewId}`);
});


router.post("/", upload.single('coverImage'), async (req,res)=>{
    const {title,body,rating} = req.body;
    console.log(req.body);  // Log the entire req.body to check if all form fields are present
    console.log(req.file);  // Log the uploaded file details
    let coverImageURL;
    if (req.file) {
        // If an image is uploaded, use the user's image
        coverImageURL = `/uploads/${req.file.filename}`;
    } else {
        // If no image is uploaded, use a default image URL
        coverImageURL = '/uploads/default.png'; // Update with your default image path
    }
    const review = await Review.create({
        body,
        title,
        rating,
        createdBy:req.user._id,
        coverImageURL,

    })
    return res.redirect(`/review/${review._id}`);
});



module.exports = router;