const assert = require("chai").assert;
describe("async-test", function() {
    it("parallel", function(done) {
        const parallel = require("../../../service/util/async").parallel;
        let console = require("console");
        let fn = async function () {
            console.log(2)
        };
        fn().then((data)=>{
            console.log(data);
            done();
        }).catch((err)=>{
            console(err);
            done();
        });
    });
});
