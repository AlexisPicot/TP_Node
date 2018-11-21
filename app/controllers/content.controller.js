'use strict';


const fs = require("fs");
const path = require("path");
const CONFIG = JSON.parse(process.env.CONFIG);
const { base64encode, base64decode } = require('nodejs-base64');
const ContentModel = require("./../models/content.model");


module.exports = class ContentController {
    static list(rep) {
        rep.end(JSON.stringify(fs.readdirSync(CONFIG.contentDirectory).filter(file=>file.toString().endsWith(".json")).map(file => {
            const parse = Object.assign(new ContentModel(),JSON.parse(fs.readFileSync(path.resolve(CONFIG.contentDirectory, file), 'utf8')));
            let obj = {};
            obj[parse._id] = parse;
            return obj;
        }).reduce((previousValue, currentValue) => Object.assign(currentValue, previousValue)),null,2));
    }

    static read(id, json,rep) {
        ContentModel.read(id, content => {
            if (json)
                rep.end(JSON.stringify(content,null, 2));
            else if (content.type === 'img')
                rep.sendfile(path.resolve(global.__basedir, content.fileName));
            else
                rep.redirect(content._src);
        })
    }

    static create(json,rep){
        ContentModel.create(json, e=>rep.redirect(`http://${rep.req.header("host")}${rep.req.url}${e}?json=true`))
    }
};