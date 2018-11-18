const CostDao = require("../dao/cost");
const moment = require("moment");
const _ = require("lodash");
module.exports = {
    async createBudget(yearAndMonth){
        let preMonth = moment(yearAndMonth, "YYYY-MM").subtract(1, 'months').format("YYYY-MM");
        let list = await this.selectListByYearAndMonth(preMonth);
        console.log(list)
        for(let item of list){
            let updateItem = {
                surplus:item.balance,
                id:item.id
            };
            BudgetDao.update(updateItem);
            let temp = _.clone(item);
            temp.year_and_month = yearAndMonth;
            temp.surplus = 0;
            BudgetDao.insertBudget(temp);
        }
        return true;
    },
    async insert(arg){
        let result = await CostDao.insert(arg).catch((err)=>{
            throw err;
        });
        if(!result){
            return false;
        }
        return result;
    },
    async selectListByPid(arg){
        let result = await CostDao.selectListByPid(arg).catch((err)=>{
            throw err;
        });
        if(!result){
            return false;
        }
        return result;
    },
    async selectSumCostByMonth(arg){
        let result = await CostDao.selectSumCostByMonth(arg).catch((err)=>{
            throw err;
        });
        if(!result){
            return false;
        }
        return result;
    },
};
