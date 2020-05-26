<template>
    <div class="attendance">
        <van-nav-bar
            title="考勤管理"
            left-text=""
            right-text=""
            left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight">
        <van-icon name="export" slot="right"></van-icon>
    </van-nav-bar>
        <div class="att-content">
            <innerList v-show="active == 1"></innerList>
            <outList v-show="active == 2"></outList>
        </div>
        <div class="foot">
            <div class="f-item" :class="{'active': active == 1}" @click="tab('1')">对内考勤</div>
            <div class="f-item" :class="{'active': active == 2}" @click="tab('2')">对外考勤</div>
        </div>
    </div>
</template>

<script>
    import innerList from './components/innerList'
    import outList from './components/outList'
    export default {
        name: "attendance",
        components:{innerList,outList},
        data() {
            return {
                active:'1'
            }
        },
        mounted(){

        },
        methods:{
            onClickLeft(){
                this.$router.go(-1)
            },
            tab(index) {
                this.active = index;
            },
            onClickRight(){
                console.log(2)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .att-content{
        position: absolute;
        top: convertToVw(40);
        left: 0;
        right: 0;
        bottom: convertToVw(45);
    }
</style>