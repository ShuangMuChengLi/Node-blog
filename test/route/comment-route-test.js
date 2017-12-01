const request = require("supertest");
const assert = require("chai").assert;
describe("POST /comment", function() {
    it("/insertComment", function(done) {
        let app = require("../../app");
        request(app)
            .post("/comment/insertComment")
            .send({
                nickname:"昵称",
                tel :"18850716271",
                comment :"评论",
                pid :"ea3f63b2-c5b0-444e-a695-978240494800"
            })
            .expect("Content-Type", /json/)
            .then(response => {
                assert.equal(response.body.status,200);
                console.log(response.body);
                done();
            });
    });
});
