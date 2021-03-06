const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const db = require("../../db/models/");
const User = db.user;

// middleware that checks and handle validation errors
const {
  check,
  validationResult
} = require("express-validator");

// @route POST api/users
// @desc Register user
// @access Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check("password", "Enter a password with 8 or more characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // find validation errors in the request and return an object with found errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      password
    } = req.body;

    try {
      let user = await User.findOne({
        where: {
          email: email
        }
      });

      if (user) {
        res.status(400).json({
          errors: [{
            msg: "The email address is already being used.",
          }, ],
        });
      } else {
        user = await User.create({
          name,
          email,
          password,
        });

        const payload = {
          user: {
            id: user.id,
            name: user.name,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET, {
            expiresIn: 3600,
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
            });
          }
        ); //3600 for an hour
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route PATCH api/users
// @desc Update (or create) username
// @access Private

router.patch("/", auth, async (req, res) => {

  const username = req.body.username;
  const id = req.user.id;

  try {
    const user = await User.findOne({
      where: {
        id: id
      }
    });

    if (!user) {
      res.json("User not found.")
    } else {

      const updatedUser = await User.update({
        username: username,
      }, {
        where: {
          id: id
        }
      });

      res.json("Successfully saved username");
    }


  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;