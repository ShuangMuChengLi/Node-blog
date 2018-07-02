const assert = require("chai").assert;
const music = require("../../dao/music");
describe("cms", function () {
    it("selectList", function (done) {
        let info = {
            begin: 1,
            count: 3
        };
        music.selectList(info).then((data) => {
            console.log(data);
            done();
        }, (err) => {
            console.log(err);
            done();
        });
    });
    it("total", function (done) {
        let info = {
            menu: "index"
        };
        music.selectListTotal(info).then((data) => {
            console.log(data);
            done();
        }, (err) => {
            console.log(err);
            done();
        });
    });
    it("insertContent", function (done) {
        let arg = {};
        arg.title = "月满西楼";
        arg.singer = "龚钥";
        arg.url = "https";
        arg.sort = 1;
        music.insertContent(arg).then((data) => {
            console.log(data);
            let arg = {};
            arg.id = data;
            arg.title = "月满西楼1";
            arg.singer = "龚钥";
            arg.url = "http";
            arg.sort = 2;
            music.updateContent(arg).then((data) => {
                console.log(data);
                music.delContent(data).then((data) => {
                    console.log(data);
                    done();
                }, (err) => {
                    console.log(err);
                    done();
                });
            }, (err) => {
                console.log(err);
                done();
            });
        }, (err) => {
            console.log(err);
            done();
        });
    });
    it("sort", function (done) {
        let arg = {};
        arg.title = "月满西楼";
        arg.singer = "龚钥";
        arg.url = "https";
        arg.sort = 1;
        music.insertContent(arg).then((data) => {
            console.log(data);
            let arg = {};
            arg.id = data;
            arg.sort = 5;
            music.sortMusic(arg).then((data) => {
                console.log(data);
                done();
            }, (err) => {
                console.log(err);
                done();
            });
        }, (err) => {
            console.log(err);
            done();
        });
    });
});
