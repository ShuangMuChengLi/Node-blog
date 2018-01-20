let get_ip = require("ipware")().get_ip;
const logDao = require("../../dao/logDao");
const log4js = require("../../service/log4js-service");
module.exports = (req, res, next) =>{
    let ip = get_ip(req).clientIp;
    let arg = {
        ip:ip,
        page : req.url
    };
    log4js.getLogger("accessLog").info({
        ip:ip,
        page : req.url
    });
    logDao.insertLog(arg).catch((err)=>{
        log4js.getLogger("errorLog").error(err);
    });
    next(null,req, res);
};
