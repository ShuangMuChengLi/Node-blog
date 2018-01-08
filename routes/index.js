let express = require("express");
let parallel = require("../service/util/async").parallel;
let page = require("../service/util/util").page;
let cmsDao = require("../dao/cms");
let menuDao = require("../dao/menu");
let router = express.Router();
let menuCache = require("../cache/menu");
async function getList(req, res, next) {
    if(req.host === "m.linchaoqun.com"){
        res.writeHead(301, {'Location': '/note'});
        res.end();
        return;
    }
    let params = req.params;
    params.page = params.page?  parseInt(params.page) : 1;
    params.menu = params.menu?  params.menu : "index";
    if(!params.size){
        if(params.menu === "search" || params.menu === "index"){
            params.size = 50;
        }else{
            params.size = 10;
        }
    }

    params.keyword = params.keyword?  params.keyword : "";
    let begin = (params.page - 1) * params.size;
    let arg = {
        begin : begin,
        count:params.size,
        menu:params.menu,
        keyword:params.keyword,
    };
    let result = await parallel([
        function () {
            let promise = new Promise(async (resolve,reject)=>{
                let list = await cmsDao.selectList(arg).catch((err)=>{
                    next(err);
                    reject();
                });
                resolve(list);
            });
            return promise;
        },
        function () {
            let promise = new Promise(async (resolve,reject)=>{
                let total = await cmsDao.selectListTotal(arg).catch((err)=>{
                    next(err);
                    reject();
                });
                resolve(total);
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
    let pageInfo = page(result[1],params.page,params.size);
    res.render("index", { list: result[0],menu:params.menu, keyword:params.keyword  ,pageInfo:pageInfo , menuList:result[2]});
}
/* GET home page. */
router.get("/", getList);
/* GET home page. */
router.get("/list/:menu/:page/:size", getList);
router.get("/list/:menu/:keyword/:page/:size", getList);
router.get("/list/:menu", getList);
module.exports = router;
