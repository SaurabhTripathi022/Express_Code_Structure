const fs = require("fs").promises;
const USER_FILE = "users.json";
const path = require("path");

const User = require("../models/user.model");

const jwt = require("jsonwebtoken");


// async function getAllUsers(req, res) {
//   try {
//     const users = await User.find();
//     return res.send(users);
//   } catch (e) {
//     return res.status(500).send("Tech Error, please try again later", e);
//   }
// }

async function getUser(req, res) {
  try {
    return res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Technical Error");
  }
}

async function createUser(req, res) {
  try {
    const user = new User(req.body);

    // let hashed = await bcrypt.hash(req.body.password, 8);
    // user.password = hashed;
    await user.save();

    let token = await user.generateAuthToken();

    res.status(201).send({
      user,
      token
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: "Tech Diff while creating user",
    });
  }
}

async function updateUser(req, res) {
  let updates = Object.keys(req.body); // Get all the keys
  let allowedKeys = ["age", "name", "password"];

  console.log(updates);
  let isValidKeys = updates.every((e) => allowedKeys.includes(e));
  // console.log(isValidKeys);
  if (!isValidKeys) {
    return res.status(400).send("Invalid keys to update");
  }

  try {
    let user = req.user;
    if (!user) {
      return res.status(400).send("Failed to update user");
    }

    updates.forEach((k) => (user[k] = req.body[k]));
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Technical Error");
  }
}

async function deleteUser(req, res) {
  let id = req.params.id;

  try {
    let user = await User.findById(id);
    if (user) {
      await user.remove();
      res.send(user);
    } else {
      res.status(400).send("Userz not found");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Technical Error");
  }
}

async function logout(req, res) {
  try {

    req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
    await req.user.save();
    res.send("Logged out")
  } catch (e) {
    res.status(500).send();
  }
}
async function loginUser(req, res) {
  let email = req.body.email.trim();
  let password = req.body.password.trim();

  if (!email || !password) {
    return res.status(400).send("Please pass email and password for login");
  }

  // let user = await User.findOne({
  //   email
  // });
  // if (!user) {
  //   return res.status(400).send("Please pass proper email and password for login");
  // }

  // let isValid = await bcrypt.compare(password, user.password);
  // if (!isValid) {
  //   return res.status(400).send("Invalid credentials");
  // }
  try {
    let user = await User.findByCredentials(email, password);
    let token = await user.generateAuthToken();
    return res.send({
      user,
      token
    });

  } catch (e) {
    return res
      .status(400)
      .send("Please pass proper email and password for login");
  }

}

module.exports = {
  // getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logout
};