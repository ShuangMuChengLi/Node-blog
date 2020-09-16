/**
 * Created by gequn06 on 2016/11/19.
 */
// let mysql = require("mysql");
// module.exports =  mysql.createPool({
//     host:     "localhost",
//     user:     "xxx",
//     password: "xxx",
//     database: "blog"
// });
// let mysql = require("mysql");
// module.exports =  mysql.createPool({
//     host:     "localhost",
//     user:     "root",
//     password: "g7845120",
//     database: "blog"
// });

let mysql = require("mysql");
module.exports =  mysql.createPool({
    host:     "www.linchaoqun.com",
    user:     "root",
    password: "g7845120",
    database: "blog"
});
