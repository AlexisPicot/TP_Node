// default.route.js
'use strict';
var express = require("express");
var path = require('path');
var router = express.Router();
var fs = require('fs');
module.exports = router;

var CONFIG = JSON.parse(process.env.CONFIG);
// TODO : Routing using

router.route("/presentation")
    .get((request, response) => {
        var e = fs.readdirSync(CONFIG.presentationDirectory).map(file => {
                const parse = JSON.parse(fs.readFileSync(path.resolve(CONFIG.presentationDirectory, file), 'utf8'));
                let obj = {};
                obj[parse.id] = parse;
                return obj;
        });
        var reduce = e.reduce((previousValue, currentValue) => Object.assign(currentValue ,previousValue));

        response.end(JSON.stringify(reduce, null, 2))
    })
    .post((request,response)=>{
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            fs.writeFile(path.resolve(CONFIG.presentationDirectory, JSON.parse(body).id)+'.pres.json', body, function (err) {
                if (err)
                    return console.log(err);
                response.end('Wrote file');
            });
        });
    });
