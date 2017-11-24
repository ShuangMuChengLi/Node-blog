const assert = require("chai").assert;
describe("cms", function() {
    it("selectList", function(done) {
        const cms = require("../../../dao/cms");
        let info = {
            menu:"js",
            begin:10,
            count:3,
            isIndex:false
        };
        cms.selectList(info).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("searchList", function(done) {
        const cms = require("../../../dao/cms");
        let info = {
            menu:"search",
            begin:1,
            count:3,
            keyword:"gzip"
        };
        cms.selectList(info).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("total", function(done) {
        const cms = require("../../../dao/cms");
        let info = {
            menu:"index"
        };
        cms.selectListTotal(info).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("search-total", function(done) {
        const cms = require("../../../dao/cms");
        let info = {
            menu:"search",
            keyword:"js"
        };
        cms.selectListTotal(info).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("getContent", function(done) {
        const cms = require("../../../dao/cms");
        cms.getContent("1509528630774").then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("insertContent", function(done) {
        const cms = require("../../../dao/cms");
        let arg = {
            title:"标题",
            keyword :"关键字",
            description :"描述",
            content :"内容",
            menu :"菜单",
            isindex : "1"
        };
        cms.insertContent(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
