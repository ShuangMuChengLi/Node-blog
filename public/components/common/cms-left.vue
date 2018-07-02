<template>
    <div class="left-wrap" :style="{height:height+ 'px'}">
        <el-menu :default-active="active" class="el-menu-vertical-demo" :collapse="isCollapse"  >
            <el-menu-item index="/index" @click="goto('/index')">
                <i class="el-icon-document"></i>
            </el-menu-item>
            <el-menu-item index="/list" @click="goto('/list')">
                <i class="el-icon-menu"></i>
            </el-menu-item>
            <el-menu-item index="/music" @click="goto('/music')">
                <i class="el-icon-service"></i>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-setting"></i>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
    export default {
        computed:{
            active(){
                return this.$route.path;
            }
        },
        data() {
            return {
                isCollapse: true,
                height:0

            };
        },
        methods: {
            goto(target){
                this.$router.push(target);
            }
        },
        mounted(){
            let winHeight = document.documentElement.clientHeight;
            this.height = winHeight;
            window.addEventListener("resize", () =>{
                let winHeight = document.documentElement.clientHeight;
                this.height = winHeight;
            });
        }
    }
</script>
<style scoped lang="less">
    @import "../../css/left";
</style>
