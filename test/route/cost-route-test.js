const request = require("supertest");
const assert = require("chai").assert;
describe("/cost", function() {
    it("get by yearAndMonth", function(done) {
        let app = require("../../app");
        request(app)
            .get("/cost/sum/2018-10")
            .then(response => {
                assert.equal(response.body.status,200);
                console.log(response.body);
                done();
            });
    });
});
