/**
 * Created by ligang on 16-12-7.
 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'se.tju.edu.cn',
    user     : 'web2016',
    password : 'web2016',
    database : 'web2016'
});

function Db(){
}

Db.query = function(sql,callback) {
    connection.query(sql, function(err, data) {
        if (err) throw err;
        callback(err,data);
    });
};

module.exports = Db ;
