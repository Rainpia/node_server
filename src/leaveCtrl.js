/**
 * Created by ryp on 1/28/16.
 */
var leaveCtrl = require('express')();
var leaveDao = require('./leaveDao');//user file
var code = require('./code');

//start to get req.body
var bodyParser = require('body-parser');
leaveCtrl.use(bodyParser.json()); // for parsing application/json
leaveCtrl.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
//end to get req.body

leaveCtrl.post('/addLeave', function (req, res) {

    console.log("add leave ctrl==========");

    var resultJson = {};

    leaveDao.addLeave(req.body).then(function (result) {
        resultJson.code = code.SUCCESS_CODE;
        resultJson.message = code.SUCCESS_ADD_MESSAGE;
        res.json(resultJson);
    }, function (error) {
        if (error == 1) {
            resultJson.code = code.DATA_REPEAT;
            resultJson.message = code.LEAVE_NOT_FINISH;
        } else {
            resultJson.code = code.DATABASE_ERROR;
            resultJson.message = error;
        }
        res.json(resultJson);
    });

});
leaveCtrl.post('/getLeavesByUser', function (req, res) {

    console.log("get Leaves By User ctrl==========");

    var resultJson = {};

    leaveDao.getLeavesByUser(req.body).then(function (result) {
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
leaveCtrl.post('/closeLeave', function (req, res) {

    console.log("close leave ctrl==========");

    var resultJson = {};

    leaveDao.updateIsFinished(req.body.id).then(function (result) {
        resultJson.code = code.SUCCESS_CODE;
        resultJson.message = code.SUCCESS_UPDATE_MESSAGE;
        res.json(resultJson);
    }, function (error) {
        resultJson.code = code.DATABASE_ERROR;
        resultJson.message = error;
        res.json(resultJson);
    });
})

module.exports = leaveCtrl;