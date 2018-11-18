<template>
    <div>
        <cms-left ></cms-left>
        <div class="main" >
            <div class="main-inner clearfix">
                <el-form :inline="true"  class="list-form clearfix">
                    <el-date-picker
                        v-model="yearMonth"
                        type="month"
                        @change="monthChange"
                        placeholder="选择月">
                    </el-date-picker>

                    <el-form-item>
                        <el-button type="success" @click="addTypeDialogShow">添加类别</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" v-if="nowIsNull" @click="createBudget">生成预算</el-button>
                    </el-form-item>
                    <span class="bill-info">本月已开销：{{sumCost}}</span>
                </el-form>
                <el-alert
                    v-if="nowIsNull"
                    title="本月预算未生成，展示的是上月预算，请根据上月预算生成本月预算"
                    type="warning"></el-alert>
                <el-table
                    class="list-table"
                    :row-class-name="rowStyle"
                    :data="list">
                    <el-table-column
                        prop="type"
                        label="类别">
                    </el-table-column>
                    <el-table-column
                        prop="pre_surplus"
                        label="上月结余">
                    </el-table-column>
                    <el-table-column
                        prop="total"
                        width="200"
                        label="总额">
                    </el-table-column>
                    <el-table-column
                        prop="budget"
                        width="200"
                        label="预算">
                    </el-table-column>
                    <el-table-column
                        prop="sum_cost"
                        width="200"
                        label="开销">
                    </el-table-column>
                    <el-table-column
                        prop="balance"
                        width="200"
                        label="余额">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">

                            <el-button
                                size="mini"
                                @click.stop="addCostDialogShow(scope.row)">添加消费</el-button>
                            <!--<el-button-->
                                <!--size="mini"-->
                                <!--@click.stop="editConsume(scope.$index, scope.row)">编辑</el-button>-->
                            <el-button
                                size="mini"
                                @click.stop="costDetailDialogShow(scope.row)">消费明细</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="添加类别" :visible.sync="addTypeVisible">
            <el-form :model="typeForm">
                <el-form-item label="类别" >
                    <el-input v-model="typeForm.type"></el-input>
                </el-form-item>
                <el-form-item label="预算" >
                    <el-input v-model="typeForm.budget" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addTypeDialogHide">取 消</el-button>
                <el-button type="primary" @click="typeDialogSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加消费" :visible.sync="addCostVisible">
            <el-form :model="costForm">
                <el-form-item label="类别" >
                    <el-input v-model="costForm.title"></el-input>
                </el-form-item>
                <el-form-item label="消费" >
                    <el-input v-model="costForm.cost"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="costDialogHide">取 消</el-button>
                <el-button type="primary" @click="costDialogSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="消费明细" :visible.sync="costDetailDialogVisible">
            <el-table :data="costDetailList">
                <el-table-column property="title" label="名称" width="150"></el-table-column>
                <el-table-column property="cost" label="金额" width="200"></el-table-column>
                <el-table-column label="日期">
                    <template slot-scope="scope">
                        {{getDate(scope.row.create_time)}}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    let axios = require("axios");
    let moment = require("moment");
    let _ = require("lodash");
    export default {
        created() {

        },
        mounted() {
            this.init();
        },
        beforeDestroy(){
        },
        directives: {},
        components: {
            "cms-left": () => import('./common/cms-left.vue'),
        },
        data() {
            return {
                now:null,
                height :0,
                list:[
                ],
                yearMonth:new Date(),
                addTypeVisible:false,
                addCostVisible:false,
                typeDialogHandleType:null,
                costDislogHandleItem:null,
                typeForm:{
                    year_and_month:null,
                    type:"",
                    budget:0
                },
                costForm:{
                    title:"",
                    cost:0,
                    pid:""
                },
                nowIsNull:false,
                costDetailDialogVisible:false,
                costDetailList:[],
                sumCost:0
            }
        },
        computed:{
            yearMonthString(){
                return moment(this.yearMonth).format("YYYY-MM");
            }
        },
        methods:{
            addConsume(){

            },
            addTypeDialogShow(){
                this.typeForm = {
                    year_and_month:null,
                    type:"",
                    budget:0
                };
                this.addTypeVisible = true;
                this.typeDialogHandleType = "add";
            },
            addTypeDialogHide(){
                this.addTypeVisible = false;
                this.typeDialogHandleType = null;
            },
            addCostDialogShow(item){

                this.costForm = {
                    title:"",
                    cost:0,
                    pid:""
                };
                this.addCostVisible = true;
                this.costDislogHandleItem = item;
            },
            async createBudget(){
                let yearAndMonth = this.yearMonthString;
                let result =  await axios.post('/budget/',{yearAndMonth}).then(response => {
                    if(response.data.status && response.data.status === 200){
                        return response.data.data;
                    }else{
                        this.$message.error(response.data.msg);
                        return false;
                    }
                }, response => {
                    this.$message.error(response.data.msg);
                    return false;
                });
                if(result){
                    let list = await this.getList(yearAndMonth);
                    if(list && list.length){
                        this.nowIsNull = false;
                        this.list = list;
                    }else{
                        this.nowListIsNoneFn();
                    }
                }
            },
            async costDetailDialogShow(item){
                this.costDetailList = [];
                this.costDetailDialogVisible = true;
                let costDetailList = await this.getCostDetailDialogList(item.id);
                if(costDetailList){
                    this.costDetailList = costDetailList;
                }

            },
            costDialogHide(){
                this.addCostVisible = false;
                this.costDislogHandleItem = null;
            },
            costDialogSubmit(){
                this.costForm.pid = this.costDislogHandleItem.id;
                axios.put('/cost',this.costForm).then(async response => {
                    if(response.data.status && response.data.status === 200){
                        console.log(response);
                        let list = await this.getList(this.yearMonthString);
                        if(list && list.length){
                            this.list = list;
                        }else{
                            this.nowListIsNoneFn();
                        }
                    }else{
                        this.$message.error(response.data.msg);
                    }
                    this.addCostVisible = false;
                }, response => {
                    this.$message.error(response.data.msg);
                    this.addCostVisible = false;
                });
            },
            editConsume(){

            },
            async init(){
                let yearAndMonth = this.yearMonthString;
                this.now = yearAndMonth;
                (async ()=>{
                    let list = await this.getList(yearAndMonth);
                    if(list && list.length){
                        this.list = list;
                    }else{
                        this.nowListIsNoneFn();
                    }
                })();
                (async ()=>{
                    let sumCost = await this.selectSumCostByMonth(yearAndMonth);
                    if(sumCost){
                        this.sumCost = sumCost;
                    }
                })();
            },
            async getList(yearAndMonth){
                let list =  axios.get('/budget/' + yearAndMonth).then(response => {
                    if(response.data.status && response.data.status === 200){
                        return response.data.data;
                    }else{
                        this.$message.error(response.data.msg);
                        return false;
                    }
                }, response => {
                    this.$message.error(response.data.msg);
                    return false;
                });
                return list;
            },
            async getCostDetailDialogList(id){
                let list =  axios.get('/cost/' + id).then(response => {
                    if(response.data.status && response.data.status === 200){
                        return response.data.data;
                    }else{
                        this.$message.error(response.data.msg);
                        return false;
                    }
                }, response => {
                    this.$message.error(response.data.msg);
                    return false;
                });
                return list;
            },
            async selectSumCostByMonth(yearAndMonth){
                let sumCost =  await axios.get('/cost/sum/' + yearAndMonth).then(response => {
                    if(response.data.status && response.data.status === 200){
                        return response.data.data.sum;
                    }else{
                        this.$message.error(response.data.msg);
                        return false;
                    }
                }, response => {
                    this.$message.error(response.data.msg);
                    return false;
                });
                return sumCost;
            },
            getDate(date){
                return moment(date).format("YYYY-MM-DD");
            },
            async monthChange(){
                let yearAndMonth = this.yearMonthString;
                let list = await this.getList(yearAndMonth);
                if(list && list.length){
                    this.list = list;
                }else{
                    if(yearAndMonth === this.now){
                        this.nowListIsNoneFn();
                    }else{
                        this.list = [];
                    }
                }
            },
            async nowListIsNoneFn(){
                this.nowIsNull = true;
                let yearAndMonth = moment(this.yearMonth).subtract(1, 'months').format("YYYY-MM");
                let list = await this.getList(yearAndMonth);
                if(list && list.length){
                    this.list = list;
                }
            },
            typeDialogSubmit(){
                this.typeForm.year_and_month = this.yearMonthString;
                axios.put('/budget',this.typeForm).then(async response => {
                    if(response.data.status && response.data.status === 200){
                        console.log(response);
                        let list = await this.getList(this.yearMonthString);
                        if(list && list.length){
                            this.list = list;
                        }else{
                            this.nowListIsNoneFn();
                        }
                    }else{
                        this.$message.error(response.data.msg);
                    }
                    this.addTypeVisible = false;
                }, response => {
                    this.$message.error(response.data.msg);
                    this.addTypeVisible = false;
                });
            },
            rowStyle(row){
                if(row.row.balance < 0){
                    return "red";
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../css/common";
    @import "../css/list";
</style>
