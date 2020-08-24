const config = require('config');
const express = require('express');
const router = express.Router();
const path = require('path');

let secretkey = config.get('secretKey');

if (!secretkey.trim()) {
  console.log("Forgot to provide secret key?");
  process.exit(1);
}

require('./router/router')(router);

require('./db/db');

// const userRouter = require('./router/user_router');
// const courseRouter = require('./router/course_router');

let public = path.resolve(__dirname, '../public');
const app = express();
app.use(express.static(public));
app.use(express.json());

// app.use((req, res, next) => {
//   console.log("Middleware");
//   // res.status(404).send("Stopped in middleware")
//   next();
// });

// app.use((req, res, next) => {
//   console.log("For Authentication");
//   // res.status(404).send("Stopped in middleware")
//   next();
// });

// app.use((req, res, next) => {
//   console.log("Logging...");
//   // res.status(404).send("Stopped in middleware")
//   next();
// });



app.use('/api', router);


// app.use('/api/users', userRouter);
// app.use('/api/courses', courseRouter);

// app.get('/', (req, res) => {
//   res.send("Welcome to Node Course")
// })

// 404
app.all('*', (req, res) => {
  console.log("Bad route request")
  res.status(404).send({
    error: "Request not served"
  })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, (e) => {
  console.log("Server listening at port", PORT)
})