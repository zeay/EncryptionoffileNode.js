const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser");
const path = require("path");
const upload = require('express-fileupload');

const productRoutes = require("./routes/product");
const adminRoutes = require("./routes/admin");
const app = express();

//PORT for testing and production
const PORT = process.env.PORT || 3000; 

//middleware 
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(upload());
app.use(productRoutes);
app.use(adminRoutes);

//404 not fount handler
app.use((req, res, next)=>{ 
    res.status(404).sendFile(path.join(__dirname, 'views', 'notfound.html'));
});


//app listening on local port or process.env.port
app.listen(PORT, (err)=>{
    if(err){
        console.log("Some Error starting server");
    }else{
        console.log("Server is started at "+PORT);
    }
});