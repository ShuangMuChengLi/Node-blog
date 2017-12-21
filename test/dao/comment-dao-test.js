const assert = require("chai").assert;
describe("comment", function() {
    it("insertComment", function(done) {
        const commentDao = require("../../dao/commentDao");
        let arg = {
            nickname:"昵称",
            tel :"18850716271",
            comment :"评论",
            pid :"ea3f63b2-c5b0-444e-a695-978240494800"
        };
        commentDao.insertComment(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectComment", function(done) {
        const commentDao = require("../../dao/commentDao");
        let arg = {
            id :"ea3f63b2-c5b0-444e-a695-978240494800"
        };
        commentDao.selectComment(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectAllComment", function(done) {
        const commentDao = require("../../dao/commentDao");
        commentDao.selectAllComment().then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
