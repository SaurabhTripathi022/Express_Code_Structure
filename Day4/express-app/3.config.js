const config = require('config');

let appName = config.get('appName');
console.log(appName);

let key = config.get('secretKey');
console.log("Key:", key);