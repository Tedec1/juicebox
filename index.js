require("dotenv").config();
const {PORT = 3000} = process.env;
const express = require("express");
const { apiRouter } = require("./api");
server = express();
const { client } = require("./db");
client.connect();
const morgan = require("morgan");
server.use(morgan("dev"));
const bodyparser = require("body-parser");
server.use(bodyparser.json());
// server.use(express.urlencoded({extended:true}))
server.use('/api',apiRouter)
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});
server.listen(PORT, () => {
	console.log("server is listening on port", PORT);
});
server.get('/background/:color', (req, res, next) => {
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});