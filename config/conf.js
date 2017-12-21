const fileServerPort = "6003";// 文件服务器
const fileServerIp = "localhost"; // 文件服务器IP
// const fileServerHostname = "http://localhost"; // 文件服务器域名
const fileServerHostname = "http://www.linchaoqun.com"; // 文件服务器域名
const fileServiceOrigin = fileServerHostname + ":" + fileServerPort;
const fileServerPathname =  "/upload";
module.exports={
    fileServerIp,
    fileServerPort,
    fileServerPathname,
    fileServiceOrigin,
    fileServerPath:fileServerPathname,
};
