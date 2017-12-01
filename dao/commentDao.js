const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
const uuidV4 = require("uuid/v4");
/**
 *
 * @param arg
 * arg = {
        nickname:"昵称",
        tel :"18850716271",
        comment :"评论",
        pid :"ea3f63b2-c5b0-444e-a695-978240494800"
    };
 * @returns {Promise}
 */
exports.insertComment = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            let id = uuidV4();
            connection.query(
                "INSERT INTO comment (id , nickname,tel,comment,pid,del,date) VALUES (?,?,?,?,?,0,?)",
                [id,arg.nickname,arg.tel,arg.comment,arg.pid,new Date()],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(id);
                }
            );
        });
    });
    return promise;
};
exports.selectComment = function (id) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                "SELECT * FROM comment WHERE pid=? ORDER BY date ASC ,id DESC",
                [id],
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
