
describe("cost", function() {
    it("insertBudget", function(done) {
        const budget = require("../../service/budget");
        let yearAndMonth = "2018-10";
        budget.createBudget(yearAndMonth).then((data)=>{
            // console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        });
    });
});
