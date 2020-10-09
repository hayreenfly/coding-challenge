const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { check, validationResult } = require("express-validator");

const db = require("../../db/models");
const User = db.user;

// @route GET api/auth
// @desc Get Authenticated User
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ["id", "name"],
      where: {
        id: req.user.id,
      },
    });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/auth
// @desc Authenticate(Login) user and get jwt token
// @access Public

router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required.").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      console.log(payload);

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      ); //3600 for an hour
    } catch (err) {
      console.error(err.message);
      await transaction.rollback();
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
