let express = require("express");
let parallel = require("../service/util/async").parallel;
let page = require("../service/util/util").page;
let cmsDao = require("../dao/cms");
let menuDao = require("../dao/menu");
let router = express.Router();
let menuCache = require("../cache/menu");
async function getList(req, res, next) {
    let params = req.params;
    params.page = params.page?  parseInt(params.page) : 1;
    params.size = params.size? parseInt(params.size) : 8;
    params.menu = params.menu?  params.menu : "index";
    let begin = (params.page - 1) * params.size;
    let arg = {
        begin : begin,
        count:params.size,
        menu:params.menu
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
    res.render("index", { list: result[0],menu:params.menu,pageInfo:pageInfo , menuList:result[2]});
}
/* GET home page. */
router.get("/", getList);
/* GET home page. */
router.get("/list/:menu/:page/:size", getList);

module.exports = router;
