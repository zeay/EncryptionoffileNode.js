const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const {checkFile,checkParams,setupHeaders,cryptFileWithSalt} = require("../utils/index");
const router = express.Router();

//throwing userinfo to asmin
router.get('/getInfo', (req, res)=>{
    let dirName= path.join(__dirname, '..', 'userData');
    fs.readFile(dirName+"/userinfo.json","utf-8" ,(err, data)=>{
        if(!err){
            res.json(data);
        }else{
            res.json({message: "error reading file"});
        }
    })
})

//uploading and encryptingfile
router.post('/adminUpload', (req, res)=>{ 
    if(req.files){
        //console.log(req.headers);
        req.body = {
            salt: req.headers['salt'],
            key: req.headers['key'],
            algo: req.headers['algo']
        }
        console.log(req.body);
        console.log(req.files);
        if (!req.files || !checkFile(req.files)) {
            return res.status(400).end("Please upload correct file");
          }
          if (!checkParams(req.body)) {
            return res.status(400).end("Please provide correct parameters");
          }
          const file = req.files.file;
          const encrypted = cryptFileWithSalt(file, false, req.body);
          console.log(encrypted);
          let dirName= path.join(__dirname, '..', 'data');
          console.log(dirName);
        fs.writeFile(dirName+"/encrypted_"+file.name, encrypted, (err)=>{ 
            if(err){
                  res.send(err);
              }else{
                  res.send("File Uploaded");
              }
        })
    }
});


//verifying token and sending admin page
router.post('/admin', verifyToken, (req, res)=>{ 
    console.log(req.token);
    jwt.verify(req.token, 'secretavilon', (err, token)=>{ 
        if(err){
            res.json({message: "Some Error"});
        }else{
            res.sendFile(path.join(__dirname, '..', 'views', 'adminPage.html'));
        }
    });
});


//registering and login admin
router.post("/login", (req, res)=>{ 
    console.log("i requested");
    let passkey = req.body.password;
    if(passkey === "admin"){
        jwt.sign({passkey}, 'secretavilon', (err, token)=>{ 
            if(!err){
                res.json({token});
            }else{
                res.json({message: "Some error creating token"});
            }
        })
    }else{
        res.json({message: "Autorization failed"});
    }
});

//verify token middleware
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== "undefined"){
        let bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        //setting token
        req.token = bearerToken;
        //calling next middleware
        next();
    }else{
        res.json({message: "Token is not Present"});
    }
}

module.exports = router;