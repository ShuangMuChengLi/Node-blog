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
exports.insertLog = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            let id = uuidV4();
            connection.query(
                "INSERT INTO log (id , ip, date, page, country,city ,lat ,lon ,org , region , regionName , timezone ,isp ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [id,arg.ip,new Date(),arg.page , arg.country ,arg.city ,arg.lat ,arg.lon ,arg.org ,arg.region ,arg.regionName ,arg.timezone ,arg.isp ],
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
 * @param arg
 * arg = {
        nickname:"昵称",
        tel :"18850716271",
        comment :"评论",
        pid :"ea3f63b2-c5b0-444e-a695-978240494800"
    };
 * @returns {Promise}
 */
exports.updateLog = function (arg) {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                "UPDATE log SET country=?,city=? ,lat=? ,lon=? ,org=? , region=? , regionName=? , timezone=? ,isp=? where ip=?",
                [
                    arg.country,
                    arg.city,
                    arg.lat,
                    arg.lon,
                    arg.org,
                    arg.region,
                    arg.regionName,
                    arg.timezone,
                    arg.isp,
                    arg.ip
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
 * @param arg
 * arg = {
        nickname:"昵称",
        tel :"18850716271",
        comment :"评论",
        pid :"ea3f63b2-c5b0-444e-a695-978240494800"
    };
 * @returns {Promise}
 */
exports.selectViewIP = function () {
    let promise = new Promise((resolve, reject) => {
        db.getConnection(function (err, connection) {
            if (err) {
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                "select count(`log`.`id`) AS `logTime`,`log`.`ip` AS `ip` from `log` where org='' group by `log`.`ip` order by `logTime` desc limit 0,1",
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
