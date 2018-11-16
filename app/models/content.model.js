'use strict';


const fs = require("fs");
const path = require("path");
const CONFIG = JSON.parse(process.env.CONFIG);


const imageType = require('image-type');
module.exports = class ContentModel {
    get src() {
        return this._src;
    }

    set src(value) {
        this._src = value;
    }

    constructor(obj) {
if (!obj) return;

        this._type =    obj._type;
        this._id        = obj._id;
        this._title     = obj._title;
        this._fileName  = obj._fileName;
        this._src       = obj._src;

    }
    static getContent(id, callback) {

        if(id == null) callback("L'id ne peut pas être nul");
        let resolve = path.resolve(CONFIG.contentDirectory, id + '.meta.json');
        let access = fs.access(resolve,err=>{
            if(err) {callback(err);return;}
            return fs.readFile(resolve, (err, contents) => {
                if (err) callback(err);
                let contents1 = contents;
                if(contents1)
                    callback(null,JSON.parse(contents1.toString()));
                else callback("File is empty");
            });
        });

    }


       static create(content, callback){

           if(content == null) {callback("Le contenu ne peut pas être nul");return}
           if(!content instanceof ContentModel) {callback("Le contenu doit être un ContentModel");return;}
           if (typeof content==="string"){
               content =  JSON.parse(content);
           }
           if(!content._id) {callback("L'id ne peut pas être nul");return;}
           let file = path.resolve(CONFIG.contentDirectory, content._id + '.meta.json');

           if (content._type ==='img' && content._data){
               let buffer = Buffer.from(content._data.toString(), 'base64');
               let imageType1 = imageType(buffer);
               let imgPath =  path.resolve(CONFIG.contentDirectory, (content._fileName || content._id + '.'+imageType1.ext));

               fs.writeFile(imgPath, buffer, (err) => {
                   if (err) throw err;
                   let new_content = Object.assign(new ContentModel(), content);
                   new_content._fileName = path.relative(CONFIG.contentDirectory, imgPath);
                   new_content._data = undefined;
                   fs.writeFile(file, JSON.stringify(new_content, null, 2), (err) => {
                       if (err) throw err;
                       callback();
                   });
               });
           }else{
               fs.writeFile(file, JSON.stringify(content, null, 2), (err) => {
                   if (err) throw err;
                   callback();
               });
           }


       }
    static read(id, callback) {
        return this.getContent(id, (err,content) => {
                let assign = Object.assign(new ContentModel(), content);
                callback(err,assign)}
            );
    }
    static update(content, callback){
        if(content == null) {callback("Le contenu ne peut pas être nul");return}
        if (typeof content==="string"){
            content =  JSON.parse(content);
        }
        if(!content._id) {callback("L'id ne peut pas être nul");return}

        this.read(content._id,(err, old_content)=>{
            if ((content._type ==='img' && old_content._type!=='img' )||(old_content._fileName!==content._fileName)){
                if (!content.data) callback("Pour mettre à jour un contenu de type image, merci de spécifier un attribut data contenant les bytes (Uint8Array) du fichier image");

            }
            this.create(content,callback)

        })


    }

    static delete(id, callback) {
        this.getContent(id, (err, content) => {
            if (err) {callback(err);return;}
            let resolve = path.resolve(CONFIG.contentDirectory, id + '.meta.json');
            fs.access(resolve,erro=>{
                if (erro) callback(erro)
                else {
                    fs.unlink(resolve, () => {
                            if (err) callback(err);
                            fs.unlink(path.resolve(CONFIG.contentDirectory, content._fileName), (err) => {
                                if (err) callback(err);
                                callback();
                            })
                        }
                    );
                }
            });

        });
    }


    get type() {
        return this._type;
    }

    set type(value) {
        if (!['img', 'img_url', 'video', 'web'].includes(value)) throwError("Invalid type, choose one of ['img', 'img_url', 'video', 'web']")
        this._type = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get fileName() {
        return this._fileName;
    }

    set fileName(value) {
        this._fileName = value;
    }

    getData() {
        return this._data;
    }

    setData(value) {
        this._data = value;
    }
};

