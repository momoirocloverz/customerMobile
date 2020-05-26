<template>
  <div id="login" class="pl25 pr25">
    <div class="logText fs24 pt35 co-fff">欢迎登录</div>
    <div class="form-div bg-fff mt25 pt30 pb30 pl15 pr15">
      <van-cell-group>
        <van-field
                v-model="form.phone"
                clearable
                left-icon=" accontIcon"
                maxlength="128"
                placeholder="输入登录账号"/>
        <van-field
                class="mt20"
                v-model="form.password"
                clearable
                type="password"
                left-icon=" pswIcon"
                maxlength="128"
                placeholder="输入登录密码"/>
      </van-cell-group>
      <div class="tright pt10 pb15 co-999">
        <span class="fs14" @click="$router.push('/forgetPsw')">忘记密码</span>
      </div>
      <mt-button type="primary" class="logBtn w100" @click="login">立即登录</mt-button>
    </div>
  </div>
</template>
<script>

export default {
  name: "Login",
  data() {
    return {
      form: {
        phone: "",
        password: "",
        fullPath:""
      },
        bankCardBindingStatus:false,
    };
  },
  methods: {
    checkTel() {
      if (!this.form.phone) {
        this.$toast("登录账号不能为空");
      }
    },
    checkPwd() {
      if (!this.form.password) {
        this.$toast("登录密码不能为空");
      }
    },
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
        this.$router.push({ name: "WorkSpace" ,query:{isFirst: true}});
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
    login() {
      let _this = this;
      if (!this.form.phone) {
        this.$toast("登录账号不能为空");
        return false;
      }
      if (!this.form.password) {
        this.$toast("登录密码不能为空");
        return false;
      }
      if(this.request){return}
      this.request = true;
      const params = {
        username: `${this.form.phone},2`,
        password: this.form.password
      };
      this.$api.login(params).then(response => {
          if(response.data.respCode === 0){
            sessionStorage.setItem("cuslogintype", response.data.data.loginType);
            sessionStorage.setItem("custoken", response.headers.authorization);
            sessionStorage.setItem("cusInfo", JSON.stringify(response.data.data));
            localStorage.setItem("cusInfo", JSON.stringify(response.data.data));
            this.getStatus()
          }else{
            this.$toast(response.data.errorMsg);
          }
        })
        .catch(error => {

        }).finally(()=>{
          setTimeout(()=>{
            _this.request = false;
          },500)
      });
    },
  },
  created(){
  },
  mounted() {
  }
};
</script>
<style lang="scss">
  $design_width: 375;
  @function convertToVw($size: 0) {
    @return (($size * 100 / $design_width) + vw);
  }
#login {
  height: 100vh;
  background:url("../../assets/img/login-bg.png") no-repeat top left;
  background-size:100%;
  margin: 0 auto;
  .logText {
    color: #d6522d;
    text-align: center;
  }
  .form-div {
    border-radius: convertToVw(8);
    position: relative;
    box-shadow: 0 0 25px rgba(236,236,235,.6);
  }
  .logBtn {
    display: flex;
    height: convertToVw(44);
    border-radius:convertToVw(8);
    font-size: convertToVw(16);
    background-color:#E95A34 ;
    color: #fff;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(219,163,148,.35);
  }
  .pswIcon {
    width: convertToVw(23);
    height: convertToVw(23);
    background: url("../../assets/img/mima@2x.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .accontIcon {
    width: convertToVw(23);
    height: convertToVw(23);
    background: url("../../assets/img/z-h.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .van-cell{
    padding: 0;
    border: 1px solid #D2D2D2;
    border-radius: convertToVw(8);
  }
  .van-field__left-icon{
    padding: convertToVw(10);
    border-right: 1px solid #D2D2D2;
  }
  .van-field__body{
    padding: convertToVw(10);
  }
}
</style>
