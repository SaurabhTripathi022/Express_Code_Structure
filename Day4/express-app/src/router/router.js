module.exports = function (router) {
  require('../users/users.router')(router);
  require('../courses/courses.router')(router);

}