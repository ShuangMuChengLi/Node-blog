new Vue( {
    el: '#app',
    data :{
        faceListVisible:false,
        inputMsg:"",
        ruleForm:{
            nickname:"",
            tel :"",
            comment :"",
            pid :""
        },
        rules: {
            nickname: [
                {required: true, message: '请输入昵称', trigger: 'blur'}
            ]
        }
    },
    mounted: function () {
    },
    methods: {
        // 表情选择
        faceSelect(item){
            this.insertText("<img src='/images/face/faceIcon/" + item + ".png'>");
            this.faceListVisible = false;
        },
        // 光标控制,插入内容
        insertText(str) {
            let obj = this.$refs.editor;
            if (document.selection) {
                let sel = document.selection.createRange();
                sel.text = str;
            } else if (typeof obj.selectionStart === "number" && typeof obj.selectionEnd === "number") {
                let startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.innerHTML;
                obj.innerHTML = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                obj.innerHTML += str;
            }
        },
        // 发送文本
        submitMsg(){
            this.$refs["ruleForm"].validate((valid) => {
                if (!valid) {
                    return;
                }
                let comment = this.$refs.editor.innerHTML;
                if(!comment){
                    this.$message.error('请输入评论哦');
                    return;
                }
                this.ruleForm.comment = comment;
                this.ruleForm.pid = pid;
                this.$http.post('/comment/insertComment',this.ruleForm).then(response => {
                    this.$message({
                        message: '恭喜你，发布成功',
                        type: 'success',
                        duration:1000,
                        onClose:()=>{
                            window.location.reload();
                        }
                    });
                    this.ruleForm = {
                        nickname:"",
                        tel :"",
                        comment :"",
                        pid :""
                    };
                }, response => {
                    this.$message.error(response.body.msg);
                });
                this.$refs.editor.innerHTML = "";
            });
        },
    }
});
