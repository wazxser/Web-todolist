/**
 * Created by moon on 2017/1/4.
 */
var db = require('./db');

function User () {

}

User.get = function (id,callback) {
    var sql = 'select * from user where id = ' + id;
    console.log(sql);
    db.query(sql, function (err, data) {
        callback(err,data);
    });
}

User.findByUsername = function (username, callback) {
    var sql = "select * from 3014218101_user where username = '" + username + "'";
    console.log(sql);
    db.query(sql,function (err,data) {
        callback(err,data);
    })
}

// User.findPassword = function (username, password,callback) {
//     var sql = 'select * from 3014218101_user where username = \'' + username + '\' and password = \'' + password + '\'';
//     db.query(sql,function (err,data) {
//         callback(err,data);
//     })
// }

User.add = function (user_list,callback) {
    var sql = "insert into 3014218101_user (username, password, ctime) values ('"+user_list.username+"','"+user_list.password+"','"+user_list.ctime+"')";
    db.query(sql,function (err,data) {
        console.log(data);
        callback(err,data);
    });
}

module.exports = User;