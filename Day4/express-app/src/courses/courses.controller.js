const fs = require('fs').promises;
const USER_FILE = 'course.json';
const path = require('path');

let filename = path.resolve(__dirname, '../', USER_FILE);

async function readCourseDetails() {

  let data = await fs.readFile(filename);
  let response = {
    data: JSON.parse(data.toString())
  }

  return response;
}
async function getAllCourses(req, res) {
  try {
    let fileObj = await readCourseDetails();
    return res.send(fileObj.data);
  } catch (e) {
    return res.status(500).send("Tech Error, please try again later", e)
  }
}

async function getCourse(req, res) {
  // console.log("Query", req.query);
  // console.log("PARAMS:", req.params);
  try {
    let fileObj = await readCourseDetails();
    if (fileObj) {
      console.log(fileObj)
      let user = fileObj.data.find(u => u.id === parseInt(req.params.userID));
      if (!user) {
        return res.status(400).send({
          error: "Course not found " + req.params.userID
        })
      }
      res.send(user);
    }
  } catch (e) {
    console.log("Errror", e)
    res.status(500).send(e)
  }
}

module.exports = {
  getAllCourses,
  getCourse
}