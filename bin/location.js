var express = require('express');
var app = express();
let http = require("http");
app.use("/",function (req,res) {
    res.redirect('https://www.linchaoqun.com');
})
let server = http.createServer(app);
server.listen(80);
