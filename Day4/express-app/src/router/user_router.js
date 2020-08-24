const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const USER_FILE = 'users.json';
const path = require('path');

// CRUD
// HTTP : 
// Create: POST
// Read : GET
// Update : PUT / PATCH
// Delete : DELETE

async function readUserDetails() {
  let filename = path.resolve(__dirname, '../', USER_FILE);

  let data = await fs.readFile(filename);
  let response = {
    data: JSON.parse(data.toString())
  }

  return response;
}
// function readUserDetails() {
//   return new Promise((resolve, reject) => {
//     let filename = path.resolve(__dirname, USER_FILE);

//     fs.readFile(filename, (err, data) => {
//       if (err) {
//         reject({
//           error: 'Failed to read file'
//         })
//       } else {
//         resolve({
//           data: JSON.parse(data.toString())
//         });
//       }
//     })
//   })
// }


router.get('/', async (req, res) => {
  try {
    let fileObj = await readUserDetails();
    return res.send(fileObj.data);
  } catch (e) {
    return res.status(500).send("Tech Error, please try again later", e)
  }
});

router.get('/:userID', async (req, res) => {
  // console.log("Query", req.query);
  // console.log("PARAMS:", req.params);
  try {
    let fileObj = await readUserDetails();
    if (fileObj) {
      console.log(fileObj)
      let user = fileObj.data.find(u => u.id === parseInt(req.params.userID));
      if (!user) {
        return res.status(400).send({
          error: "User not found " + req.params.userID
        })
      }
      res.send(user);
    }
  } catch (e) {
    console.log("Errror", e)
    res.status(500).send(e)
  }
})

router.post('/', (req, res) => {
  // console.log(req.body);
  readUserDetails().then((fileObj) => {

    fileObj.data.push(req.body);

    let filename = path.resolve(__dirname, USER_FILE);

    fs.writeFile(filename, JSON.stringify(fileObj.data, undefined, 2), (err) => {
      if (err) {
        return res.status(500).send("Failed to create user");
      }
      res.status(201).send(req.body);
    })
  }).catch(e => {
    res.status(500).send("Tech Error, please try again later")
  });
});

router.put('/:id', async (req, res) => {
  let filename = path.resolve(__dirname, USER_FILE);

  try {
    let fileObj = await readUserDetails();
    let user = fileObj.data.find(u => u.id === parseInt(req.params.id));
    if (user) {
      user.name = req.body.name;
      console.log(user)
      //save
      fs.writeFile(filename, JSON.stringify(fileObj.data, undefined, 2)).then(() => {
        return res.status(201).send(user);
      }).catch((e) => {
        return res.status(500).send("Failed to update user");
      })
    } else {
      return res.status(400).send("Failed to update user");
    }

  } catch (e) {
    res.status(500).status("Failed to update");
  }

});

router.delete('/:id', async (req, res) => {
  let filename = path.resolve(__dirname, USER_FILE);
  try {
    let fileObj = await readUserDetails();
    let user = fileObj.data.find(u => u.id === parseInt(req.params.id));
    if (user) {
      let index = fileObj.data.indexOf(user);

      fileObj.data.splice(index, 1);
      console.log("FOund user at", index);
      fs.writeFile(filename, JSON.stringify(fileObj.data, undefined, 2)).then(() => {
        return res.status(200).send(user);
      }).catch((e) => {
        return res.status(500).send("Failed to delete user");
      })
    } else {
      return res.status(400).send("User not found");
    }
  } catch (e) {
    return res.status(500).send("Failed to delete user");
  }
});

module.exports = router;