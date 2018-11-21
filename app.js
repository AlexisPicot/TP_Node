// app.js
'use strict';
global.__basedir = __dirname;
let express = require("express");
let app = express();

const jwt = require('jsonwebtoken');
let CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
// init server
let server = require('http').Server(app);



let io = require('socket.io')(server);
server.listen(CONFIG.port, function(){
    console.log('listening on *:3000');
});
require("./app/controllers/io.controller.js").listen(server);


let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("./app/routes/default.route.js"));
app.use(require("./app/routes/presentation.route.js"));
app.use(require("./app/routes/model.route.js"));

let path = require("path");
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));


console.log(`token for admin tests :  
                {
                    "access_token":"${jwt.sign({id: 'admin'}, 'secret', { expiresIn: 3e7 })}",
                    "token_type":"bearer",
                    "expires_in":${3e7}
                }`);


