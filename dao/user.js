const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
let cryptoUtil = require("../service/util/crypto-util");
const uuidV4 = require("uuid/v4");
exports.getUserInfo = function (username) {
    let promise = new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM  user where user=?";
        console.log(sSql, username)
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [username],
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
