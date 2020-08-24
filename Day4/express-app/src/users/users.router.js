const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logout
} = require('./users.controller');

const auth = require('../middewares/auth');
const admin = require('../middewares/admin');

module.exports = (router) => {
  // router.get('/users', auth, getAllUsers);
  router.get('/users/myprofile', auth, getUser); // R

  router.post('/users', createUser); // C

  router.put('/users', auth, updateUser); // U

  router.delete('/users/:id', [auth, admin], deleteUser); // D
  // router.delete('/users/self', auth, deleteSelf); // D

  router.post('/users/login', loginUser); // authenticate
  router.post('/users/logout', auth, logout); // logout session

}