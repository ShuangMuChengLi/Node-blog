let ENV = require("./env") ;
let pageHost = "";
switch (ENV) {
    case "dev": {
        pageHost = "https://localhost:8080"
        break
    }
    case "production": {
        pageHost = "https://www.linchaoqun.com"
        break
    }
}
module.exports = pageHost;
