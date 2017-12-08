let express = require("express");
let router = express.Router();
let commentDao = require("../dao/commentDao");
let ipCount = require("../service/util/ipCount");
let get_ip = require('ipware')().get_ip;
/**
 * {
        nickname:"昵称",
        tel :"18850716271",
        comment :"评论",
        pid :"ea3f63b2-c5b0-444e-a695-978240494800"
    }
 @return
     { status: 200,
      msg: '操作成功',
      data: 'c6d9ef21-21e8-4857-bdc7-ffc37c43f09e' }
 */
router.post("/insertComment", async (routeReq, routeRes, next)=>{
    let ip = get_ip(routeReq).clientIp;
    let count = await ipCount.getIpCount(ip);
    if(count > 1){
        let err = new Error();
        err.code = 400;
        err.message = "短时间发送次数过多";
        next(err);
        return;
    }
    ipCount.addIpCount(ip);
    let arg = routeReq.body;
    let result = await commentDao.insertComment(arg).catch((err)=>{
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
