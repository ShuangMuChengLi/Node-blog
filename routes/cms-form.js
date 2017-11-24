
const express = require("express");
const cmsDao = require("../dao/cms");
let router = express.Router();
router.post("/", async function(routeReq, routeRes, next) {
    let arg = routeReq.body;
    let result = await cmsDao.insertContent(arg).catch((err)=>{
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

module.exports = router;
