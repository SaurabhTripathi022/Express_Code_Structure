const jwt = require("jsonwebtoken");

const secretKey = "mySecretKey";

async function generateToken() {
  const token = await jwt.sign({ _id: "1234", isAdmin: true }, secretKey, {
    expiresIn: "24h",
  });
  console.log(token);
  return token;
}
generateToken()
  .then(async (token) => {
    try {
      let decoded = await jwt.verify(token, secretKey);
      console.log("Decoded value", decoded);
    } catch (e) {
      console.log("Failed to validate");
    }
  })
  .catch((e) => {
    console.log("Failed to validate Token");
  });
