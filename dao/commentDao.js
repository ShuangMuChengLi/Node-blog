const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
const uuidV4 = require("uuid/v4");
/**
 *
 * @param arg
 * arg = {
            title:"标题",
            keyword :"关键字",
            description :"描述",
            content :"内容",
            menu :"菜单",
            isindex : "1"
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
                "INSERT INTO cms (id , nickname,tel,comment,pid,del) VALUES (?,?,?,?,?,0)",
                [id,arg.nickname,arg.tel,arg.comment,arg.pid],
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
