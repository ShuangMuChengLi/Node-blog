const assert = require("chai").assert;
describe("util-test", function() {
    it("pageInfo", function(done) {
        const page = require("../../../service/util/util").page;
        console.log(page(10,1,5));
        done();
    });
});
