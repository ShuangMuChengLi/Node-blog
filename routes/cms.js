let express = require("express");
let router = express.Router();
let parallel = require("../service/util/async").parallel;
let menuDao = require("../dao/menu");
let menuCache = require("../cache/menu");
/* GET home page. */
router.get("/", async function(req, res, next) {
    let result = await parallel([
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
    res.render("cms", { menu:"cms" , menuList:result[0]});
});

module.exports = router;
