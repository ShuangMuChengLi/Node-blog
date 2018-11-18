
const express = require("express");
const moment = require("moment");
const url = require("url");
const BudgetDao = require("../dao/Budget");
const BudgetService = require("../service/Budget");
let parallel = require("../service/util/async").parallel;
let router = express.Router();
router.get("/:yearAndMonth", async function(routeReq, routeRes, next) {
    let yearAndMonth = routeReq.params.yearAndMonth;
    let result = await BudgetService.selectListByYearAndMonth(yearAndMonth).then((data)=>{
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
 * 添加预算
 */
router.put("/", async function(routeReq, routeRes, next) {
    let arg = routeReq.body;
    arg.surplus = 0;

    let result = await BudgetService.insertBudget(arg).then((data)=>{
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
 * 根据上月生成预算
 *  arg = {
                surplus:item.balance,
                id:item.id
            };
 */
router.post("/", async function(routeReq, routeRes, next) {
    let arg = routeReq.body;
    let result = await BudgetService.createBudget(arg.yearAndMonth).then((data)=>{
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
