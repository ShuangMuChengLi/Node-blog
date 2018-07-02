<template>
    <div>
        <cms-left ></cms-left>
        <div class="main" :style="{height:height+ 'px'}">
            <div class="main-inner clearfix">
                <el-form :model="cms" :rules="rules" ref="cms" label-width="100px" class="demo-cms">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="cms.title"></el-input>
                    </el-form-item>
                    <el-form-item label="关键字" prop="keyword">
                        <el-input v-model="cms.keyword"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input v-model="cms.description"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单" prop="menu">
                        <el-select v-model="cms.menu" placeholder="菜单">
                            <el-option :label="item.title" :value="item.id" v-for="item in menus" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否首页">
                        <el-switch v-model="cms.isindex" active-value="1" inactive-value="0"></el-switch>
                    </el-form-item>
                </el-form>
                <div>
                    <label class="el-form-item__label" style="width: 100px;">内容</label>
                    <div class="editor">
                        <div id="editor"  type="text/plain" style="height:400px;"></div>
                    </div>

                </div>

                <div class="cms-submit clearfix">
                    <el-button @click="submitCms" type="primary">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let axios = require("axios");
    let _ = require("lodash");
    let storageUtil = require("html5-storage");
    let UE = require("../lib/ueditor/ueditor.all");
    export default {
        created() {

        },
        mounted() {
            this.init();
        },
        watch:{
            "$route":"init"
        },
        beforeDestroy(){
            UE.delEditor("editor");
            this.ue = null;
            let child = document.getElementById("edui_fixedlayer");
            child.parentNode.removeChild(child);
//            child = document.getElementById("global-zeroclipboard-flash-bridge");
//            child.parentNode.removeChild(child);
//            child = document.getElementById("editor");
//            child.parentNode.removeChild(child);
        },
        directives: {},
        components: {
            "cms-left": () => import('./common/cms-left.vue'),
        },
        data() {
            return {
                height :0,
                ue :0,
                menus:[],
                cms: {
                    id:"",
                    title:"",
                    keyword:"",
                    description:"",
                    menu:"",
                    isindex:"0",
                    content:"",
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    keyword: [
                        {required: true, message: '请输入关键字', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入描述', trigger: 'blur'}
                    ],
                    menu: [
                        {required: true, message: '请选择菜单', trigger: 'change'}
                    ]
                }
            }
        },
        methods:{
            async init(){
                this.getMenus();

                let winHeight = document.documentElement.clientHeight;
                this.height = winHeight;
                window.addEventListener("resize", () =>{
                    let winHeight = document.documentElement.clientHeight;
                    this.height = winHeight;
                });
                document.addEventListener("keydown",this.keydownEnter);
                setTimeout(()=>{
                    this.ue = UE.getEditor('editor',{'autoHeightEnabled': false});
                    if (this.$route.params.id) {
                        this.cms.id = this.$route.params.id;
                        this.ue.addListener("ready", () => {
                            this.getEditContent();
                        });
                    }
                },200);
            },
            async getMenus(){
                let menus = await axios('/menu').then(response => {
                    return response.data;
                }, response => {
                    this.$message.error(response.data.msg);
                    return false;
                });
                if(menus){
                    this.menus = menus;
                }

            },
            getEditContent(){
                axios.get('/cms/content/' + this.cms.id).then(response => {
                    this.cms = response.data.data;
                    this.ue.setContent(this.cms.content);
                }, response => {
                    this.$message.error(response.data.msg);
                });
            },
            submitCms(){
                this.$refs.cms.validate((valid)=>{
                    if (valid) {
                        this.cms.content = this.ue.getContent();
                        // GET /someUrl
                        axios.post('/cmsForm/addOrUpdate',this.cms).then(response => {
                            if(response.data.status && response.data.status === 200){
                                this.$message({
                                    message: '恭喜你，发布成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose:()=>{
                                        this.$confirm('是否继续编辑?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }).then(() => {
                                            if(!this.cms.id){
                                                this.$router.push("/form/" + response.data.data);
                                            }
                                        },() => {
                                            this.$router.push("/list");
                                        });
                                    }
                                });
                            }else{
                                this.$message.error(response.data.msg);
                            }
                        }, response => {
                            this.$message.error(response.data.msg);
                        });
                    } else {
                        window.scrollTo(0,0);
                        return false;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../css/common";
    @import "../css/form";
</style>
