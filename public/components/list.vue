<template>
    <div>
        <cms-left ></cms-left>
        <div class="main" :style="{height:height+ 'px'}">
            <div class="main-inner clearfix">
                <el-form :inline="true"  class="list-form">
                    <el-form-item label="类型">
                        <el-select v-model="type" placeholder="类型" @change="formChange">
                            <el-option :label="item.title" :value="item.id" v-for="item in menu" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input v-model="keyword" placeholder="关键字" @blur="formChange" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="goto('/form')">新建</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    class="list-table"
                    @row-click="getContent"
                    :data="list">
                    <el-table-column
                        prop="title"
                        label="标题">
                    </el-table-column>
                    <el-table-column
                        width="200"
                        label="类型">
                        <template slot-scope="scope">
                            {{getType(scope.row.menu)}}
                        </template>
                    </el-table-column>
                    <el-table-column

                        width="200"
                        label="是否首页">
                        <template slot-scope="scope">
                            {{scope.row.isIndex === "1"?"是":"否"}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"
                                     width="500">
                        <template slot-scope="scope">

                            <el-button
                                size="mini"
                                @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
                            <el-button
                                size="mini"
                                @click.stop="setTop(scope.$index, scope.row)">{{scope.row.isTop ?'取消置顶':'置顶'}}</el-button>
                            <el-button
                                size="mini"
                                @click.stop="setRank(scope.row.id)">排序</el-button>
                            <el-button
                                size="mini"
                                @click.stop="setIndex(scope.$index, scope.row)">{{scope.row.isindex === '1' ?'取消首页':'首页'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="clearfix">
                    <el-pagination
                        class="pagination"
                        background
                        layout="total, sizes, prev, pager, next"
                        @current-change="pageChange"
                        :page-sizes="[5, 10, 20, 50]"
                        @size-change="handleSizeChange"
                        :current-page="pageInfo.now"
                        :page-size="pageInfo.pageSize"
                        :page-count="pageInfo.pageCount">
                    </el-pagination>
                </div>

                <div class="content" v-html="content">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let axios = require("axios");
    let _ = require("lodash");
    export default {
        created() {

        },
        mounted() {
            this.init();
        },
        beforeDestroy(){
            document.removeEventListener("keydown",this.keydownEnter);
        },
        directives: {},
        components: {
            "cms-left": () => import('./common/cms-left.vue'),
        },
        data() {
            return {
                content:"",
                type:"",
                keyword:"",
                height :0,
                list:[
                ],
                pageInfo:{
                    now:1,
                    pageSize:5,
                    pageCount:0
                },
                menu:[]
            }
        },
        methods:{
            getContent(row){
                axios.get('/cms/content/' + row.id).then(response => {
                    this.cms = response.data.data;
                    this.content = this.cms.content;
                }, response => {
                    this.$message.error(response.data.msg);
                });
            },
            goto(target){
                this.$router.push(target);
            },
            formChange(){
                this.pageInfo.now = 1;
                this.getList();
            },
            onSubmit() {
                console.log('submit!');
            },
            handleEdit(index , row){
                this.$router.push("/form/" + row.id);
            },
            handleDelete(index , row){
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // GET /someUrl
                    await axios.delete('/cmsForm/' + row.id,{id:row.id}).then(response => {
                        if(response.data.status && response.data.status === 200){
                            this.$message({
                                message: '恭喜你，删除成功',
                                type: 'success',
                                duration: 1000,
                                onClose:()=>{
                                    this.init();
                                }
                            });
                        }else{
                            this.$message.error(response.data.msg);
                        }
                    }, response => {
                        this.$message.error(response.data.msg);
                    });
                },() => {
                    this.$message({
                        type: 'info',
                        duration: 1000,
                        message: '已取消删除'
                    });
                });
            },
            async setTop(index , row){
                await axios.post('/cmsForm/setTop',{id:row.id ,isTop: row.isTop ? 0 : 1}).then(response => {
                    if(response.data.status && response.data.status === 200){
                        this.$message({
                            message: '恭喜你，成功',
                            type: 'success',
                            duration: 1000,
                            onClose:()=>{
                                this.init();
                            }
                        });
                    }else{
                        this.$message.error(response.data.msg);
                    }
                }, response => {
                    this.$message.error(response.data.msg);
                });
            },
            async setRank( id ){
                this.$prompt('请输入排序', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async({ value }) => {
                    await axios.post('/cmsForm/setRank',{id:id ,rank: value}).then(response => {
                        if(response.data.status && response.data.status === 200){
                            this.$message({
                                message: '恭喜你，成功',
                                type: 'success',
                                duration: 1000,
                                onClose:()=>{
                                    this.init();
                                }
                            });
                        }else{
                            this.$message.error(response.data.msg);
                        }
                    }, response => {
                        this.$message.error(response.data.msg);
                    });
                }).catch(() => {
                });

            },
            async setIndex(index , row){
                await axios.post('/cmsForm/setIndex',{id:row.id ,isindex: row.isindex === "1" ? "0" : "1"}).then(response => {
                    if(response.data.status && response.data.status === 200){
                        this.$message({
                            message: '恭喜你，成功',
                            type: 'success',
                            duration: 1000,
                            onClose:()=>{
                                this.init();
                            }
                        });
                    }else{
                        this.$message.error(response.data.msg);
                    }
                }, response => {
                    this.$message.error(response.data.msg);
                });
            },
            async init(){
                let list = await this.getMenu();
                if(list){
                    await this.getList();
                }
                let winHeight = document.documentElement.clientHeight;
                this.height = winHeight;
                window.addEventListener("resize", () =>{
                    let winHeight = document.documentElement.clientHeight;
                    this.height = winHeight;
                });
                document.addEventListener("keydown",this.keydownEnter);
            },
            async getList(){
                let url ="/json/list";
                if(this.keyword){
                    url = url + "/" + this.type + "/" + this.keyword + "/" + this.pageInfo.now + "/" + this.pageInfo.pageSize;
                }else{
                    url = url + "/" + this.type + "/" + this.pageInfo.now + "/" + this.pageInfo.pageSize;
                }
                let list = await axios.get(url)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    return false;
                });
                if(list){
                    if(list.status){
                        console.error(list);
                    }else{
                        this.list = list.list;
                        list.pageInfo.pageSize = parseInt(list.pageInfo.pageSize);
                        this.pageInfo = list.pageInfo;
                        return list;
                    }
                }else{
                    return false;
                }
            },
            async getMenu(){
                let menu = await axios.get("/menu")
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.error(error);
                    return false;
                });
                if(menu){
                    menu.unshift({title:"全部",id:"all"});
                    this.menu = menu;
                    this.type = menu[0].id;
                    return menu;
                }else{
                    return false;
                }
            },
            getType(type){
                let index = _.findIndex(this.menu , {id:type});
                if(index !== -1){
                    return this.menu[index].title;
                }else{
                    return "";
                }
            },
            pageChange(now){
                this.pageInfo.now = now;
                this.getList();
            },
            keydownEnter(e){
                let theEvent = e || window.event;
                let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code === 13) {
                    this.formChange();
                }
            },
            async del(item){

            },
            handleSizeChange(val) {
                this.pageInfo.now = 1;
                this.pageInfo.pageSize = parseInt(val);
                this.getList();
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../css/common";
    @import "../css/list";
</style>
