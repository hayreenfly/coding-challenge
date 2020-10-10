const express = require("express");
const moment = require("moment");
const router = express.Router();
const auth = require("../../middleware/auth");

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const db = require("../../db/models/");
const {
  check,
  validationResult
} = require("express-validator");
const {
  json
} = require("body-parser");
const Post = db.post;

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_SECRET,
  secretAccessKey: process.env.S3_ACCESS_KEY,
  region: process.env.REGION,
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, callBack) => {
      callBack(null, {
        fieldName: file.fieldname
      });
    },
    key: (req, file, callBack) => {
      var fullPath = "photos/" + file.originalname;
      callBack(null, fullPath);
    },
  }),
  limits: {
    fileSize: 2000000
  }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("photos", 5);

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// @route GET api/post/:userId
// @desc Get all posts by user
// @access Private

router.get("/:userId/", auth, async (req, res) => {
  let posts = await Post.findAll({
    where: {
      userId: req.params.userId
    }
  });

  const foundPosts = [];

  if (posts.length > 0) {
    for (let el of posts) {

      let post = {
        id: el.id,
        title: el.title,
        description: el.description,
        timePosted: moment(el.createdAt).fromNow(),
      };

      let photo = el.photo;

      if (typeof photo == "string") {
        post.photoURL = photo.split(",");
        console.log(photo);
      } else if (typeof photo == "object") {
        return;
      }

      foundPosts.unshift(post);
    }
  }

  res.json(foundPosts);
});

// @route POST api/post
// @desc Create a post
// @access Private

router.post(
  "/",
  [
    auth,
  ],
  async (req, res) => {

    const uploadedImg = await uploadS3(req, res, async (error) => {
      console.log("files", req.files);
      if (error) {
        console.log("errors", error);
        res.status(500).json({
          status: "fail",
          error: error,
        });
      } else {
        // If File not found
        if (req.files === undefined) {
          console.log("Photo Upload Error: No File Selected!");
          res.status(500).json({
            status: "fail",
            message: "Error: No File Selected",
          });
        } else {
          // If Success
          let fileArray = req.files,
            fileLocation;
          const images = [];
          for (let i = 0; i < fileArray.length; i++) {
            fileLocation = fileArray[i].location;
            console.log("filenm", fileLocation);
            images.push(fileLocation);
          }

          const combinedStringsPhotos = images.toString();

          try {

            const newPost = {
              userId: req.user.id,
              title: req.body.title,
              description: req.body.description,
              photo: combinedStringsPhotos,
            }

            const post = await Post.create(newPost);

            post.photo = images;

            res.json(post);

          } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
          }
        }
      }
    });
  }
);

// @route PATCH api/post/postId
// @desc Edit post title, and description
// @access Private

router.patch("/:postId", auth, async (req, res) => {
  const id = req.params.postId;

  try {
    const updatedPost = await Post.update(req.body, {
      where: {
        id: id,
      }
    });

    if (updatedPost) {
      res.json("Successfully updated post!");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }

});

module.exports = router;