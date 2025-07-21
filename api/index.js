const serverless = require("serverless-http");
const app = require("../app");  // مسیر به فایل app.js خودت

module.exports.handler = serverless(app);