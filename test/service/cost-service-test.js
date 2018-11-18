
describe("cost", function() {
    it("insert", function(done) {
        const Cost = require("../../service/Cost");
        let arg = {
            pid: "782c2635-b48e-4fae-807d-11af4ff6ef6b",
            title: "饼干",
            cost: 20
        };
        Cost.insert(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectListByPid", function(done) {
        const Cost = require("../../service/Cost");
        let arg = {
            id: "155e6ed9-f650-41bc-a5ea-2c5cdff299cd"
        };
        Cost.selectListByPid(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectSumCostByMonth", function(done) {
        const Cost = require("../../service/Cost");
        let arg = {
            yearAndMonth: "2018-10"
        };
        Cost.selectSumCostByMonth(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
