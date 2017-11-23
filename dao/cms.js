const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
/**
 * 获取列表
 * @param arg
 * @returns {Promise}
 */
exports.selectList = function (arg) {
    let promise = new Promise((resolve, reject) => {
        let sSql = "";
        let selectArg = [];
        let begin = arg.begin ? arg.begin : 1;
        let count = arg.count ? arg.count : 10;
        let menu = arg.menu;
        if (arg) {
            if (menu === "index") {
                sSql = "SELECT * FROM  cms where isindex=1 and del!=1 limit ?,?";
                selectArg = [begin, count];
            } else {
                sSql = "SELECT id,title,keyword,description,date,menu FROM  cms where del!=1 and menu=? limit ?,?";
                selectArg = [menu, begin, count];
            }
        }
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                selectArg,
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        });
    });
    return promise;
};
/**
 * 获取列表总个数
 * @param arg
 * @returns {Promise}
 */
exports.selectListTotal = function (arg) {
    let promise = new Promise((resolve, reject) => {
        let selectArg = [];
        let sSql = "";
        let menu = arg.menu;
        if (arg) {
            if (menu === "index") {
                sSql = "SELECT count(*) AS total FROM  cms where isindex=1 and del!=1 ";
            } else {
                sSql = "SELECT count(*) AS total  FROM  cms where del!=1 and menu=? ";
                selectArg = [arg.menu];
            }
        }
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                selectArg,
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows[0].total);
                }
            );
        });
    });
    return promise;
};
exports.getContent = function (id) {
    let promise = new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM  cms where del!=1 and id=?";
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [id],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows[0]);
                }
            );
        });
    });
    return promise;
};
exports.search = function (req, res, keyword, fn) {
    let sSql = "SELECT * FROM  cms where del!=1 and (title like '%" + keyword + "%' or description like '%" + keyword + "%')";
    db.getConnection(function (err, connection) {
        if (err) {
            log.error(err);
            return;
        }
        connection.query(
            sSql,
            [],
            function (err, rows) {
                connection.release();
                if (err) throw err;
                fn(rows);
            }
        );
    });
};
