<template>
    <div class="home">
        <!--<transition name="router-fade" mode="out-in">-->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <!--</transition>-->
        <mt-tabbar v-model="selected" fixed value>
            <mt-tab-item id="WorkSpace">
                <img slot="icon" src="../../src/assets/img/workbench_pre.png" class="tab-icon"
                     v-if="selected=='WorkSpace'">
                <img slot="icon" src="../../src/assets/img/workbench_nor.png" class="tab-icon" v-else>
                工作台
            </mt-tab-item>
            <mt-tab-item id="Mine">
                <img slot="icon" src="../../src/assets/img/mine_pre@3x.png" class="tab-icon" v-if="selected=='Mine'">
                <img slot="icon" src="../../src/assets/img/mine_nor@3x.png" class="tab-icon" v-else>
                个人中心
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
    import {mapState,mapGetters,mapMutations} from 'vuex';
    export default {
        name: 'app',        
        data() {
            return {
                selected: '',
            }
        },
        watch: {
            selected: function (val, oldVal) {
                console.log(val)
                if (val == 'WorkSpace') {
                    this.$router.push('/home/workspace')
                }
                if (val == 'Mine') {
                    this.$router.push('/home/mine')
                }
            }
        },
        created() {
            this.getMoneny();
            console.log(this.$route)
            this.selected = this.$route.name;
        },
        methods: {
            ...mapMutations(['SET_ARREARS','SET_COST']),
            getMoneny(){
                this.$api.managementFee().then(res => {
                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        console.log(res)
                        if (data) {
                            this.SET_ARREARS(true)
                            this.SET_COST(data)
                            this.$messagebox({
                                title: `提示`,
                                message: `您有一笔管理费${data}元，因账号余额不足未扣费，任务及排班相关功能已停用，请登录电脑端充值`,
                                confirmButtonText: "关闭",
                            }).then(action => {

                            })
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
        }
    }
</script>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .tab-icon{
        display: flex;
        width:convertToVw(22);
        height:convertToVw(22);
    }
</style>