const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
const uuidV4 = require("uuid/v4");
/**
 * 获取列表
 * @param arg
 * @returns {Promise}
 */
exports.selectList = function (arg) {
    let promise = new Promise((resolve, reject) => {
        let sSql = "";
        let selectArg = [];
        let begin = arg.begin ? parseInt(arg.begin) - 1 : 0;
        let count = arg.count ? parseInt(arg.count) : 10;
        sSql = "SELECT * FROM  music where del!=1 ORDER BY sort ASC,date DESC limit ?,?";
        selectArg = [begin, count];
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
        sSql = "SELECT count(*) AS total FROM  music where del!=1";
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

/**
 *
 * @param arg
 * @returns {Promise}
 */
exports.insertContent = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            let id = uuidV4();
            connection.query(
                "INSERT INTO music (id , title,singer,url,sort,del,date) VALUES (?,?,?,?,?,?,?)",
                [
                    id,
                    arg.title,
                    arg.singer,
                    arg.url,
                    arg.sort,
                    0,
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
/**
 *
 * @param arg
 * @returns {Promise}
 */
exports.updateContent = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                "UPDATE music SET  title=?,singer=?,url=?,sort=?,date=? WHERE id=?",
                [
                    arg.title,
                    arg.singer,
                    arg.url,
                    arg.sort,
                    new Date(),
                    arg.id
                ],
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
/**
 *
 * @param arg
 * @returns {Promise}
 */
exports.sortMusic = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                "UPDATE music SET  sort=? WHERE id=?",
                [
                    arg.sort,
                    arg.id
                ],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(true);
                }
            );
        });
    });
    return promise;
};
/**
 *
 * @param id
 * @returns {Promise}
 */
exports.delContent = function (id) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                "UPDATE music SET  del=1 WHERE id=?",
                [id],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(true);
                }
            );
        });
    });
    return promise;
};
