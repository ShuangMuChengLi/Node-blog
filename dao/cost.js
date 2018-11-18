const log4js = require("log4js");
const moment = require("moment");
const log = log4js.getLogger("app");
let db = require("../config/db");
const uuidV4 = require("uuid/v4");
/**
 * 获取列表
 * @param arg
 * @returns {Promise}
 */
exports.selectListByPid = function (arg) {
    let promise = new Promise((resolve, reject) => {
        let sSql = `SELECT * FROM cost WHERE pid=? ORDER BY create_time DESC`;
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [arg.id ],
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
 * 获取月开销
 * @param arg
 * @returns {Promise}
 */
exports.selectSumCostByMonth = function (arg) {
    let promise = new Promise((resolve, reject) => {
        let sSql = `SELECT
                        SUM(c.cost) sum
                    FROM
                        cost c,
                        budget b
                    WHERE
                        c.pid = b.id
                    AND b.year_and_month = ?`;
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [arg.yearAndMonth ],
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

exports.insert = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            let id = uuidV4();
            let sql = "INSERT INTO cost (id,pid,title,cost,create_time) VALUES (?,?,?,?,?)";
            connection.query(
                sql,
                [
                    id,
                    arg.pid,
                    arg.title,
                    arg.cost,
                    new Date()
                ],
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
