<template>
    <div class="set-wrap">
        <mt-header title="利润趋势报表设置" fixed class="mint-header-title pl10" style="z-index:2">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div class="set-body">
            <ul class="pl20 pr20 fs14">
                <li class="pt15 pb15">
                    <div class="pb10">选择时段:</div>
                    <van-radio-group class="" v-model="setForm.date">
                        <van-radio name="1">本月</van-radio>
                        <van-radio name="2">上月</van-radio>
                        <van-radio name="3">自定义</van-radio>
                    </van-radio-group>
                    <div class=" input-box" v-show="setForm.date == '3'">
                        <input placeholder="请选择开始时间" readonly type="text" v-model="setForm.startDate" @click="selectTime(1)">
                        <span class="pr10"> - </span>
                        <input placeholder="请选择结束时间" readonly type="text" v-model="setForm.endDate"  @click="selectTime(2)">
                    </div>
                </li>
                <li class="pt5 pb15">
                    <div class="pb10">选择班务经理:</div>
                    <van-radio-group class="" v-model="setForm.manager">
                        <van-radio name="">全部班务经理</van-radio>
                        <van-radio name="1">自定义</van-radio>
                    </van-radio-group>
                    <div v-show="setForm.manager == '1'" @click="setShow(true)" class="btn-box">
                        <span v-show="!setForm.managerName">请选择班务经理</span>
                        <span v-show="setForm.managerName">已选:{{setForm.managerName}}</span>
                    </div>
                </li>
            </ul>
            <div class="foot-btn pl30 pr30 pt44 pb20">
                <div class="cancel" @click="handleBack">取消</div>
                <div class="btn-ok" @click="handleOk()">确认</div>
            </div>
        </div>
        <div class="mask" v-show="dateShow">

        </div>

    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import Bus from '../../../common/eventBus';
    import {DatetimePicker} from 'vant';
    import selectManger from './selectManger'
    Vue.use(DatetimePicker);
    let moment = require("moment");
    import 'vant/lib/index.css';

    export default {
        name: "set",
        components:{selectManger},
        props:{
            form:{
                type:Object,
            }
        },
        data() {
            return {
                type: '1',  //1按天 2按月
                date: '1', //1本月 2上月 3自定义
                year: '', //1本年度 2自定义
                startDate: '',
                endDate: '',
                status: '',// 全部班务 2进行中的班务 3已结束的班务 4自定义
                manager:'',
                currentDate: new Date(),
                minDate: new Date(2018, 1, 1),
                // maxDate: '',
                dateShow: false,
                modelTime:'date',
                timeType:1,//1是开始时间 2是结束时间
                childShow:false, //是否显示子页面
                setForm: {}
            }
        },
        watch: {
            'setForm.date': function (val, old) {
                if(val=='1'){
                    this.setForm.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.setForm.endDate = moment(new Date()).format('YYYY-MM-DD');
                }else if(val=='2'){
                    this.setForm.startDate = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
                    this.setForm.endDate = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
                }else{
                    this.setForm.startDate = ''
                    this.setForm.endDate = ''
                }
            },
            'setForm.manager':function (val,oldVal) {
                if(val == '1'){

                }else{
                    this.setForm.managerId = '';
                    this.setForm.managerName = '';
                }
            },
        },
        mounted(){
            this.setForm = Object.assign({},this.form);
        },
        methods: {

            setShow(val){
                if(typeof val === 'boolean'){
                    this.childShow = val
                }
                if(typeof val === 'object'){
                    this.childShow = val.show;
                    if(val.ok){
                        this.setForm.managerId = val.managerId
                        this.setForm.managerName = val.managerName
                    }
                }
            },
            handleOk(){
                if(!this.setForm.startDate){
                    return this.$toast('开始时间不能为空!')
                }
                if(!this.setForm.endDate){
                    return this.$toast('结束时间不能为空!')
                }
                if(this.setForm.manager == 1 && !this.setForm.managerId){
                    return this.$toast('班务经理不能为空!')
                }
                let id = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
                //发给父元素
                this.$emit('SET', {
                    show: false,ok:true,...this.setForm,
                });
                //发给图表页面兄弟组件用的
                Bus.$emit('sendThr',{show: false,ok:true,...this.setForm})
                //记住设置的属性，下次进如果是同一人就取这些属性展示
                this.SET_MFI({show: false,ok:true,...this.setForm})
                localStorage.setItem('userOldId',id)
            },
            confirm(val) {
                let time = moment(val).format('YYYY-MM-DD')
                if(this.timeType == 1){//开始时间
                    this.setForm.startDate = time
                }else if(this.timeType == 2){ //结束时间
                    if(!moment(this.setForm.startDate).isBefore(time)){
                        return this.$toast('结束时间要大于开始时间!')
                    }
                    if (moment(time).diff(this.setForm.startDate, 'days') + 1 > 31) {
                        return this.$toast('最多选31天!')
                    }
                    this.setForm.endDate = time
                }
                this.dateShow = false;
            },
            cancel(val) {
                this.dateShow = false;
            },
            selectTime(val){
                console.log(val)
                this.timeType = val
                if(this.timeType == 2 && !this.setForm.startDate){
                    return this.$toast('请先选择开始时间!')
                }
                this.dateShow = true;
            },
            handleBack() {
                this.$emit('SET', {show: false});
            },
        }
    }
</script>

<style lang="scss" scoped>
    $design_width: 375;
    $orange_color: #E95A34;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
</style>