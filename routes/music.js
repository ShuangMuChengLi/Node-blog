
const express = require("express");
const url = require("url");
const musicDao = require("../dao/music");
let parallel = require("../service/util/async").parallel;
let router = express.Router();
router.get("/", async function(routeReq, routeRes, next) {
    let sUrl = routeReq.url;
    let oUrl = url.parse(sUrl, true);
    let result = await parallel([
        async function () {
            let result = await musicDao.selectList(oUrl.query).catch((err)=>{
                next(err);
                return false;
            });
            if(!result){
                return false;
            }else{
                return result;
            }
        },
        async function () {
            let result = await musicDao.selectListTotal().catch((err)=>{
                next(err);
                return false;
            });
            if(!result){
                return false;
            }else{
                return result;
            }
        },
    ]);

    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    let respontData = {
        status:200,
        msg:"操作成功",
        data:result
    };
    let data = JSON.stringify(respontData);
    routeRes.end(data);
});
router.post("/", async function(routeReq, routeRes, next) {
    let arg = routeReq.body;
    let fn = null;
    if(arg.id){
        fn = musicDao.updateContent;
    }else{
        fn = musicDao.insertContent;
    }
    let result = await fn(arg).catch((err)=>{
        next(err);
        return false;
    });
    if(!result){
        return;
    }
    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    let respontData = {
        status:200,
        msg:"操作成功",
        data:result
    };
    let data = JSON.stringify(respontData);
    routeRes.end(data);
});
router.delete("/:id", async function(routeReq, routeRes, next) {
    let id = routeReq.params.id;
    let fn = musicDao.delContent;
    let result = await fn(id).catch((err)=>{
        next(err);
        return false;
    });
    if(!result){
        return;
    }
    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    let respontData = {
        status:200,
        msg:"操作成功"
    };
    let data = JSON.stringify(respontData);
    routeRes.end(data);
});
module.exports = router;
