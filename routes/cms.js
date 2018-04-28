let express = require("express");
let router = express.Router();
let parallel = require("../service/util/async").parallel;
let RedisClient = require("../service/RedisClient").client;
let log4js = require("../service/log4js-service");
let menuDao = require("../dao/menu");
let cms = require("../dao/cms");
let menuCache = require("../cache/menu");
let pageHost = require("../config/host-conf");
let url = require("url");
let qs = require("querystring");//解析参数的库
/* GET home page. */
async function getPage(req, res, next) {
    let params = req.params;
    let id = params.id? params.id : "";
    let token = params.token;
    if(!token){
        res.redirect(pageHost + '/index.html/#/login');
        return;
    }else{
        let userInfo = await RedisClient.getAsync(token).catch((e)=>{
            log4js.getLogger("errorLog").error(e);
            res.redirect(pageHost + '/index.html/#/login');
            return false;
        });
        if(userInfo){
            let result = await parallel([
                function () {
                    let promise = new Promise(async (resolve,reject)=>{
                        let menu = [];
                        if(menuCache.menuList.length === 0){
                            menu = await menuDao.getMenu().catch((err)=>{
                                next(err);
                                reject();
                                return false;
                            });
                            if(menu){
                                menuCache.menuList = menu;
                            }else{
                                return;
                            }
                        }else{
                            menu = menuCache.menuList;
                        }
                        resolve(menu);
                    });
                    return promise;
                }
            ]).catch((err)=>{
                next(err);
            });
            res.render("cms", { menu:"cms" , menuList:result[0] ,id:id});
        }else{
            log4js.getLogger("errorLog").error("token不存在" + token);
            res.redirect(pageHost + '/index.html/#/login');
            return false;
        }
    }
}
router.get("/page/:token",getPage );
router.get("/page/:id/:token", getPage);
router.get("/content/:id/:token", async function(routeReq, routeRes, next) {
    let params = routeReq.params;
    let id = params.id?  params.id : "";
    let content = {};
    if(id){
        content = await cms.getContent(id).catch((err)=>{
            next(err);
            return false;
        });
        if(!content){
            return;
        }
    }
    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    let respontData = {
        status:200,
        msg:"操作成功",
        data:content
    };
    let data = JSON.stringify(respontData);
    routeRes.end(data);
});

module.exports = router;
