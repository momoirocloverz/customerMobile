<template>
  <div id="psw" class="pl25 pr25">
    <mt-header title="重置密码" fixed style="background-color:rgba(0,0,0,0)">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="pt40">
      <div class="form-div bg-fff mt25 pt30 pb30 pl15 pr15">
        <van-cell-group>
          <van-field
                  class=""
                  v-model="form.loginName"
                  clearable
                  left-icon=" accontIcon"
                  maxlength="128"
                  placeholder="请输入您的登录账号"/>
          <van-field
                  class="mt20"
                  v-model="form.mobile"
                  clearable
                  type="tel"
                  left-icon=" phoneIcon"
                  maxlength="128"
                  placeholder="请输入您注册的手机号码"/>
          <van-field
                  class="mt20"
                  v-model="form.validator"
                  clearable
                  type="tel"
                  left-icon=" emailIcon"
                  maxlength="128"
                  placeholder="输入短信验证码">
                <van-button slot="button" size="small" :disabled="getcoding" type="primary" @click="getCode">{{buttonText}}</van-button>
          </van-field>
          <van-field
                  class="mt20"
                  v-model="form.password"
                  clearable
                  type="password"
                  left-icon=" pswIcon"
                  maxlength="128"
                  placeholder="输入6-18位密码，必须数字或字母"/>
        </van-cell-group>
        <div class="for-pwd mt20">
          <div class="logBtn" @click="handleSubmit">确认重置</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ForgetPsw",
  data() {
    return {
      wating: 60,
      getcoding: false,
      buttonText: '获取验证码',
      form: {
        mobile: "",
        password: "",
        validator: "",
        loginName:'',
      },
    };
  },
  methods: {
    checkTel() {
      console.log(1)
      if (!this.form.mobile) {
        console.log(2)
        this.$toast('登录账号不能为空')
        return false;
      } else {
        console.log(3)

        let reg = new RegExp(/^[1-9][0-9]*$/)
        if (!reg.test(this.form.mobile)) {
          this.$toast('手机号必须全为数字')
          return false;
        } else {
          //          this.loginnameCheck()
        }
      }
    },
    checkCode() {
      console.log(1)
      if (!this.form.validator) {
        console.log(2)
        this.$toast("验证码不能为空");
        return false;
      } else {
        return true
      }
    },
    checkPwd() {
      if (!this.form.password) {
        this.$toast('登录密码不能为空')
        return false;
      } else {
        console.log(3)

        let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/)
        if (!reg.test(this.form.password)) {
          this.$toast('密码必须是6-18位字母或数字')
        }
      }
    },
    handleSubmit() {
      let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/)
      let reg2 = new RegExp(/^[1-9][0-9]*$/)
      if (!this.form.loginName) {
        return this.$toast('登录帐号不能为空')
      }
      if (!this.form.mobile) {
        return this.$toast('手机号不能为空')
      }
      if (!reg2.test(this.form.mobile)) {
          return this.$toast('手机号必须全为数字')
        }
      if (!this.form.validator) {
        return this.$toast("验证码不能为空");
      }
      if (!this.form.password) {
        return this.$toast('登录密码不能为空')
      }
      if (!reg.test(this.form.password)) {
        this.$toast('密码必须是6-18位字母或数字')
      }
      const params = {
        loginName:this.form.loginName,
        validator: this.form.validator,
        password: this.form.password,
        mobile: this.form.mobile,
        userType: 2,
      };
      this.$api
        .UpdateUserPassword(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$toast('密码重置成功！')
            this.$router.push('/')
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCode() {
      let reg = new RegExp(/^[1-9][0-9]*$/)
      if (!this.form.mobile) {
        this.$toast('手机号不能为空')
        return false;
      }
      else if (!reg.test(this.form.mobile)) {
        this.$toast('手机号必须全为数字')
        return false;
      } else if (this.form.mobile.length != 11) {
        this.$toast('手机号必须为11位数字')
        return false;
        //            this.loginnameCheck()
      }
      const params = {
        mobile: this.form.mobile,
        userType: 5,
      };
      this.$api
        .checkMobileMsg(params)
        .then(response => {
          console.log(response.data.data)
          if (response.data.respCode == 0) {
            if (response.data.data == true) {
              this.getCode1()
            } else {
              this.$toast('您输入的手机号尚未注册')
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    getCode1() {
      const params = {
        mobile: this.form.mobile,
      };
      this.$api
        .getSmsCode(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.getcoding = true;
            this.wating = 60
            this.$toast('验证码已发送');
            let that = this
            let timing = setInterval(function () {
              if (that.wating < 0) {
                that.getcoding = false;
                that.buttonText = '获取验证码';
                window.clearInterval(timing)
              } else {
                that.buttonText = that.wating + '秒后重试'
                that.wating--;
              }
            }, 1000)
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    loginnameCheck() {
      const params = {
        loginName: this.form.mobile,
        userType: 5
      }
      this.$api
        .loginnameCheck(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode != 0) {
            this.getCoding = true
            return false
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    handleFacePsw() {
      this.$router.push({ name: 'faceauth' })
    }
  }
};
</script>
<style lang="scss">
  $design_width: 375;
  @function convertToVw($size: 0) {
    @return (($size * 100 / $design_width) + vw);
  }
  #psw{
    height: 100vh;
    background:url("../../assets/img/login-bg.png") no-repeat top left;
    background-size:100%;
    margin: 0 auto;
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
    .phoneIcon{
      width: convertToVw(23);
      height: convertToVw(23);
      background: url("../../assets/img/phone@2x.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .emailIcon{
      width: convertToVw(23);
      height: convertToVw(23);
      background: url("../../assets/img/emai@2x.png") no-repeat center center;
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
    .van-button--primary{
      background-color: #fff;
      color: #E75A34;
      border:none;
    }
  }
</style>
