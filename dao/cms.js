const log4js = require("log4js");
const log = log4js.getLogger("app");
let db = require("../config/db");
const uuidV4 = require('uuid/v4')
/**
 * 获取列表
 * @param arg
 * @returns {Promise}
 */
exports.selectList = function (arg) {
    let promise = new Promise((resolve, reject) => {
        let sSql = "";
        let selectArg = [];
        let begin = arg.begin ? parseInt(arg.begin) : 1;
        let count = arg.count ? parseInt(arg.count) : 10;
        let menu = arg.menu;
        let keyword = arg.keyword;
        if (arg) {
            if(menu){
                if (menu === "index") {
                    sSql = "SELECT id,title,keyword,description,date,menu FROM  cms where isindex=1 and del!=1 ORDER BY date DESC,isindex DESC limit ?,?";
                    selectArg = [begin, count];
                } else if(menu === "search"){
                    sSql = "SELECT id,title,keyword,description,date,menu FROM  cms where del!=1 and (title like '%" + keyword + "%' or description like '%" + keyword + "%') ORDER BY date DESC,isindex DESC limit ?,?";
                    selectArg = [begin, count];
                }else{
                    sSql = "SELECT id,title,keyword,description,date,menu FROM  cms where del!=1 and menu=? ORDER BY date DESC ,isindex DESC limit ?,?";
                    selectArg = [menu, begin, count];
                }
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
        let keyword = arg.keyword;
        if (arg) {
            if (menu === "index") {
                sSql = "SELECT count(*) AS total FROM  cms where isindex=1 and del!=1 ";
            }else if(menu === "search"){
                sSql = "SELECT count(*) AS total FROM  cms where del!=1 and (title like '%" + keyword + "%' or description like '%" + keyword + "%')";
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
                "INSERT INTO cms (id , title,keyword,description,content,menu,isindex,del,date) VALUES (?,?,?,?,?,?,?,?,?)",
                [id,arg.title,arg.keyword,arg.description,arg.content,arg.menu,arg.isindex,0,new Date()],
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
 * arg = {
 *          id:"",
            title:"标题",
            keyword :"关键字",
            description :"描述",
            content :"内容",
            menu :"菜单",
            isindex : "1"
        };
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
                "UPDATE cms SET  title=?,keyword=?,description=?,content=?,menu=?,isindex=? WHERE id=?",
                [arg.title,arg.keyword,arg.description,arg.content,arg.menu,arg.isindex,arg.id],
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
                "UPDATE cms SET  del=1 WHERE id=?",
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
