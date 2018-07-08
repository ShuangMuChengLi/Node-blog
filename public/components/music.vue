<template>
    <div>
        <cms-left ></cms-left>
        <div class="main" :style="{height:height+ 'px'}">
            <div class="main-inner clearfix">
                <el-form :inline="true"  class="list-form" >
                    <el-form-item class="btn-wrap">
                        <el-button type="success" @click="newMusic">新建</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    class="list-table"
                    @row-click="getContent"
                    :data="list">
                    <el-table-column
                        prop="title"
                        label="歌名"
                        width="500">
                    </el-table-column>
                    <el-table-column
                        label="歌手">
                        <template slot-scope="scope">
                            {{scope.row.singer}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            <el-button
                                size="mini"
                                type="success"
                                @click="play(scope.$index, scope.row)">试听</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="clearfix">
                    <el-pagination
                        class="pagination"
                        background
                        layout="prev, pager, next"
                        @current-change="pageChange"
                        :page-size="pageInfo.pageSize"
                        :current-page="pageInfo.now"
                        :total="pageInfo.count">
                    </el-pagination>
                </div>

                <div class="content" v-html="content">

                </div>
            </div>
        </div>
        <el-dialog title="歌曲管理" :visible.sync="dialogFormVisible" @close="closeDialog">
            <el-form :model="dialogForm" :rules="rules" ref="ruleForm" >
                <el-form-item label="歌名" prop="title">
                    <el-input v-model="dialogForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="歌手" prop="singer">
                    <el-input v-model="dialogForm.singer" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="dialogForm.sort" auto-complete="off"></el-input>
                </el-form-item>
                <div class="upload-wrap">
                    <el-upload
                        class="upload-demo"
                        drag
                        action="/upload"
                        :on-success="uploadSuccess"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button >取 消</el-button>
                <el-button type="primary"  @click="onSubmitDialog">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let axios = require("axios");
    let _ = require("lodash");

    let musicComp = require("music-comp");
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
                dialogFormVisible:false,
                content:"",
                type:"",
                keyword:"",
                height :0,
                list:[
                ],
                dialogForm:{
                    id:"",
                    singer:"",
                    title:"",
                    url:"",
                    sort:99
                },
                pageInfo:{
                    now:1,
                    pageSize:20,
                    count:0
                },
                menu:[],
                rules:{
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    singer: [
                        { required: true, message: '请输入歌手', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序', trigger: 'blur' }
                    ]
                }
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
                this.dialogForm = _.clone(row);
                this.dialogFormVisible = true;
            },
            handleDelete(index , row){
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // GET /someUrl
                    await axios.delete('/music/' + row.id).then(response => {
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
            async init(){
                await this.getList();
                let winHeight = document.documentElement.clientHeight;
                this.height = winHeight;
                window.addEventListener("resize", () =>{
                    let winHeight = document.documentElement.clientHeight;
                    this.height = winHeight;
                });
            },
            newMusic(){
                this.dialogFormVisible = true;
            },
            async getList(){
                let url = "/music/?begin=" + this.pageInfo.now + "&count=" + this.pageInfo.pageSize;
                let list = await axios.get(url)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    return false;
                });
                if(list){
                    this.list = list.data[0];
                    this.pageInfo.count = list.data[1];
                    return list;
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
            uploadSuccess(res, file){
                if(res.code === "success"){
                    this.dialogForm.url = res.path;
                }
            },
            onSubmitDialog(){
                this.$refs["ruleForm"].validate( (valid) => {
                    if (valid) {
                        if(!this.dialogForm.url){
                            this.$message.error('请上传音乐');
                            return;
                        }
                        axios.post('/music/',this.dialogForm).then(response => {
                            if(response.data.status && response.data.status === 200){
                                this.$message({
                                    message: '恭喜你，上传成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose:()=>{
                                        this.init();
                                    }
                                });
                                this.dialogFormVisible = false;
                            }else{
                                this.$message.error(response.data.msg);
                            }
                        }, response => {
                            this.$message.error(response.data.msg);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog(){
                this.dialogForm = {
                    id:"",
                    singer:"",
                    title:"",
                    url:"",
                    sort:99
                };
                this.dialogFormVisible = false;
            },
            play(index,row){
                var musicList = [
                    {
                        name: row.title,
                        singer: row.singer,
                        src: row.url,
                    }
                ];

                console.log(musicList)
                musicComp(musicList);
                musicComp.play();
            }
        }
    }
</script>

<style scoped lang="less">

    @import "../css/common";
    @import "../css/list";
    @import "../css/music";
</style>
