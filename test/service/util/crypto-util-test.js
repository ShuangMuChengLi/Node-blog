const assert = require("chai").assert;
describe("util-test", function() {
    it("create", function() {
        let cryptoUtil = require("../../../service/util/crypto-util");
        let hash = cryptoUtil.create("123456");
        console.log(hash);
        assert.equal(hash , "a5bdbaacc57a9f2a85ee9f69a13f9914a9e61b84e6c6519edc1aa8beadd80136")
    });
});
