const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const router = express.Router();
let USER_FILE = require('../userData/userinfo.json');
let write = false;

router.post('/signup', (req, res)=>{ 
    let user = {};
    let userData = req.body;
    let dString = new Date();
    let userId = dString.getTime();
    user.email = userData.email;
    user.password = userData.password;
    user.phone = userData.phone;
    user.id = userId;
    user.token = userId;
    let duplicate = [];
    for(let i=0; i<USER_FILE.length; i++){
        if(USER_FILE[i].email === user.email){
            duplicate.push(user);
            break;
        }
    }
    console.log(duplicate);
    if(duplicate.length === 0){
        console.log("User Going to push");
        USER_FILE.push(user);
        write = true;
        res.json({id: userId, token: userId});
        return 0;
    }
    res.json({message: "User Found With Email"});
});


//verifying token and sending admin page
router.put('/cuadmin', (req, res)=>{ 
    let userData = req.body;
    let match = false;
    for(let i=0; i<USER_FILE.length; i++){ 
        if(USER_FILE[i].id === parseInt(userData.id)){ 
            USER_FILE[i].name = userData.nameU;
            USER_FILE[i].address  = userData.address;
            USER_FILE[i].phone = userData.phone;
            write = true;
            match = true;
            break;
        }
    }
    if(match){
        res.json({message: "User Updated"});
    }else{
        res.json({message: "User Not Found"});
    }
});

router.put('/token', (req, res)=>{ 
    let userData = req.body;
    let match = false;
    let index = 0;
    for(let i=0; i<USER_FILE.length; i++){ 
        if(USER_FILE[i].id === parseInt(userData.id)){ 
            let d = new Date();
            let newToken = d.getTime();
            USER_FILE[i].token = newToken;
            index = i;
            write = true;
            match = true;
            break;
        }
    }
    if(match){
        res.json({message: "Token Updated", token: USER_FILE[index].token});
    }else{
        res.json({message: "User Not Found"});
    }
});

router.delete('/deleteuser', (req, res)=>{ 
    let userData = req.body;
    let match = false;
    for(let i=0; i<USER_FILE.length; i++){ 
        if(USER_FILE[i].id === parseInt(userData.id)){ 
            USER_FILE.splice(i, 1);
            write = true;
            match = true;
        }
    }
    if(match){
        res.json({message: "User Deleted"});
    }else{
        res.json({message: "User Not Found"});
    }
});


router.get('/users', (req, res)=>{ 
     let dirName= path.join(__dirname, '..', 'userData');
    fs.readFile(dirName+"/userinfo.json","utf-8" ,(err, data)=>{
        if(!err){
            let parsedData = JSON.parse(data);
            res.json(parsedData);
        }else{
            res.json({message: "error reading file"});
        }
    });
})


setInterval(function(){
    if(write){
        write = false;
        let stringifyData = JSON.stringify(USER_FILE);
        let dirName= path.join(__dirname, '..', 'userData');
        fs.writeFile(dirName+"/userinfo.json", stringifyData, 'utf-8', function(err){
            if(!err){
                console.log("New User Loaded");
                USER_FILE = require('../userData/userinfo.json');
            }else{ 
                console.log("Some Error at server side");
            }
        });
    }
}, 2000);

module.exports = router;