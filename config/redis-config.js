
let ENV = require("./env") ;
let redisConfig = {};
switch (ENV) {
    case "dev": {
        redisConfig = {
            "sessionStore": {
                "host": "localhost",
                "port": "6379",
                "db": 1,
                "ttl": 1800,
                "logErrors": true
            }
        };
        break
    }
    case "watch": {
        redisConfig = {
            "sessionStore": {
                "host": "localhost",
                "port": "6379",
                "db": 1,
                "ttl": 1800,
                "logErrors": true
            }
        };
        break
    }
    case "production": {
        redisConfig = {
            "sessionStore": {
                "host": "localhost",
                "port": "6379",
                "db": 1,
                "ttl": 1800,
                "logErrors": true,
                "pass":"g7845120"
            }
        };
        break
    }
}
module.exports = redisConfig;
