const assert = require("chai").assert;
describe("selectList", function() {
    it("respond with array", function(done) {
        const cms = require("../../../dao/cms");
        let info = {
            menu:"js",
            begin:10,
            count:1,
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
});
