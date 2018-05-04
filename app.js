/**
 * Created by ryp on 1/27/16.
 */
var express = require('express');
var app = express();
var token = require('./src/token');
var code = require('./src/code');

//start to get req.body
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
//end to get req.body


var userCtrl = require('./src/userCtrl');//user file
var leaveCtrl = require('./src/leaveCtrl');//leave file

app.use(express.static('www'));//static file

app.use(function(req,res,next){
    console.log("api==========",req.path);
    if(req.path=='/user/login'){
        console.log("login request==========");
        next();
    }else{
        console.log("other request==========");
        var resultJson = {};
        if(!req.body.token){
            console.log("not have token==========");
            resultJson.code = code.NOT_LOGIN;
            resultJson.message = code.NOT_LOGIN_MESSAGE;
            res.json(resultJson);
        }else{
            if(!token[req.body.token]){
                console.log("token wrong==========");
                resultJson.code = code.TOKEN_OUT_TIME;
                resultJson.message = code.TOKEN_OUT_TIME_MESSAGE;
                res.json(resultJson);
            }else{
                console.log("token right==========");
                next();
            }
        }
    }
});//server file
app.use("/user",userCtrl);
app.use("/leave",leaveCtrl);

app.listen(3000);
