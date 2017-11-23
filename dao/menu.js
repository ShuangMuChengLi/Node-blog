
/**
 * Created by gequn06 on 2016/11/21.
 */
const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
exports.getMenu = function (){
    let promise = new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM menu ORDER BY iOrder ASC";
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [],
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
