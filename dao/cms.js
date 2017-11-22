const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
exports.add = function(req,res){
    db.getConnection(function(err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            "INSERT INTO user (user , password) VALUES (?,?)",
            ["user" , "password"],
            function(err){
                connection.release();
                if (err) throw err;
                res.end("added");
            }
        );
    });
};
exports.update = function(req,res){
    db.getConnection(function(err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            "UPDATE  user SET password='newpassword' WHERE user=?",
            ["user"],
            function(err){
                connection.release();
                if (err) throw err;
                res.end("update");
            }
        );
    });
};
exports.delete = function(req,res){
    db.getConnection(function(err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            "DELETE FROM  user  WHERE user=?",
            ["user"],
            function(err){
                connection.release();
                if (err) throw err;
                res.end("delete");
            }
        );
    });
};
exports.selectList = function (req,res,fn){
    let sUrl = req.url;
    let sMenu = sUrl.split("/")[1];
    let sSql = "SELECT * FROM  cms where del!=1 and menu='" + sMenu + "'";
    db.getConnection(function(err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            sSql,
            [],
            function(err , rows){
                connection.release();
                if (err) throw err;
                fn(rows);
            }
        );
    });
};
exports.selectIndexList = function (req,res,fn){
    sSql = "SELECT * FROM  cms where isindex=1 and del!=1";
    db.getConnection(function(err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            sSql,
            [],
            function(err , rows){
                connection.release();
                if (err) throw err;
                fn(rows);
            }
        );
    });
};
exports.select = function (req,res,id,fn){
    let sSql = "SELECT * FROM  cms where del!=1 and id='" + id + "'";
    db.getConnection(function(err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            sSql,
            [],
            function(err , rows){
                connection.release();
                if (err) throw err;
                fn(rows);
            }
        );
    });
};
exports.search = function (req,res,keyword,fn){
    let sSql = "SELECT * FROM  cms where del!=1 and (title like '%" + keyword + "%' or description like '%" + keyword + "%')";
    db.getConnection(function(err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            sSql,
            [],
            function(err , rows){
                connection.release();
                if (err) throw err;
                fn(rows);
            }
        );
    });
};
