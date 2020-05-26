<template>
    <div>
        授权登录中......
    </div>
</template>

<script>
    export default {
        name: "wechatOpt",
        data() {
            return {
                id: '',
                bankCardBindingStatus:false,
            }
        },
        methods: {
            async getStatus(){
                let info = JSON.parse(localStorage.getItem('cusInfo'));
                let text = '';
                if(info.auditStatus == 0){
                    text = `您的公司基本信息还未提交审核，请审核电脑端填写资料并提交审核`
                }else if(info.auditStatus == 1){
                    text = `您的公司基本信息已提交审核，审核需要1~3个工作日，请耐心等待`
                }else if(info.auditStatus == 2){
                    let { data } = await this.$api.detailCustomer({id:info.customerId});
                    if( data.respCode === 0 ){
                        text = `您的公司基本信息审核未通过，请通过PC端重新提交。审核失败原因：${data.data.failReason}`
                    }
                }else if(info.auditStatus == 3){
                    this.$router.replace({ name: 'Mine',query:{isFirst: true} })
                    return;
                }
                if(text){ //3的时候说明通过了
                    this.$messagebox({
                        title: `提示`,
                        message: text,
                        confirmButtonText: "关闭",
                    }).then(action => {

                    })
                }
            },
            toBind(code, state) {
                const params = {
                    code: code,
                    state: state,
                };
                this.$api
                    .WechatToBind(params)
                    .then(response => {
                        let data = JSON.parse(sessionStorage.getItem("cusInfo"))
                        let wechatdata = JSON.parse(sessionStorage.getItem("cuswechatLogin"));
                        let bindtype = wechatdata.type
                        if (response.data.respCode == 0) {
                            data.avatar = response.data.data
                            data.isBindingWeChat = true;
                            sessionStorage.setItem('cusInfo', JSON.stringify(data))
                            localStorage.setItem("cusInfo", JSON.stringify(data))
                            this.$router.replace({name: 'Mine'})
                        } else {
                            this.$toast(response.data.errorMsg)
                            sessionStorage.setItem('cuswechaterror', true)  // 微信绑定过程中出错
                            this.$router.replace({name: 'Mine'})
                        }
                        this.$indicator.close();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            login(code) {
                let _this = this;
                let data = JSON.parse(sessionStorage.getItem("cuswechatLogin"));
                let params = {
                    code: code,
                    loginType:2
                }
                this.$api.WechatLogin(params).then(response => {
                        console.log(response)
                        if (response.data.respCode == 0) {
                            sessionStorage.setItem("cuslogintype", response.data.data.loginType);
                            sessionStorage.setItem("cusInfo", JSON.stringify(response.data.data));
                            localStorage.setItem("cusInfo", JSON.stringify(response.data.data));
                            _this.getStatus()
                        } else {
                            // this.$toast(response.data.errorMsg)
                        }
                        this.$indicator.close();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

        },
        mounted() {
            this.$indicator.open({
                spinnerType: 'fading-circle'
            });
            let data = JSON.parse(sessionStorage.getItem("cuswechatLogin"));
            console.log(data, data.type);
            console.log(window.location);
            if (data.type == 18) {
                this.login(data.code)
            } else {
                this.toBind(data.code, data.state)
            }
            this.$indicator.close();
        },
        destroyed() {
            this.$indicator.close();
        }
    }
</script>

<style scoped>
</style>