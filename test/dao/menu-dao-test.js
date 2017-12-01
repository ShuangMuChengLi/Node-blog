const assert = require("chai").assert;
describe("getMenu", function() {
    it("respond with array", function(done) {
        const menu = require("../../dao/menu");
        menu.getMenu().then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
