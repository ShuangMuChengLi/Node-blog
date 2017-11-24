/**
 * Created by gequn06 on 2016/11/19.
 */
let mysql = require("mysql");
module.exports =  mysql.createPool({
    host:     "120.78.152.50",
    user:     "lin",
    password: "g7845120",
    database: "blog"
});
