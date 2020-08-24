const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send([{
    id: 999,
    name: "Course 1"
  }, {
    id: 888,
    name: "Course 2"
  }])
})

module.exports = router;