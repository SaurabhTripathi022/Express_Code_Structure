const bcrypt = require('bcrypt');

let password = "Pass123";

async function generateHash() {

  let hash = await bcrypt.hash(password, 8);
  console.log(hash)

  password = "Pass123";
  let isValid = await bcrypt.compare(password, hash);
  console.log(isValid)
}

generateHash();