// default.route.js
'use strict';
let express = require("express");
let path = require('path');
let router = express.Router();
let fs = require('fs');
const ContentCtrl = require("./../controllers/content.controller");
module.exports = router;
let CONFIG = JSON.parse(process.env.CONFIG);
// TODO : Routing using


router.route('/contents')
    .get((req, rep)=>ContentCtrl.list(rep))
    .post((req,rep)=>ContentCtrl.create(req.body,rep));
router.route('/contents/:contentId')
    .get((req, rep) => ContentCtrl.read(req.contentId, req.query.json,rep));


router.param('contentId', function(req, res, next, id) {
    req.contentId = id;
    next();
});
