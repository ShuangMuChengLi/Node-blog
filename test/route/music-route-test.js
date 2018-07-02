const request = require("supertest");
const assert = require("chai").assert;
describe("music", function() {
    it("get", function(done) {
        let app = require("../../app");
        let begin = 1,
            count = 1;
        request(app)
            .get("/music/?begin=" + begin + "&count=" + count)
            .expect("Content-Type", /json/)
            .then(response => {
                assert.equal(response.body.status,200);
                let result = response.body.data;
                console.log(result[0],result[1]);
                done();
            });
    });
});
