/**
 * Created by lin on 2017/5/11.
 */
let formidable = require("formidable");
let qs = require("querystring");//解析参数的库
let fs = require("fs");
let http = require("http");
let https = require("https");
let async = require("async");
const url = require("url");
let conf = require("../config/conf");// 图片服务器地址配置
const log4js = require("../service/log4js-service");
module.exports = function (routeReq, routeRes, next) {
    if (routeReq.query.action === "config") {
        routeRes.setHeader("Content-Type", "application/json");
        routeRes.redirect("/lib/ueditor/nodejs/config.json");
    } else if (routeReq.query.action === "catchimage") {
        function factory(remoteUrl) {
            return function (callbackfirst) {
                async.waterfall([
                    function(callback) {
                        let oUrl = url.parse(remoteUrl);
                        let fn = null;
                        let port = null;
                        if(oUrl.protocol === 'https:'){
                            fn = https;
                            port = oUrl.port || 443;
                        }else{
                            fn = http;
                            port = oUrl.port || 80;
                        }
                        let aPath = oUrl.pathname.split("/");
                        let filename = aPath[aPath.length - 1];
                        let req = fn.get({
                            host: oUrl.hostname,
                            path: oUrl.pathname,
                            port: port
                        }, function (res) {
                            let rawData = "";
                            res.setEncoding("binary");
                            res.on("data", (chunk) => {
                                rawData += chunk;
                            });
                            res.on("end", () => {
                                try {
                                    let data = new Buffer(rawData, "binary").toString("base64");
                                    callback(null,data, filename);
                                } catch (e) {
                                    callback(e);
                                    console.error(e.message);
                                }
                            });
                        });
                        req.on("error", (e) => {
                            callbackfirst(e);
                            console.log(`请求遇到问题: ${e.message}`);
                        });
                        req.on("timeout", () => {
                            let err = new Error();
                            err.code = "504";
                            err.message = "请求图片超时:";
                            callbackfirst(err);
                            console.log(`请求遇到问题: ${err.message}`);
                        });
                    }
                ], function (err, data,fileName) {
                    let base64Data = data;
                    let postData = {
                        data: base64Data,
                        filename: fileName
                    };
                    let sPostData = qs.stringify(postData);
                    let options = {
                        hostname: conf.fileServerIp,
                        port: conf.fileServerPort,
                        path: conf.fileServerPath,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Content-Length": Buffer.byteLength(sPostData)
                        }
                    };
                    let req = http.request(options, (res) => {
                        res.setEncoding("utf8");
                        let aResData = [];
                        res.on("data", (chunk) => {
                            aResData.push(chunk);
                        });
                        res.on("end", () => {
                            let resData = aResData.join("");
                            let data = resData.toString();
                            let jDate = JSON.parse(data);
                            let sResule = {};
                            if (jDate.code === "success") {
                                sResule.url = conf.fileServiceOrigin + jDate.path;
                                sResule.title = fileName;
                                sResule.source = remoteUrl;
                                sResule.state = "SUCCESS";
                                sResule.size = base64Data.length;
                            } else {
                                sResule.state = "Fail";
                                log4js.getLogger("errorLog").error(jDate);
                            }
                            callbackfirst(null,sResule);
                        });
                    });
                    req.on("error", (e) => {
                        callbackfirst(e);
                        console.log(`请求遇到问题: ${e.message}`);
                    });
                    req.on("timeout", () => {
                        let err = new Error();
                        err.code = "504";
                        err.message = "连接文件服务器超时:";
                        callbackfirst(err);
                        console.log(`请求遇到问题: ${err.message}`);
                    });
                    // 写入数据到请求主体
                    req.write(sPostData);
                    req.end();
                });
            };
        }
        let source = routeReq.body["source[]"];
        let aRemoteUrls = [];
        if (typeof source === "string") {
            aRemoteUrls.push(source);
        } else {
            aRemoteUrls = source;
        }
        let factorys = aRemoteUrls.map(factory);
        async.parallel(
            factorys,
            function (err, results) {
                if(err){
                    next(err);
                    return;
                }
                let result = {
                    list: results,
                    state: "SUCCESS"
                };
                routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
                routeRes.end(JSON.stringify(result));
            }
        );

    } else {
        function sentPicToServer(data, fileName) {
            let base64Data = data;
            let postData = {
                data: base64Data,
                filename: fileName
            };
            let sPostData = qs.stringify(postData);
            let options = {
                hostname: conf.fileServerIp,
                port: conf.fileServerPort,
                path: conf.fileServerPathname,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(sPostData)
                }
            };
            let req = http.request(options, (res) => {
                res.setEncoding("utf8");
                let aResData = [];
                res.on("data", (chunk) => {
                    aResData.push(chunk);
                });
                res.on("end", () => {
                    let resData = aResData.join("");
                    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
                    let data = resData.toString();
                    let jDate = JSON.parse(data);
                    let sResule = {};
                    if (jDate.code === "success") {
                        sResule.url = conf.fileServiceOrigin + jDate.path;
                        sResule.original = fileName;
                        sResule.state = "SUCCESS";
                    } else {
                        sResule.state = "Fail";
                    }
                    routeRes.end(JSON.stringify(sResule));
                });
            });
            req.on("error", (e) => {
                next(e);
                console.log(`请求遇到问题: ${e.message}`);
            });
            // 写入数据到请求主体
            req.write(sPostData);
            req.end();
        }

        let form = new formidable.IncomingForm();
        form.parse(routeReq, function (err, fields, files) {
        });
        form.on("file", function (name, file) {
            fs.readFile(file.path, function (err, data) {
                if (err) next(err);
                sentPicToServer(new Buffer(data).toString("base64"), file.name);
            });
        });
    }
};
