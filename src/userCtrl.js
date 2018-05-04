/**
 * Created by ryp on 1/27/16.
 */
var userCtrl = require('express')();
var userDao = require('./userDao');//user file
var code = require('./code');
var token = require('./token');
var uuid = require('node-uuid');

//start to get req.body
var bodyParser = require('body-parser');
userCtrl.use(bodyParser.json()); // for parsing application/json
userCtrl.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
//end to get req.body

userCtrl.post('/addUser', function (req, res) {

    console.log("add user ctrl==========");

    var resultJson = {};
    userDao.addUser(req.body).then(function (result) {
        resultJson.code = code.SUCCESS_CODE;
        resultJson.message = code.SUCCESS_ADD_MESSAGE;
        res.json(resultJson);
    }, function (error) {
        if (error == 1) {
            resultJson.code = code.DATA_REPEAT;
            resultJson.message = code.DATA_REPEAT_MESSAGE;
        }else {
            resultJson.code = code.DATABASE_ERROR;
            resultJson.message = error;
        }
        res.json(resultJson);
    })
});
userCtrl.post('/getUsers', function (req, res) {

    console.log("get users ctrl==========");

    var resultJson = {};
    userDao.getUsers().then(function (result) {
        resultJson.code = code.SUCCESS_CODE;
        resultJson.message = code.SUCCESS_GET_MESSAGE;
        resultJson.data = result;
        res.json(resultJson);
    }, function (error) {
        resultJson.code = code.DATABASE_ERROR;
        resultJson.message = error;
        res.json(resultJson);
    })
});
userCtrl.post('/login', function (req, res) {

    console.log("login ctrl==========");

    var resultJson = {};
    userDao.login(req.body).then(function () {
        resultJson.code = code.SUCCESS_CODE;
        resultJson.message = code.SUCCESS_LOGIN;

        //判断上次是否已经登陆 如果登陆的话 要覆盖token
        for(var x in token){
            if(token[x]==JSON.stringify(req.body)){
                token[x]=undefined;
            }
        }

        //add token
        var tokenForThis = uuid.v1();
        token[tokenForThis] = JSON.stringify(req.body);

        setTimeout(
            function(){
                token[tokenForThis]=undefined;
            }
        ,1000*60*10);//after 10 min,token out of time.

        resultJson.data = {token: tokenForThis};

        res.json(resultJson);
    }, function (error) {
        if (error == 1) {
            resultJson.code = code.DATA_NULL;
            resultJson.message = code.DATA_NULL_MESSAGE;
        } else {
            resultJson.code = code.DATABASE_ERROR;
            resultJson.message = error;
        }
        res.json(resultJson);
    })
})

module.exports = userCtrl;