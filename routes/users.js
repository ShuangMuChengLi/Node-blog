var express = require('express');
var url = require('url');
var querystring = require('querystring');
var router = express.Router();
let user = require("../dao/user");
let cryptoUtil = require("../service/util/crypto-util");
let RedisClient = require("../service/RedisClient").client;
const uuidV4 = require('uuid/v4');
/* GET users listing. */
router.post('/login', async function(req, res, next) {
    let data = req.body;
    if(!data.username){
        let err = {};
        err.code = 401;
        err.message = "请输入用户名";
        next(err);
        return;
    }
    if(!data.password){
        let err = {};
        err.code = 401;
        err.message = "请输入密码";
        next(err);
        return;
    }

    let userInfo = await user.getUserInfo(data.username).catch(()=>{
        return false;
    });
    if(userInfo){
        let password = cryptoUtil.create(data.password);
        if(password === userInfo.password){
            let userInfoKey = uuidV4();
            let userInfo = JSON.stringify(data);
            let result = await RedisClient.setAsync(userInfoKey, userInfo ,"ex",60 * 60 * 12).catch((e)=>{
                let err = {};
                err.code = e.code;
                err.message = e.message;
                next(err);
                return;
            });
            if(result){
                res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
                req.session.login = true;
                console.log(req.session.login);
                let respontData = {
                    status:200,
                    msg:"登录成功",
                    token:userInfoKey
                };
                let respontDataSting = JSON.stringify(respontData);
                res.end(respontDataSting);
            }
        }else{
            let err = {};
            err.code = 401;
            err.message = "密码错误";
            next(err);
            return;
        }
    }else{
        let err = {};
        err.code = 401;
        err.message = "该用户不存在";
        next(err);
        return;
    }
});

module.exports = router;
