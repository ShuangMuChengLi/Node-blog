let get_ip = require("ipware")().get_ip;
const logDao = require("../../dao/logDao");
module.exports = async (req, res, next) =>{
    let ip = get_ip(req).clientIp;
    let arg = {
        ip:ip,
        page : req.url
    };
    let result = await logDao.insertLog(arg).catch((err)=>{
        next(err,req, res);
        return false;
    });
    if(result){
        next(null,req, res);
    }
};
