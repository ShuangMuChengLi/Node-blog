let express = require("express");
let router = express.Router();
let url = require("url");
let qs = require("querystring");//解析参数的库
let parallel = require("../service/util/async").parallel;
let cmsDao = require("../dao/cms");
let menuDao = require("../dao/menu");
let commentDao = require("../dao/commentDao");
let menuCache = require("../cache/menu");
let moment = require("moment");
/* GET home page. */
router.get("/", async function(req, res, next) {
    let arg = url.parse(req.url).query;
    //把参数转换成键值对，再从中拿值
    let query = qs.parse(arg);
    let menu = query.menu;
    let id = query.id;
    let result = await parallel([
        function () {
            let promise = new Promise(async (resolve,reject)=>{
                let comment = await commentDao.selectComment("mom").catch((err)=>{
                    next(err);
                    reject();
                });
                for(let i=0;i<comment.length ; i++){
                    if(comment[i].date){
                        comment[i].date = moment(comment[i].date).format("YYYY-MM-DD  HH:mm:ss");
                    }else{
                        comment[i].date = "";
                    }
                }
                resolve(comment);
            });
            return promise;
        },
    ]).catch((err)=>{
        next(err);
    });
    res.render("note", {comment:result[0]});
});

module.exports = router;
