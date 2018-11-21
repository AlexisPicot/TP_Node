// default.route.js
'use strict';
const parseBearerToken = require("parse-bearer-token");

const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");
const utils = require("../utils/utils.js");
const ContentModel = require("./../models/content.model");
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
module.exports = router;

let CONFIG = JSON.parse(process.env.CONFIG);
// TODO : Routing using
router.route("/")
    .all(requiresLogin, function (request, response) {
        response.sendFile(global.__basedir + '/index.html')

    });


function requiresLogin(req, res, next) {
    let token = parseBearerToken(req) || req.query["auth"];
    if (token) {
        var verify = jwt.verify(token, 'secret');
        next();
    } else {
        res.redirect('/login?callback=' + encodeURIComponent(req.originalUrl));
        return next();
    }
}
router.route('/UUID').all((req, res)=>res.end(utils.generateUUID()));
router.route('/login')
    .all((req, res, next) => {
        let cred = auth(req);
        // cred = {name:'user'};

        if (cred && ["admin", "user"].includes(cred.name)) {
            const expiresIn = 60 * 60;
            res.redirect(req.query["callback"] + "?auth=" + encodeURI(jwt.sign({id: cred.name}, 'secret', {expiresIn: expiresIn})))
        } else {
            res.setHeader('WWW-Authenticate', 'Basic realm="user ou admin, mot de passe non vérfié"');
            res.end('Authenticate with Basic Auth, "user" or "admin" user and any password to succeed');
        }
    });
// router.route("/test2")
//     .all(function (request, response) {
//         let json = "{\n" +
//         "  \"_type\": \"img\",\n" +
//         "  \"_id\": \"d4c257c5-7c67-46dc-bcf5-3c896bcd57f7\",\n" +
//         "  \"_title\": \"Nao2\",\n" +
//         "  \"data\": \"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\",\n" +
//         "  \"src\": \"/contents/d4c257c5-7c67-46dc-bcf5-3c896bcd57f7\"\n" +
//         "}";
//         ContentModel.update(json,()=>console.log("Done !"));
//         response.end();
//
//     });
// router.route("/test3")
//     .all(function (request, response) {
//         let json = "{\n" +
//         "  \"_type\": \"img\",\n" +
//         "  \"_id\": \"d4c257c5-7c67-46dc-bcf5-3c896bcd57f7\",\n" +
//         "  \"_title\": \"Nao3\",\n" +
//         "  \"data\": \"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\",\n" +
//         "  \"src\": \"/contents/d4c257c5-7c67-46dc-bcf5-3c896bcd57f7\"\n" +
//         "}";
//         ContentModel.create(json,()=>console.log("Done !"));
//         response.end();
//
//     });

