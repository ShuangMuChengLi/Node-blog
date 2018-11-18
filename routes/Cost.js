
const express = require("express");
const moment = require("moment");
const url = require("url");
const CostService = require("../service/Cost");
let parallel = require("../service/util/async").parallel;
let router = express.Router();
router.get("/:id", async function(routeReq, routeRes, next) {
    let id = routeReq.params.id;
    let result = await CostService.selectListByPid({id}).then((data)=>{
        return data;
    }).catch((err)=>{
        next(err);
        return false;
    });
    if(!result)return;
    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    let respontData = {
        status:200,
        msg:"操作成功",
        data:result
    };
    let data = JSON.stringify(respontData);
    routeRes.end(data);
});
router.get("/sum/:yearAndMonth", async function(routeReq, routeRes, next) {
    let yearAndMonth = routeReq.params.yearAndMonth;
    let result = await CostService.selectSumCostByMonth({yearAndMonth}).then((data)=>{
        return data;
    }).catch((err)=>{
        next(err);
        return false;
    });
    if(!result)return;
    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    let respontData = {
        status:200,
        msg:"操作成功",
        data:result
    };
    let data = JSON.stringify(respontData);
    routeRes.end(data);
});
/**
 * 添加消费
 * {
            pid: "782c2635-b48e-4fae-807d-11af4ff6ef6b",
            title: "饼干",
            cost: 20
        };
 */
router.put("/", async function(routeReq, routeRes, next) {
    let arg = routeReq.body;

    let result = await CostService.insert(arg).then((data)=>{
        return data;
    }).catch((err)=>{
        next(err);
        return false;
    });
    if(!result)return;
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
