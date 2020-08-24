const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/course', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true
}).then((r) => {
  console.log("Mongo DB connected successfully");
}).catch(e => console.log("Failed to connnect to DB"));