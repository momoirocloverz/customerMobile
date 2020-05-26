<template>
    <div class="set-wrap">
        <mt-header title="利润趋势报表设置" fixed class="mint-header-title pl10" style="z-index:2">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div class="set-body">
            <ul class="pl15 pt10 pr15 fs14">
                <li class="pt5 pb15">
                    <div class="pb10">选择维度:</div>
                    <van-radio-group class="" v-model="setForm.type">
                        <van-radio name="1">按天</van-radio>
                        <van-radio name="2">按月</van-radio>
                    </van-radio-group>
                </li>
                <li class="pt5 pb15">
                    <div class="pb10">选择时段:</div>
                    <van-radio-group v-show="setForm.type == 1" class="" v-model="setForm.date">
                        <van-radio name="1">本月</van-radio>
                        <van-radio name="2">上月</van-radio>
                        <van-radio name="3">自定义</van-radio>
                    </van-radio-group>
                    <van-radio-group v-show="setForm.type == 2" class="" v-model="setForm.year">
                        <van-radio name="1">本年度</van-radio>
                        <van-radio name="2">自定义</van-radio>
                    </van-radio-group>
                    <div class=" input-box" v-show="(setForm.type == 1 && setForm.date == '3')">
                        <input placeholder="请选择开始时间" readonly type="text" v-model="setForm.startDate" @click="selectTime(1)">
                        <span class="pr10"> - </span>
                        <input placeholder="请选择结束时间" readonly type="text" v-model="setForm.endDate"  @click="selectTime(2)">
                    </div>
                    <div class=" input-box" v-show="(setForm.type == 2 && setForm.year == '2')">
                        <input placeholder="请选择开始月份" readonly type="text" v-model="setForm.startM" @click="selectTime(1,'M')">
                        <span class="pr10"> - </span>
                        <input placeholder="请选择结束月份" readonly type="text" v-model="setForm.endM"  @click="selectTime(2,'M')">
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
                <li class="pt5 pb15">
                    <div class="pb10">选择班务:</div>
                    <van-radio-group class="" v-model="setForm.status">
                        <van-radio name="">全部班务</van-radio>
                        <van-radio name="2">进行中的班务</van-radio>
                        <van-radio name="3">已结束的班务</van-radio>
                        <van-radio name="4">自定义</van-radio>
                    </van-radio-group>
                    <div v-show="setForm.status == '4'" class="btn-box" @click="classShow(true)">
                        <span v-show="!setForm.classTaskName">请选择班务</span>
                        <span v-show="setForm.classTaskName">
                            已选:{{setForm.classTaskName}}等{{setForm.len}}个班务
                        </span>
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
        <div class="foot foot-date" style="z-index:105;" v-show="dateShow">
            <van-datetime-picker class="w100"
                                 v-model="currentDate"
                                 :type="modelTime"
                                 :min-date="minDate"

                                 @confirm="confirm"
                                 @cancel="cancel"
            />
            <!--:max-date="maxDate"-->
        </div>
        <selectManger v-if="childShow" :form="setForm" @showManger="setShow" ></selectManger>
        <selectClassWork v-if="childClassShow" :form="setForm" @showClassWork="classShow" ></selectClassWork>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import Bus from '../../../common/eventBus';
    import {DatetimePicker} from 'vant';
    import selectManger from './selectManger'
    import selectClassWork from './selectClassWork'
    Vue.use(DatetimePicker);
    let moment = require("moment");

    export default {
        name: "set",
        components:{selectManger,selectClassWork},
        props:{
            form:{
                type:Object,
            }
        },
        data() {
            return {
                currentDate: new Date(),
                minDate: new Date(2018, 1, 1),
                // maxDate: '',
                dateShow: false,
                modelTime:'date',
                isM:false,//1是否月份
                timeType:1,//1是开始时间 2是结束时间
                childShow:false, //是否显示子页面
                childClassShow:false, //是否显示子页面
                setForm: {}
            }
        },
        watch: {
            'setForm.type': function (val, old) {
                if(val == '1'){
                    this.setForm.date = '1'
                    // this.setForm.year = '1'
                    this.modelTime = 'date'//按天
                    this.setForm.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.setForm.endDate = moment(new Date()).format('YYYY-MM-DD');
                }else if(val == '2'){
                    // this.setForm.date = '1'
                    this.setForm.year = '1'
                    this.modelTime = 'year-month'//按月
                    this.setForm.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.setForm.endDate = moment(new Date()).format('YYYY-MM-DD');
                }
                console.log(this.setForm.startDate, this.setForm.endDate)
            },
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
            'setForm.year': function (val, old) {
                if(val == '1'){
                    this.setForm.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.setForm.endDate = moment(new Date()).format('YYYY-MM-DD');
                }else if(val == '2'){
                    this.setForm.startDate = ''
                    this.setForm.endDate = ''
                    this.setForm.startM = ''
                    this.setForm.endM = ''
                }
            },
            'setForm.status': function (val,oldVal) {
                if(val != '4'){
                    this.setForm.taskIds = '';
                    this.setForm.classTaskName = '';
                    this.setForm.len = 0;
                    this.setForm.ids = [];
                    this.setForm.result = [];
                }
            }
        },
        mounted(){
            this.setForm = Object.assign({},this.form);
        },
        methods: {
            ...mapMutations(['SET_PFI']),
            setShow(val){
                if(typeof val === 'boolean'){
                    if(this.setForm.len > 0){
                        this.$messagebox({
                            title: `提示`,
                            message: `自定义班务经理后，原自定义已选择的班务将清空，需重新选择。`,
                            showCancelButton: true,
                            confirmButtonText: "确认",
                            cancelButtonText: "取消"
                        }).then(action => {
                            if (action == 'confirm') {
                                this.setForm.taskIds = '';
                                this.setForm.classTaskName = '';
                                this.setForm.len = 0;
                                this.setForm.ids = [];
                                this.setForm.result = [];
                                this.childShow = val
                            } else {

                            }
                        })
                    }else{
                        this.childShow = val
                    }
                }
                if(typeof val === 'object'){
                    this.childShow = val.show;
                    if(val.ok){
                        this.setForm.managerId = val.managerId
                        this.setForm.managerName = val.managerName
                    }
                }
            },
            classShow(val){
                if(typeof val === 'boolean'){
                    this.childClassShow = val
                }
                if(typeof val === 'object'){
                    this.childClassShow = val.show;
                    if(val.ok){
                        this.setForm.taskIds = val.taskIds;
                        this.setForm.classTaskName = val.classTaskName;
                        this.setForm.len = val.len;
                        this.setForm.ids = val.ids;
                        this.setForm.result = val.result;
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
                if(this.setForm.status == 4 && !this.setForm.taskIds){
                    return this.$toast('班务不能为空!')
                }
                let id = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
                //发给父元素
                this.$emit('SET', {
                    show: false,ok:true,...this.setForm,
                });
                //发给图表页面兄弟组件用的
                Bus.$emit('sendTwo',{show: false,ok:true,...this.setForm})
                //记住设置的属性，下次进如果是同一人就取这些属性展示
                this.SET_PFI({show: false,ok:true,...this.setForm})
                localStorage.setItem('userOldId',id)
            },
            confirm(val) {
                let time = '';
                if(this.setForm.type == '1'){//按天
                    time = moment(val).format('YYYY-MM-DD')
                }else {//按月
                    if(this.timeType == 1){ //开始时间
                        time = moment(val).startOf("month").format('YYYY-MM-DD');
                    }else{ //结束时间
                        time = moment(val).endOf('month').format('YYYY-MM-DD');
                    }
                }
                console.log(time)
                if(this.timeType == 1){//开始时间
                    this.setForm.startDate = time
                    if(this.isM){
                        this.setForm.startM = moment(val).format('YYYY-MM')
                    }
                }else if(this.timeType == 2){ //结束时间
                    if(!moment(this.setForm.startDate).isBefore(time)){
                        return this.$toast('结束时间要大于开始时间!')
                    }
                    if (this.setForm.type == '1') {
                        if (moment(time).diff(this.setForm.startDate, 'days') + 1 > 31) {
                            return this.$toast('最多选31天!')
                        }
                    } else if (this.setForm.type == '2') {
                        if (moment(time).diff(this.setForm.startDate, 'months') + 1 > 12) {
                            return this.$toast('最多选12个月!')
                        }
                    }
                    if(this.isM){//月份只是拿来显示的，后期都需要转换成按天格式的传给后台
                        this.setForm.endM = moment(val).format('YYYY-MM')
                    }
                    this.setForm.endDate = time
                }
                this.dateShow = false;
            },
            cancel(val) {
                this.dateShow = false;
            },
            selectTime(val,type){
                console.log(val)
                this.timeType = val
                this.isM = (type == 'M'? true : false);
                if(this.timeType == 2){
                    if(this.isM){ //月份
                        if(!this.setForm.startM){
                            return this.$toast('请先选择开始月份!')
                        }
                    }else{  //天数
                        if(!this.setForm.startDate){
                            return this.$toast('请先选择开始时间!')
                        }
                    }

                }
                this.dateShow = true;
            },
            handleBack() {
                this.$emit('SET', {show: false});
            },
        }
    }
</script>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
</style>