try {
    require("fs").mkdirSync("../log");
} catch (e) {
    if (e.code !== "EEXIST") {
        console.error("Could not set up log directory, error was: ", e);
        process.exit(1);
    }
}
let log4js = require("log4js");
log4js.configure({
    "appenders": {
        "app": {
            "type": "dateFile",
            "filename": "log/app.log"
        },
        "errorLog": {
            "type": "dateFile",
            "filename": "log/errorLog.log"
        },
        "accessLog": {
            "type": "dateFile",
            "filename": "log/accessLog.log"
        }
    },
    "categories": {
        "default": {
            "appenders": [
                "app","errorLog","accessLog"
            ],
            "level": "info"
        },
        "errorLog": {
            "appenders": [
                "errorLog"
            ],
            "level": "error"
        },
        "accessLog": {
            "appenders": [
                "accessLog"
            ],
            "level": "info"
        }
    }
});
module.exports = log4js;
