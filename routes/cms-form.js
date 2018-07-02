
const express = require("express");
const cmsDao = require("../dao/cms");
let router = express.Router();
router.post("/addOrUpdate", async function(routeReq, routeRes, next) {
    let arg = routeReq.body;
    let fn = null;
    if(arg.id){
        fn = cmsDao.updateContent;
    }else{
        fn = cmsDao.insertContent;
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
    let fn = cmsDao.delContent;
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
