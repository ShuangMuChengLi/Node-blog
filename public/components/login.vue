<template>
    <div class="login-bg " :style="{height: pageHeight}">
        <el-card class="login-form-big">
            <div slot="header" class="clearfix">
                <span>登录</span>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login()">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import axios from "axios";
    import store from "html5-storage";
    export default {
        data() {
            return {
                pageHeight: 0,
                ruleForm: {
                    username: "",
                    password: ""
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {

        },
        mounted() {
            this.initStyle();
            this.ruleForm.username = store.getLocalStorage("username")  ?  store.getLocalStorage("username") + "" : "";
            this.ruleForm.password = store.getLocalStorage("password") ?  store.getLocalStorage("password") + "" : "";
            window.addEventListener("resize",this.initStyle);
        },
        methods: {
            initStyle(){
                let h = document.documentElement.clientHeight;
                this.pageHeight = h + "px";
            },
            login() {
                this.$refs["ruleForm"].validate(async (valid) => {
                    if (valid) {
                        let result = await axios.post("/user/login",this.ruleForm).catch((data)=>{
                            this.$message({
                                message: "网络异常",
                                type: 'error'
                            });
                            console.error(data);
                            return false;
                        });
                        if(result && result.data ){
                            if(result.data.status === 200){
                                store.setLocalStorage("username",this.ruleForm.username);
                                store.setLocalStorage("password",this.ruleForm.password);
                                window.location.href = "/cms.html?token=" + result.data.token;
                            }else{
                                this.$message({
                                    message: result.data.msg,
                                    type: 'error'
                                });
                            }
                        }
                    } else {
                        this.$message({
                            message: "请输入账号密码",
                            type: 'error'
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../css/login";
</style>
