const request = require("supertest");
const assert = require("chai").assert;
describe("POST /user", function() {
    it("/login success", function(done) {
        let app = require("../../app");
        request(app)
            .post("/user/login")
            .send({
                username:"linchaoqun",
                password :"123456"
            })
            .expect("Content-Type", /json/)
            .then(response => {
                assert.equal(response.body.status,200);
                console.log(response.body);
                done();
            });
    });
    it("/login 密码错误", function(done) {
        let app = require("../../app");
        request(app)
            .post("/user/login")
            .send({
                username:"linchaoqun",
                password :"1"
            })
            .expect("Content-Type", /json/)
            .then(response => {
                assert.equal(response.body.status,401);
                assert.equal(response.body.msg,"密码错误");
                console.log(response.body);
                done();
            });
    });
    it("/login 请输入用户名", function(done) {
        let app = require("../../app");
        request(app)
            .post("/user/login")
            .send({
                username:"",
                password :"1"
            })
            .expect("Content-Type", /json/)
            .then(response => {
                assert.equal(response.body.status,401);
                assert.equal(response.body.msg,"请输入用户名");
                console.log(response.body);
                done();
            });
    });
    it("/login 请输入密码", function(done) {
        let app = require("../../app");
        request(app)
            .post("/user/login")
            .send({
                username:"linchaoqun",
                password :""
            })
            .expect("Content-Type", /json/)
            .then(response => {
                assert.equal(response.body.status,401);
                assert.equal(response.body.msg,"请输入密码");
                console.log(response.body);
                done();
            });
    });
});
