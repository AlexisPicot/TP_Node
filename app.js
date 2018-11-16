// app.js
'use strict';
let express = require("express");
let app = express();
let http = require("http");
let CONFIG = require("./config.json");

// init server
let server = http.createServer(app);
server.listen(CONFIG.port);

process.env.CONFIG = JSON.stringify(CONFIG);

app.use(require("./app/routes/default.route.js"));
app.use(require("./app/routes/presentation.route.js"));

let path = require("path");
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));



let ContentModel = require("./app/models/content.model.js");

let read = ContentModel.read("d4c257c5-7c67-46dc-bcf5-3c896bcd57f7",(content)=>console.log(content.id));
//ContentModel.delete("d4c257c5-7c67-46dc-bcf5-3c896bcd57f7",()=>console.log("done !"));
//console.log(read);