const fileServerPort = "6003";// 文件服务器
const fileServerIp = "localhost"; // 文件服务器IP
let ENV = require("./env") ;
let pageHost = "";
let fileServerHostname = null;
switch (ENV) {
    case "dev": {
        fileServerHostname = "http://www.linchaoqun.com";
        break
    }
    case "watch": {
        fileServerHostname = "http://localhost";
        break
    }
    case "production": {
        fileServerHostname = "http://www.linchaoqun.com";
        break
    }
}
const fileServiceOrigin = fileServerHostname + ":" + fileServerPort;
const fileServerPathname =  "/upload";
module.exports={
    fileServerIp,
    fileServerPort,
    fileServerPathname,
    fileServiceOrigin,
    fileServerPath:fileServerPathname,
};
