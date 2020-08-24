const {
  getAllCourses,
  getCourse
} = require('./courses.controller');

module.exports = (router) => {
  router.get('/courses', getAllCourses);
  router.get('/courses/:userID', getCourse);

  //POST

  // PUT

  // DELETE
}