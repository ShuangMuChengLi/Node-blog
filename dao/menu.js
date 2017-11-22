
/**
 * Created by gequn06 on 2016/11/21.
 */
let db = require("../config/db");
exports.select = function (req,res,fn){
    let sSql = "SELECT * FROM menu ORDER BY iOrder ASC";
    db.query(
        sSql,
        [],
        function(err , rows){
            if (err) throw err;
            fn(rows);
        }
    );
};
