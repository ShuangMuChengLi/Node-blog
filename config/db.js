/**
 * Created by gequn06 on 2016/11/19.
 */
let mysql = require("mysql");
module.exports =  mysql.createPool({
    host:     "localhost",
    user:     "xxx",
    password: "xxx",
    database: "blog"
});
