<template>
    <div class="mineContainer">
        <div class="mine-top flexbox">
            <div class="mine-info">
                <!--<div class="mine-name fs14 pt10">{{realName}}</div>-->
                <img :src="avatar" class="mine-img"/>
                <div class="pt10 fc-white fs14 cus-name">
                    <span class="fs18 fs-bold">{{cusInfo.customerShortName || '万才物流'}}</span>
                    <span class="pl10 fs-bold">{{cusInfo.userMobile || '18671341006'}}</span>
                </div>
            </div>
        </div>
        <div class="list-body pl15 pr15 fs16">
            <div class="wrapper-cell">
                <mt-cell title="账号设置" to="/setting" is-link value="去设置">
                    <img slot="icon" src="../../assets/img/shezhi-4@2x.png" width="22" height="22">
                </mt-cell>
                <mt-cell title="联系客服" is-link @click.native="handleShowbottom">
                    <img slot="icon" src="../../assets/img/shouji-5@2x.png" width="22" height="22">
                </mt-cell>
            </div>
            <div class="wrapper-cell">
                <mt-cell title="绑定微信">
                    <span v-show="!isBindWechat"@click="ahref()"><a style="text-decoration:none;color:#888;">未绑定，点击进行绑定</a></span>
                    <span v-show="isBindWechat" @click="handleUnbindWechat">已绑定，点击解除绑定</span>
                    <img slot="icon" src="../../assets/img/anquan-4@x.png" width="22" height="22">
                </mt-cell>
                <mt-cell title="当前版本" is-link value="V1.1.0">
                    <img slot="icon" src="../../assets/img/dingdan@2x.png" width="22" height="22">
                </mt-cell>
            </div>
            <input type="text" id="copyinput" :value="wechat" style="opacity: 0;"/>
            <div id="iphonecopy"
                 style="position: absolute;left:-200px; color: rgba(0,0,0,0);background-color: transparent">{{wechat}}
            </div>
        </div>
        <div class="bottom-mask" v-show="showBottom">
            <div class="bottom-text">
                <p class="text" @click="handleCopy">复制 客服微信号</p>
                <p class="cancel" @click="handleHidebottom">取消</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                visible: false,
                showBottom: false,
                cusInfo:{},
                realName: '',
                wechat: '',
                isBindWechat:false,
                href:'',
                avatar: require('../../assets/img/default_avatar@3x.png'),
                bankCardBindingStatus: '',
            };
        },
        mounted() {
            this.checkUser()
            // 链接中type为5表示手动绑定
            this.id = JSON.parse(sessionStorage.getItem("cusInfo")).userId
            this.userInfo = JSON.parse(sessionStorage.getItem('cusInfo'))
            this.href = `${this.$baseURL}public/wechat/operateRedirect?type=20&scope=snsapi_userinfo&state=${this.id}`
            if (this.userInfo) {
                this.realName = this.userInfo.realName || this.userInfo.mobile
                this.newavatar = sessionStorage.getItem('cusnewavatar')
                this.avatar = this.newavatar || this.userInfo.avatar || this.avatar
            }
            this.getList();
            this.getServiceWechat()
        },
        methods: {
            checkUser() {
                let userInfo = JSON.parse(sessionStorage.getItem('cusInfo'))
                if (userInfo.isBindingWeChat) {
                    this.isBindWechat = true
                } else {
                    this.isBindWechat = false
                }
            },
            ahref(){
                window.location.href = this.href;
            },
            getList() {
                this.$api.AccountDetail().then(res => {
                    let {data, respCode} = res.data;
                    if (respCode === 0) {
                        this.cusInfo = data;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取客服微信
            getServiceWechat() {
                let _this = this;
                this.$api.getServiceWechat()
                    .then(res => {
                        _this.wechat = res.data.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            // 复制客服微信号
            handleCopy() {
                try {
                    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                        window.getSelection().removeAllRanges();
                        var Url2 = document.getElementById("iphonecopy");
                        var range = document.createRange();
                        range.selectNode(Url2);
                        window.getSelection().addRange(range);
                        var successful = document.execCommand('copy');
                        window.getSelection().removeAllRanges();
                    } else {
                        var input = document.getElementById("copyinput")
                        input.select()
                        document.execCommand("copy")
                        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
                    }

                    this.$toast('复制成功')
                    this.showBottom = false
                } catch (error) {
                    console.log(error)
                }
            },
            handleShowbottom() {
                this.showBottom = true
            },
            handleHidebottom() {
                this.showBottom = false
            },
            handleUnbindWechat() {
                this.$messagebox({
                    title: `提示`,
                    message: '确定要解除微信绑定？',
                    showCancelButton: true,
                    confirmButtonText: "确认",
                    cancelButtonText: "取消"
                }).then(action => {
                    if (action == 'confirm') {  // 确认的回调
                        let userInfo = JSON.parse(sessionStorage.getItem('cusInfo'))
                        let params = {
                            talentUserId: Number.parseInt(userInfo.userId)
                        }
                        this.$api.unbindWechat(params)
                            .then(res => {
                                this.$toast('微信解除绑定成功！')
                                userInfo.isBindingWeChat = false
                                this.isBindWechat = false
                                sessionStorage.setItem('cusInfo', JSON.stringify(userInfo))
                            })
                            .catch(err => {
                                console.log('unbindwechat false', err)
                            })
                    }
                }).catch(err => {
                    if (err == 'cancel') {  // 取消的回调
                    }
                })
            }
        },
    };
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style lang='scss'>
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .mineContainer {
        background:#F5F5F7 url("../../assets/img/bg@3x.png") no-repeat center top;
        background-size: 100%;
        height:100vh;
        .mint-cell-title{
            padding-left: convertToVw(15);
        }
        .mint-cell-value{
            padding-right: convertToVw(15);
        }
        .mint-cell-wrapper{
            background-image: none;
        }
        .mint-cell:last-child{
            background-image: none;
        }
        .mint-cell{
            background-color:rgba(0,0,0,0);
        }
        .wrapper-cell{
            background-color:#fff;
            border-radius: convertToVw(8);
            box-shadow: 0 0 25px rgba(236,236,235,.6);
            margin-top: convertToVw(15);
        }
        .mint-cell-allow-right::after{
            right:15px;
        }
    }

    h3 {
        text-align: center;
        width: 90%;
        margin: auto;
    }

    .div {
        margin: auto;
        width: 220px;
        height: 44px;
        line-height: 44px;
        background: #0fc37c;
        color: #fff;
        font-size: 17px;
        text-align: center;
        margin-top: 20px;
    }

    .wh_container > > > .mark1 {
        /*background-color: orange;*/
        background-image: url("../../assets/img/mine_nor@3x.png");
        background-position-x: 50%;
        background-position-y: 118%;
        background-size: 30%;
        background-repeat: no-repeat;
    }

    .wh_container > > > .mark2 {
        background-color: blue;
    }

    .wh_content_item > .wh_isMark {
        background: orange;
    }

    .wh_container > > > .wh_content_all {
        background-color: #e84518;
    }

    .bottom-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
    }

    .bottom-text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        background-color: #fff;
        text-align: center;
        color: #1e1f21;
        font-size: convertToVw(17);
        line-height: convertToVw(52);
    }

    .bottom-text .text {
        border-bottom: convertToVw(4) solid #f5f5f5;
    }
</style>
<style scoped lang="scss">
    .cus-name{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction:column;
        span{
            display: flex;
        }
    }
    .flexbox {
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
    .mine-top {
        height:convertToVw(178);
        position: relative;
    }
    .mine-info {
        width: 100%;
        text-align: center;
    }

    .mine-name {
        text-align: center;
        font-family: PingFang-SC-Regular;
        font-size: 0.8rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0rem;
        letter-spacing: 0rem;
        color: #ffffff;
    }

    .mine-img {
        margin-top:convertToVw(40);
        width:convertToVw(60);
        height:convertToVw(60);
        border: 2px solid #fff;
        border-radius: 50%;
    }

    .cell-btn {
        font-size: 0.6rem;
        padding: 0.2rem 0.5rem;
        border: 1px solid;
        color: #e84518;
        margin-left: 0.5rem;
        cursor: pointer;
    }
</style>