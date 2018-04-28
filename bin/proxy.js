/**
 * Created by lin on 2017/8/24.
 */
let https = require('https'),
    fs = require('fs'),
    httpProxy = require('http-proxy');
var options = {
    key  : fs.readFileSync('../cert/214593159680478.key'),
    cert : fs.readFileSync('../cert/214593159680478.pem')
}
//
// Create a proxy server with custom application logic
//
let proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
let server = https.createServer(options,function(req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, { target: 'http://localhost' });
});
server.listen(443);
