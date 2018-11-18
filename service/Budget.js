const BudgetDao = require("../dao/Budget");
const moment = require("moment");
const _ = require("lodash");
module.exports = {
    async selectListByYearAndMonth(yearAndMonth){
        let result = await BudgetDao.selectListByYearAndMonth({
            year_and_month : yearAndMonth
        }).catch((err)=>{
            throw err;
        });
        if(!result){
            return [];
        }
        for(let item of result){
            item.budget = item.budget || 0;
            item.pre_surplus = item.pre_surplus || 0;
            item.sum_cost = item.sum_cost || 0;
            item.total = item.budget + item.pre_surplus;
            item.balance = item.total - item.sum_cost;
        }
        return result;
    },
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
    async insertBudget(arg){
        let result = await BudgetDao.insertBudget(arg).catch((err)=>{
            throw err;
        });
        if(!result){
            return false;
        }
        return result;
    }
};
