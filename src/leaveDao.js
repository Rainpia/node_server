/**
 * Created by ryp on 1/28/16.
 */
var mysql = require('mysql');
var Q = require('q');
var uuid = require('node-uuid');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apv_leave_db',
    port: 3306
});
var leaveDao = {
    addLeave: function (leave) {
        console.log("add leave Dao==========");

        var errorCode = 0;
        var deferred = Q.defer();

        connection.query('select * from `leave` where name = ? ',[leave.name], function (err, res) {
            if (err) {
                deferred.reject(err)
            } else {
                if (res.length > 0) {
                    var isFinish=1;
                    for(var i=0;i<res.length;i++){
                        if(res[i].is_finish==0){
                            isFinish = 0;
                        }
                    }
                    if(isFinish==0){
                        errorCode = 1;
                        deferred.reject(errorCode)
                    }else{
                        insertLeave(leave);
                    }
                } else {
                    insertLeave(leave);
                }
            }
        });
        function insertLeave(leave){
            var id = uuid.v1();
            connection.query('insert into `leave` values (?,?,?,?,?)', [id, leave.name, leave.startTime,leave.endTime,0], function (err, res) {
                if (err) {
                    deferred.reject(err);
                } else {
                    errorCode = 2;
                    deferred.resolve(errorCode);
                }
            });
        }
        return deferred.promise;
    },
    getLeavesByUser: function (user) {
        console.log("get leave by user Dao==========");
        var deferred = Q.defer();

        connection.query('select * from `leave` where name=?',[user.name] ,function (err, res) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });
        return deferred.promise;
    },
    updateIsFinished: function (id) {
        var deferred = Q.defer();

        connection.query('update `leave` set is_finish = 1 where  id=?',[id] ,function (err, res) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
}
module.exports = leaveDao;
