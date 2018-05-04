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
var userDao = {
    addUser: function (user) {

        console.log("add user Dao==========");

        var errorCode = 0;

        var deferred = Q.defer();

        connection.query('select * from apv_employee where name =? ', [user.name], function (err, res) {
            if (err) {
                deferred.reject(err)
            } else {
                if (res.length > 0) {
                    errorCode = 1;
                    deferred.reject(errorCode)
                } else {
                    var id = uuid.v1();
                    connection.query('insert into apv_employee values (?,?,?,?)', [id, user.name, user.role, ""], function (err, res) {
                        if (err) {
                            deferred.reject(err)
                        } else {
                            errorCode = 2;
                            deferred.resolve()
                        }
                    });
                }
            }
        });
        return deferred.promise;
    },
    getUsers: function () {
        console.log("get users Dao==========");
        var deferred = Q.defer();

        connection.query('select * from apv_employee', function (err, res) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });
        return deferred.promise;
    },
    login: function (user) {
        console.log("login Dao==========");
        var deferred = Q.defer();

        connection.query('select * from apv_employee where name= ? and password=?', [user.name, user.password], function (err, res) {
            if (err) {
                deferred.reject(err);
            } else {
                if (res.length > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject(1);
                }
            }
        });
        return deferred.promise;
    }

}
module.exports = userDao;
