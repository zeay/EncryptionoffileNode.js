const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const path = require("path");
let   USER_FILE = require('../userData/userinfo.json');

const express = require("express");

//intializing express router
const router = express.Router();

//taking control of when to write to disk
let write = false;

//throwing encrypted items to user
router.get("/getItems", (req, res)=>{ 

    fs.readdir(__dirname+"/../data", (err, files)=>{
        if(!err){
            // console.log(files);
            res.json({files});
        }else{
            console.log(err);
        }
    });
});

//starting downloading
router.get("/download", (req, res)=>{ 
    let parsedUrl = url.parse(req.url);
    let parsedQs = querystring.parse(parsedUrl.query);
    let fileName = parsedQs.file
    if(!fileName){
        return res.send("<h3>Error Downloading file</h3>")
    }
    let downloadFile = `${__dirname}/../data/${fileName}`;
    res.download(downloadFile);
});


//setting userinfo
router.get("/userInfo", (req, res)=>{ 
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket.remoteAddress;
    if(ip === "::1"){ 
        ip = "LocalHost";
    }
    let parsedUrl = url.parse(req.url);
    let parsedQs = querystring.parse(parsedUrl.query);
    console.log(parsedQs);
    let userObj = {
        lat: parsedQs.lat,
        long: parsedQs.long,
        ip: ip
    }
    USER_FILE.push(userObj);
    console.log(USER_FILE);
    write = true;
    res.json({message: "User Saved"});
});

//writing to disk
setInterval(function(){
    if(write){
        let stringifyData = JSON.stringify(USER_FILE);
        let dirName= path.join(__dirname, '..', 'userData');
        fs.writeFile(dirName+"/userinfo.json", stringifyData, 'utf-8', function(err){
            if(!err){
                console.log("New User Loaded");
                USER_FILE = require('../userData/userinfo.json');
            }else{ 
                console.log("Some Error at server side");
            }
            write = false;
        });
    }
}, 2000);
module.exports = router;