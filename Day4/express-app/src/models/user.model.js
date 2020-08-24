const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // default: "Default Name",
    trim: true,
    maxlength: 16,
    minlength: 3,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    minlength: 3,
    maxlength: 256,
    validate(value) {
      if (value.includes("password"))
        throw new Error("Cannot have pass in the username");
    },
  },
  tokens: [{
    token: {
      type: String,
      rquired: true
    }
  }],
  isAdmin: {
    type: Boolean,
    default: false
  }
});


userSchema.methods.generateAuthToken = async function () {
  let user = this;
  let secretkey = config.get('secretKey');
  let expiryTime = config.get('jwtExpiry');

  let token = await jwt.sign({
    _id: user._id,
    isAdmin: user.isAdmin
  }, secretkey, {
    expiresIn: expiryTime
  });

  user.tokens = user.tokens.concat({
    token
  });
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async function (email, password) {
  let user = await this.findOne({
    email
  });
  if (!user) {
    throw new Error("Please pass proper email and password for login");
  }

  let isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  return user;
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 8);

  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;