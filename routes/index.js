let express = require("express");
let _ = require("lodash");
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
        }
    ]).catch((err)=>{
        next(err);
        return false;
    });
    if(result){
        let pageInfo = page(result[1],params.page,params.size);
        return { list: result[0],menu:params.menu, keyword:params.keyword  ,pageInfo:pageInfo};
    }
}
async function getMenu(req, res, next){
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
}
async function getHtml(req, res, next){
    let result = await parallel([
        async function () {
            let data = await getList(req, res, next);
            if(data){
                return data;
            }else{
                return false;
            }
        },
        async function () {
            let data = await getMenu(req, res, next);
            if(data){
                return data;
            }else{
                return false;
            }
        }
    ]).catch((err)=>{
        next(err);
        return false;
    });
    if(result){
        let data = _.merge(result[0],{menuList:result[1]});
        res.render("index", data);
    }
}
async function getMenuJson(req, res, next){
    let data = await getMenu(req, res, next);
    if(data){
        res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
        res.end(JSON.stringify(data));
    }
}
async function getListJson(req, res, next){
    let data = await getList(req, res, next);
    if(data){
        res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
        res.end(JSON.stringify(data));
    }
}

router.get("/", getHtml);
router.get("/list/:menu/:page/:size", getHtml);
router.get("/list/:menu/:keyword/:page/:size", getHtml);
router.get("/list/:menu", getHtml);

router.get("/json/list", getListJson);
router.get("/json/list/:menu/:page/:size", getListJson);
router.get("/json/list/:menu/:keyword/:page/:size", getListJson);
router.get("/json/list/:menu", getListJson);

router.get("/menu", getMenuJson);
module.exports = router;
