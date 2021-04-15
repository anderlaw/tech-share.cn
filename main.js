
const app = require('./app')

var https = require("https");
const fs = require("fs");
const path = require("path");
const httpsOptions = {
  key: fs.readFileSync(path.resolve("./secret/key.key")),
  cert: fs.readFileSync(path.resolve("./secret/certificate.crt")),
};
//创建https服务器
var httpsServer = https.createServer(httpsOptions, app);
var port = 443;
/**
 * Listen on provided port, on all network interfaces.
 */

httpsServer.listen(port,"0.0.0.0");
httpsServer.on("error", (err) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});
httpsServer.on("listening", () => {
  var addr = httpsServer.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
});
