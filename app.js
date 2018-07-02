let express = require("express");
let path = require("path");
let url = require("url");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let lessMiddleware = require("less-middleware");
const log4js = require("./service/log4js-service");
let index = require("./routes/index");
let note = require("./routes/note");
let content = require("./routes/content");
let cms = require("./routes/cms");
let comment = require("./routes/comment");
const upload = require("./routes/upload");
const user = require("./routes/users");
const music = require("./routes/music");
let ueditor = require("./routes/ueditor-route");
let submitCms = require("./routes/cms-form");
let logMiddleware = require("./service/middleware/log");
let console = require("console");
let compression = require("compression");
const session = require("express-session");
const connectRedis = require("connect-redis");
let RedisClient = require("./service/RedisClient").client;
const redisConfig = require("./config/redis-config.js");// redis配置
let cors = require('cors');
let corsOptions = {
    origin: '*'
};
let app = express();

const RedisStrore = connectRedis(session);
app.use(session({
    secret: "sessiontest",//与cookieParser中的一致
    resave: false,
    saveUninitialized: true,
    store: new RedisStrore(redisConfig.sessionStore)
}));

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: false}));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "index.ico")));
const env = require("./config/env");
let open = require("open");
let opened = false;
if (env === "dev") {
    let webpack = require("webpack");
    let webpackConfig = require("./webpack.dev.config.js");
    let compiler = webpack(webpackConfig);
    compiler.apply(new webpack.ProgressPlugin(function (percentage, msg) {
        console.log(parseInt(percentage * 100) + '%', msg);
        if (percentage === 1 && !opened) {
            opened = true;
            open("https://localhost/");
        }
    }));
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath // 大部分情况下和 `output.publicPath`相同
    }));
    // app.use(require('webpack-hot-middleware')(compiler,{
    //     log: false
    // }));
} else {
    app.use(compression());// gzip压缩
}
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/cms.html", async function (req, res, next) {
    let obj = url.parse(req.url, true);
    if (req.session.login) {
        next();
    } else {
        if (obj.query && obj.query.token) {
            let userInfo = await RedisClient.getAsync(obj.query.token);
            if(userInfo){
                req.session.login = true;
                next();
            }
        }else{
            res.redirect("/login.html");
            let err = new Error("please login");
            err.status = 302;
            next(err);
        }
    }
});

// app.use(lessMiddleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "upload")));
app.use(express.static(path.join(__dirname, "ueditor")));
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "node_modules")));


app.use(logMiddleware);
app.use("/html/cms", content);
app.use("/cmsForm", submitCms);
app.use("/music", music);
app.use("/comment", comment);
app.use("/upload", upload);
app.use("/ueditor/ue", ueditor);
app.use("/cms", cms);
app.use("/note", note);
app.use("/user", user);
app.use("/", index);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    if (req.headers.accept.match("image")) {
        next();
        return;
    }
    let err = new Error("Not Found" + req.url);
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.error("Something went wrong:", err);
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get("env") === "development" ? err : {};
    //
    // // render the error page
    // res.status(err.status || 500);
    // res.render("error");
    res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    console.info(err);
    log4js.getLogger("errorLog").error(err);
    let resule = {
        status: err.code,
        msg: err.message,
    };
    res.end(JSON.stringify(resule));
});

module.exports = app;
