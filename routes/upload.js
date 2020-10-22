/**
 * Created by lin on 2017/5/10.
 */
let formidable = require("formidable");
let qs = require("querystring");//解析参数的库
let express = require("express");
let fs = require("fs");
let https=require("https");
let conf = require("../config/conf");
let router = express.Router();
/* GET users listing. */
router.post("/", function(routeReq, routeRes, next) {
    let form = new formidable.IncomingForm();
    form.parse(routeReq, function (err, fields, files) {
    });
    form.on("file", function(name, file) {
        fs.readFile(file.path,  function (err,data) {
            if(err)next(err);
            let base64Data = new Buffer(data).toString("base64");
            let postData = {
                data:base64Data,
                filename:file.name
            };
            let sPostData = qs.stringify(postData);
            let options = {
                hostname: conf.fileServerIp,
                port: conf.fileServerPort,
                path:conf.fileServerPathname,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(sPostData)
                }
            };

            let req = https.request(options, (res) => {
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
                    if (jDate.code === "success") {
                        jDate.path = conf.fileServiceOrigin + jDate.path;
                    } else {
                        jDate.path = "";
                    }
                    routeRes.end(JSON.stringify(jDate));
                });
            });

            req.on("error", (e) => {
                console.log(`请求遇到问题: ${e.message}`);
            });

            // 写入数据到请求主体
            req.write(sPostData);
            req.end();
        });
    });
});

module.exports = router;
