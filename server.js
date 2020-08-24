const app = require("./app");
const http = require("http");

// Server Setup
const port = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
