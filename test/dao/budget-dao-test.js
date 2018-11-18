const assert = require("chai").assert;
const moment = require("moment");
describe("cost", function() {
    it("insertBudget", function(done) {
        const budget = require("../../dao/budget");
        let arg = {
            type: "饮料",
            budget: 100,
            year_and_month: "2018-02",
            surplus: 20,
        };
        budget.insertBudget(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectBudgetByYearAndMonthAndType", function(done) {
        const budget = require("../../dao/budget");
        let yearAndMonth = "2018-03";
        let preMonth = moment(yearAndMonth, "YYYY-MM").subtract(1, 'months').format("YYYY-MM");
        let arg = {
            type: "饮料",
            year_and_month:preMonth
        };

        budget.selectBudgetByYearAndMonthAndType(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
    it("selectListByYearAndMonth", function(done) {
        const budget = require("../../dao/budget");
        let arg = {
            year_and_month:"2018-10"
        };

        budget.selectListByYearAndMonth(arg).then((data)=>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
