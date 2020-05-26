<template>
    <div id="change-phone">
        <mt-header title="更换手机号码" fixed class="mint-header-title">
            <router-link to="/setting" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="pt40">
            <div class="form-div bg-fff pb30 pl15 pr15 pt20">
                <van-cell-group>
                    <van-field
                            class=""
                            v-model="form.mobile"
                            clearable
                            type="tel"
                            left-icon=" phoneIcon"
                            maxlength="11"
                            placeholder="请输入你想更换的手机号码"></van-field>
                    <van-field
                            class="mt20"
                            v-model="form.validator"
                            clearable
                            type="tel"
                            left-icon=" emailIcon"
                            maxlength="6"
                            placeholder="输入短信验证码">
                        <van-button slot="button" size="small" :disabled="getcoding" type="primary" @click="getCode">{{buttonText}}</van-button>
                    </van-field>
                    <van-field
                            class="mt20"
                            v-model="form.password"
                            clearable
                            type="password"
                            left-icon=" pswIcon"
                            maxlength="18"
                            placeholder="输入6-18位密码，必须数字或字母"></van-field>
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
        name: "ChangePhone",
        data() {
            return {
                wating: 60,
                getcoding: false,
                buttonText: "获取验证码",
                form: {
                    phone: "",
                    password: ""
                }
            };
        },
        methods: {
            checkTel() {
                console.log(1);
                if (!this.form.mobile) {
                    console.log(2);
                    this.$toast("登录账号不能为空");
                    return false;
                } else {
                    console.log(3);

                    let reg = new RegExp(/^[1-9][0-9]*$/);
                    if (!reg.test(this.form.mobile)) {
                        this.$toast("手机号必须全为数字");
                        return false;
                    } else {
                        if (this.form.mobile.length == 11) {
                            return true;
                        } else {
                            this.$toast("请输入正确的手机号");
                        }
                    }
                }
            },
            checkCode() {
                console.log(1);
                if (!this.form.validator) {
                    console.log(2);
                    this.$toast("验证码不能为空");
                    return false;
                } else {
                    return true;
                }
            },
            checkPwd() {
                if (!this.form.password) {
                    this.$toast("登录密码不能为空");
                    return false;
                } else {
                    console.log(3);

                    let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/);
                    if (!reg.test(this.form.password)) {
                        this.$toast("密码必须是6-18位字母或数字");
                    }
                }
            },
            handleSubmit() {
                let _this = this;
                let regOne = new RegExp(/^[1-9][0-9]*$/);
                if (!this.form.mobile) {
                    console.log(2);
                    return this.$toast("手机号不能为空");
                }
                if (!regOne.test(this.form.mobile)) {
                    return this.$toast("手机号必须全为数字");
                }
                if (this.form.mobile.length != 11) {
                    return this.$toast("请输入正确的手机号");
                }
                let reg = new RegExp(/^[a-zA-Z0-9]{6,18}$/);
                if (!this.form.validator) {
                    return this.$toast("验证码不能为空");
                }
                if (!this.form.password) {
                    return this.$toast("登录密码不能为空");
                }
                if (!reg.test(this.form.password)) {
                    return this.$toast("密码必须是6-18位字母或数字");
                }
                if (_this.request) {
                    return
                }
                _this.request = true
                const params = {
                    validator: this.form.validator,
                    password: this.form.password,
                    mobile: this.form.mobile,
                    userType: 2
                };
                this.$api
                    .UpdatePhone(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.$toast("更换手机号成功！请重新登录");
                            this.$router.push({name: 'login'})
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    }).finally(() => {
                    setTimeout(() => {
                        _this.request = false
                    }, 500)
                });
            },
            getCode() {
                let _this = this;
                let regOne = new RegExp(/^[1-9][0-9]*$/);
                if (!this.form.mobile) {
                    console.log(2);
                    return this.$toast("手机号不能为空");
                }
                if (!regOne.test(this.form.mobile)) {
                    return this.$toast("手机号必须全为数字");
                }
                if (this.form.mobile.length != 11) {
                    return this.$toast("请输入正确的手机号");
                }
                const params = {
                    mobile: this.form.mobile
                };
                this.$api
                    .getSmsCode(params)
                    .then(response => {
                        if (response.data.respCode == 0) {
                            this.getcoding = true;
                            this.wating = 60;
                            this.$toast("验证码已发送");
                            let that = this;
                            let timing = setInterval(function () {
                                if (that.wating < 0) {
                                    that.getcoding = false;
                                    that.buttonText = "获取验证码";
                                    window.clearInterval(timing);
                                } else {
                                    that.buttonText = that.wating + "秒后重试";
                                    that.wating--;
                                }
                            }, 1000);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    };
</script>
<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    #change-phone{
        height: 100vh;
        background: #f5f5f5;
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
