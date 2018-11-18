const assert = require("chai").assert;
const moment = require("moment");
describe("cost", function() {
    it("insert", function(done) {
        const cost = require("../../dao/cost");
        let arg = {
            pid: "782c2635-b48e-4fae-807d-11af4ff6ef6b",
            title: "饼干",
            cost: 20
        };
        cost.insert(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectBudgetByYearAndMonthAndType", function(done) {
        const cost = require("../../dao/cost");
        let arg = {
            id: "155e6ed9-f650-41bc-a5ea-2c5cdff299cd"
        };

        cost.selectListByPid(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectSumCostByMonth", function(done) {
        const cost = require("../../dao/cost");
        let arg = {
            yearAndMonth: "2018-10"
        };

        cost.selectSumCostByMonth(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
