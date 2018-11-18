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
exports.selectListByYearAndMonth = function (arg) {
    let promise = new Promise((resolve, reject) => {
        let sSql = `SELECT
                    *,
                    (
                        SELECT
                            surplus
                        FROM
                            budget pre_budget
                        WHERE
                            year_and_month = ?
                        AND
                            now_budget.type = pre_budget.type
                    ) AS pre_surplus,
                    (
                        SELECT
                            SUM(cost)
                        FROM
                            cost
                        WHERE
                            cost.pid = now_budget.id
                    ) AS sum_cost
                FROM
                    budget now_budget
                WHERE
                    year_and_month = ?`;
        let year_and_month = arg.year_and_month;
        let pre_year_and_month = moment(year_and_month, "YYYY-MM").subtract(1, 'months').format("YYYY-MM");
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [pre_year_and_month , year_and_month],
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

exports.insertBudget = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            let id = uuidV4();
            let sql = "INSERT INTO budget (id,type,budget,year_and_month,state,surplus) VALUES (?,?,?,?,?,?)";
            connection.query(
                sql,
                [
                    id,
                    arg.type,
                    arg.budget,
                    arg.year_and_month,
                    0,
                    arg.surplus
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
exports.selectBudgetByYearAndMonthAndType = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            let sql = "SELECT * FROM budget where year_and_month=? and type=?";
            connection.query(
                sql,
                [
                    arg.year_and_month,
                    arg.type
                ],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    if(rows && rows.length){
                        resolve(rows[0]);
                    }else{
                        resolve(null);
                    }

                }
            );
        });
    });
    return promise;
};

/**
 * 更新
 */
exports.update = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                "UPDATE budget SET  surplus=? WHERE id=?",
                [arg.surplus,arg.id],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(arg.id);
                }
            );
        });
    });
    return promise;
};
