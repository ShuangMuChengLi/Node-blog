let express = require("express");
let router = express.Router();
let url = require("url");
let qs = require("querystring");//解析参数的库
let parallel = require("../service/util/async").parallel;
let cmsDao = require("../dao/cms");
let menuDao = require("../dao/menu");
let menuCache = require("../cache/menu");
/* GET home page. */
router.get("/content.jsp", async function(req, res, next) {
    let arg = url.parse(req.url).query;
    //把参数转换成键值对，再从中拿值
    let query = qs.parse(arg);
    let menu = query.menu;
    let id = query.id;
    let result = await parallel([
        function () {
            let promise = new Promise(async (resolve,reject)=>{
                let content = await cmsDao.getContent(id).catch((err)=>{
                    next(err);
                    reject();
                });
                resolve(content);
            });
            return promise;
        },
        function () {
            let promise = new Promise(async (resolve,reject)=>{
                let menu = [];
                if(menuCache.menuList.length === 0){
                    menu = await menuDao.getMenu().catch((err)=>{
                        next(err);
                        reject();
                    });
                    menuCache.menuList = menu;
                }else{
                    menu = menuCache.menuList;
                }
                resolve(menu);
            });
            return promise;
        },
    ]).catch((err)=>{
        next(err);
    });
    res.render("content", { content: result[0] , menu:menu , menuList:result[1]});
});

module.exports = router;
