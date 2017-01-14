/**
 * Created by moon on 2017/1/4.
 */

var db = require('./db');

function List () {

}

List.findAll = function (callback) {
    db.query('select * from 3014218101_list',function (err, data) {
        callback(err,data);
    });
}

List.add = function (list,callback) {
    var sql = "insert into 3014218101_list (uid, thing, ctime, deadline, status) values ("+list.uid+",'"+list.thing+"','"+list.ctime+"','"+list.deadline+"','"+list.status+"')";
    db.query(sql,function (err,data) {
        console.log(data);
        callback(err,data);
    })
}

List.findByUserId = function (uid, callback) {
    console.log(uid);
    var sql = "select * from 3014218101_list where uid =" + uid;
    db.query(sql,function (err,data) {
        callback(err,data);
    })
}

List.delete = function (id,callback) {
    var sql = "delete from 3014218101_list where id =" + id;
    db.query(sql,function (err,data) {
        console.log(data);
        callback(err,data);
    })
}

List.updateStatus = function(list_id, callback){
    var sql = "update 3014218101_list SET status = '完成' where id=" + list_id;
    db.query(sql, function(err, data) {
        console.log(data);
        callback(err, data);
    });
};

module.exports = List;