const assert = require("chai").assert;
describe("user", function() {
    it("getUserInfo", function(done) {
        const cms = require("../../dao/user");
        cms.getUserInfo("linchaoqun").then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
