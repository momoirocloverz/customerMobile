<template>
    <div class="efficiency-wrap">
        <mt-header title="效能分析" fixed class="mint-header-title">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div class="eff-title fs13 pl5 pr10 linebdb" v-show="!childShow">
            <div class="eff-t-l">
                <div class="span-wrapper">
                    <span class="span-wrapper-i" v-html="wordText"></span>
                    <span class="span-i bg-green">{{form.managerName? form.managerName : '全部班务经理'}}</span>
                    <span class="span-i bg-red" v-show="form.status != '4'">{{form.status | statuText}}</span>
                    <span class="span-i bg-red" v-show="form.status == '4'">{{form.len > 0? `已选${form.len}个班务` :'自定义班务'}}</span>
                </div>
            </div>
            <div class="cus-btn" @click="childShowFalse()"></div>
        </div>
        <div class="contont-wrap" ref="contontWrap" :class="{'pt72': !childShow && !form.cusTimeYear && !form.cusTimeDay,'pt110': !childShow && (form.cusTimeYear || form.cusTimeDay)}">
            <!--<Set @SET="setShow" :form="form" v-if="childShow"/>  :class="{'pos-top':top}" -->
            <div class="set-wrap" ref="setWrap" v-if="childShow">
                <div class="box-mask-0" v-if="boxShow || childManagerShow || childClassShow"></div>
                <div class="set-body">
                    <ul class="pl15 pt10 pr10 fs14">
                        <li class="pb8">
                            <div class="bg-blue label-text">维度</div>
                            <van-radio-group @change="changeType" class="" v-model="form.type">
                                <van-radio name="1">按天</van-radio>
                                <van-radio name="2">按月</van-radio>
                            </van-radio-group>
                        </li>
                        <li class="pb8">
                            <div class="bg-orange label-text">时段</div>
                            <van-radio-group @change="changeDay" v-show="form.type == 1" class="" v-model="form.date">
                                <van-radio name="1">近7天</van-radio>
                                <van-radio name="2">近30天</van-radio>
                                <van-radio name="3" @click="boxShow = true;childManagerShow = false;childClassShow = false;">{{form.cusTimeDay ? form.cusTimeDay : '自定义'}} <img class="icon-date-img" v-show="form.cusTimeDay" src="../../assets/img/xiugai.png" alt=""></van-radio>
                            </van-radio-group>
                            <van-radio-group @change="changeYear" v-show="form.type == 2" class="" v-model="form.year">
                                <van-radio name="1">本年度</van-radio>
                                <van-radio name="2" @click="boxShow = true;childManagerShow = false;childClassShow = false;">{{form.cusTimeYear ? form.cusTimeYear : '自定义'}} <img class="icon-date-img" v-show="form.cusTimeYear" src="../../assets/img/xiugai.png" alt=""></van-radio>
                            </van-radio-group>
                        </li>
                        <li class="pb8">
                            <div class="bg-green label-text">班务经理</div>
                            <van-radio-group class="" @change="changeManager" v-model="form.manager">
                                <van-radio name="">全部班务经理</van-radio>
                                <van-radio name="1" @click="showManger(true)">{{form.managerName? form.managerName : '自定义'}}</van-radio>
                            </van-radio-group>
                        </li>
                        <li class="pb8">
                            <div class="bg-red label-text">班务</div>
                            <van-radio-group class="" @change="changeClass" v-model="form.status">
                                <van-radio name="">全部</van-radio>
                                <van-radio name="2">进行中</van-radio>
                                <van-radio name="3">已结束</van-radio>
                                <van-radio name="4" @click="classShow(true)">{{form.classTaskName? `已选${form.len}个班务` :
                                    '自定义'}}
                                </van-radio>
                            </van-radio-group>
                        </li>
                    </ul>
                    <div class="cus-btn cus-rota" @click="changeShow()"></div>
                </div>
                <!--:max-date="maxDate"-->
            </div>
            <div  ref="efficieny">
                <div class="content" v-show="active == 1">
                    <ul class="pt12" v-show="!loading && tableData.length > 0">
                        <li class="pt12 pl15 pr15 pb10 fs14 bg-fff" v-for="(item,index) in tableData" :key="index">
                            <p class="pb5 fs15">
                                <img class="pr5" src="../../assets/img/anquan-4@2x.png" alt=""> {{item.schedulingDate ||
                                item.months}}
                            </p>
                            <p class="pb5 p-item">
                                <span><b class="co-999">核定人数：</b>{{item.cusAuthorizedNumber}}人</span><span><b class="co-999">出勤人数：</b>{{item.attendanceCount}}人</span>
                            </p>
                            <p class="pb5 p-item">
                                <span class="span-2"><b class="co-999">出勤率：</b>{{item.attendanceCount==0||item.cusAuthorizedNumber==0?0+'%':((item.attendanceCount/item.cusAuthorizedNumber)*100).toFixed(2)+'%'}}</span>
                                <span><b class="co-999">出勤工时：</b>{{item.attendanceHours}} 小时</span>
                            </p>
                            <p class="pb5 p-item">
                                <span><b class="co-999">结算工时：</b>{{item.cusSettlementHours}}小时</span>
                            </p>
                            <p class="">
                                <b class="co-999">产量：</b>
                                {{JSON.parse(item.cusPieceSizeTotal).jian}}件、{{JSON.parse(item.cusPieceSizeTotal).dai}}袋、{{JSON.parse(item.cusPieceSizeTotal).che}}车、{{JSON.parse(item.cusPieceSizeTotal).dun
                                | _number}}吨
                            </p>
                            <div class="divider pt10 mb10">
                                <span class="before"></span>
                                <span class="after"></span>
                            </div>
                            <p class="co-orange">
                                <b class="co-999 min-w-label">效率：</b>
                                <span class="min-w-conten">
                                    {{item.attendanceHours==0||JSON.parse(item.cusPieceSizeTotal).jian==0?0:((JSON.parse(item.cusPieceSizeTotal).jian/item.attendanceHours)).toFixed(2)}}件/H、
                                    {{item.attendanceHours==0||JSON.parse(item.cusPieceSizeTotal).dai==0?0:((JSON.parse(item.cusPieceSizeTotal).dai/item.attendanceHours)).toFixed(2)}}袋/H、
                                    {{item.attendanceHours==0||JSON.parse(item.cusPieceSizeTotal).che==0?0:((JSON.parse(item.cusPieceSizeTotal).che/item.attendanceHours)).toFixed(4)}}车/H、
                                    {{item.attendanceHours==0||JSON.parse(item.cusPieceSizeTotal).dun==0?0:((JSON.parse(item.cusPieceSizeTotal).dun/item.attendanceHours)).toFixed(4)}}吨/H
                                </span>
                            </p>
                        </li>
                    </ul>
                    <van-loading v-show="loading" type="spinner" color="#E95A34" vertical>加载中...</van-loading>
                    <div class="pt44 pl30 pr30 tc fs14" v-show="!loading && tableData.length == 0">暂无相关信息...</div>
                </div>
                <div class="echrts" v-show="active == 2">
                    <div v-show="!loading && j.length>0" id="jian" class="echart-box linebdb mb10"></div>
                    <div v-show="!loading && d.length>0" id="dai" class="echart-box linebdb mb10"></div>
                    <div v-show="!loading && c.length>0" id="che" class="echart-box linebdb mb10"></div>
                    <div v-show="!loading && dun.length>0" id="dun" class="echart-box linebdb mb10"></div>
                    <van-loading v-show="loading" type="spinner" color="#E95A34" vertical>加载中...</van-loading>
                    <div class="pt44 tc fs14" v-show="j.length == 0 && d.length == 0 && c.length == 0 && dun.length == 0 && !loading">暂无相关信息...</div>
                </div>
            </div>
        </div>
        <selectManger v-if="childManagerShow" :form="form" @showManger="showManger"></selectManger>
        <selectClassWork v-if="childClassShow" :form="form" @showClassWork="classShow"></selectClassWork>
        <!--自定义时间-->
        <div class="cus-date-box-mask" v-show="boxShow || childManagerShow"></div>
        <div class="cus-date-box" v-show="boxShow">
            <div class=" input-box" v-show="(form.type == 1 && form.date == '3')">
                <input placeholder="请选择开始时间" readonly type="text" v-model="form.startDate" @click="selectTime(1)">
                <span class="pr10"> - </span>
                <input placeholder="请选择结束时间" readonly type="text" v-model="form.endDate" @click="selectTime(2)">
            </div>
            <div class=" input-box" v-show="(form.type == 2 && form.year == '2')">
                <input placeholder="请选择开始月份" readonly type="text" v-model="form.startM" @click="selectTime(1,'M')">
                <span class="pr10"> - </span>
                <input placeholder="请选择结束月份" readonly type="text" v-model="form.endM" @click="selectTime(2,'M')">
            </div>
            <div class="box-btn pt20">
                <span class="cancel-2" @click="cancelTwo()">取消</span>
                <span class="confirm-2" @click="confirmTime()">确定</span>
            </div>
        </div>
        <div class="mask" v-show="dateShow">

        </div>
        <div class="foot foot-date" style="z-index:115;" v-show="dateShow">
            <van-datetime-picker class="w100"
                                 v-model="currentDate"
                                 :type="modelTime"
                                 :min-date="minDate"
                                 @confirm="confirm"
                                 @cancel="cancel"
            />
        </div>
        <div class="foot">
            <div class="f-item" :class="{'active': active == 1}" @click="tab('1')">明细</div>
            <div class="f-item" :class="{'active': active == 2}" @click="tab('2')">趋势图</div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import {DatetimePicker} from 'vant';
    import selectManger from './components/selectManger'
    import selectClassWork from './components/selectClassWork'
    let moment = require("moment");
    Vue.use(DatetimePicker);
    import mixins from '../../components/changeMixins'
    export default {
        name: "",
        components: {selectManger, selectClassWork},
        mixins: [mixins],
        data() {
            return {
                currentPage: 1,
                pageSize: 40,
                active: '1',
                wordText2: '',//选中条件的关键词
                tableData: [],
                //子页面合并
                currentDate: new Date(),
                resData: {},
                loading: false,
                minDate: new Date(2018, 1, 1),
                // maxDate: '',
                dateShow: false,
                timeType: 1,//1是开始时间 2是结束时间
                isM: false,//1是否月份
                childShow: true,
                childManagerShow: false, //是否显示子页面
                childClassShow: false, //是否显示子页面
                scrollTop:0,
                top:false,
            }
        },
        computed: {
            ...mapGetters(['getEFI']),
            wordText() {
                let text = '';
                if (this.form.type == '1') {
                    text += '<span class="bg-blue">按天</span>'
                    if (this.form.date == '1') {
                        text += '<span class="bg-orange">近7天</span>'
                    } else if (this.form.date == '2') {
                        text += '<span class="bg-orange">近30天</span>'
                    } else if (this.form.date == '3') {
                        text += `<span class="bg-orange">${this.form.startDate} ~ ${this.form.endDate}</span>`
                    } else {
                    }
                } else if (this.form.type == '2') {
                    text += '<span class="bg-blue">按月</span>'
                    if (this.form.year == '1') {
                        text += '<span class="bg-orange">本年度</span>'
                    } else if (this.form.year == '2') {
                        text += `<span class="bg-orange">${this.form.startDate} ~ ${this.form.endDate}</span>`
                    } else {
                    }
                }
                return text;
            }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll, true)
            let oldId = localStorage.getItem('userOldId');
            let curId = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
            this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
            this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
            if (oldId == curId) {
                if (this.getEFI.ok) { //说明之前设置过，取之前的属性
                    this.form = this.getEFI;
                }
            }
            this.getData();
        },
        methods: {
            ...mapMutations(['SET_EFI']),
            handleScroll(){
                let _this = this;
                let scrollTop = this.$refs.efficieny.getBoundingClientRect().top;
                this.scrollTop = scrollTop;
                console.log(scrollTop)
                if(scrollTop <= 38){
                    this.childShow = false;
                    // this.top = true;
                }else{
                    if((this.form.cusTimeYear || this.form.cusTimeDay) && scrollTop <= 68){
                        this.childShow = false;
                    }else{
                        this.childShow = true;
                    }
                    // this.top = false;
                }
            },
            childShowFalse(){
                this.childShow = true;
                this.$nextTick(() => {
                    this.$refs.contontWrap.scrollTop = 0;//还没有效果，不知道什么问题
                });
                // if(this.scrollTop > 38){
                //     //悬浮
                //     this.top = false;
                // }else{
                //     this.top = true;
                // }
                // console.log(this.scrollTop,this.top)
            },
            handleBack() {
                this.$router.go(-1)
            },
            tab(index) {
                this.active = index;
            },
            async confirmTime(){
                if (!this.form.startDate) {
                    return this.$toast('开始时间不能为空!')
                }
                if (!this.form.endDate) {
                    return this.$toast('结束时间不能为空!')
                }
                if (this.form.manager == 1 && !this.form.managerId) {
                    return this.$toast('班务经理不能为空!')
                }
                if (this.form.status == 4 && !this.form.taskIds) {
                    return this.$toast('班务不能为空!')
                }
                let s1 = this.form.startDate.replace(/-/g, '/');
                let s2 = this.form.endDate.replace(/-/g, '/');
                if(this.form.type == 1){
                    this.form.cusTimeDay = `${s1} - ${s2}`
                }else if(this.form.type == 2){
                    this.form.cusTimeYear = `${s1} - ${s2}`
                }
                await this.handleOk();
                this.boxShow = false;
            },
            getData() {
                let _this = this;
                _this.loading = true
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    type: this.form.type,
                    startDate: this.form.startDate,
                    endDate: this.form.endDate,
                    taskIds: this.form.taskIds,
                    status: this.form.status,
                    managerId: this.form.managerId
                }
                if (this.form.status == 4) {
                    delete params.status
                } else {
                    delete params.taskIds
                }
                this.$api.analysisList(params).then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        this.resData = res.data.data;
                        console.log(this.resData)
                        if (res.data.data.taskEfficiencies.list) {
                            this.tableData = res.data.data.taskEfficiencies.list
                        } else {
                            this.tableData = [];
                        }
                        this.getEchartData()
                    }
                }).catch().finally(() => {
                    _this.loading = false
                })
            },

            handleOk() {
                if (!this.form.startDate) {
                    return this.$toast('开始时间不能为空!')
                }
                if (!this.form.endDate) {
                    return this.$toast('结束时间不能为空!')
                }
                if (this.form.manager == 1 && !this.form.managerId) {
                    return this.$toast('班务经理不能为空!')
                }
                if (this.form.status == 4 && !this.form.taskIds) {
                    return this.$toast('班务不能为空!')
                }
                let id = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
                //发给父元素
                // //发给图表页面兄弟组件用的
                // Bus.$emit('send',{show: false,ok:true,...this.form})
                // //记住设置的属性，下次进如果是同一人就取这些属性展示
                this.SET_EFI({show: false, ok: true, ...this.form});
                localStorage.setItem('userOldId', id);
                this.boxShow = false;
                this.getData()
                // this.$emit('SET', {
                //     show: false,ok:true,...this.form,
                // });
            },
            
            confirm(val) {
                let time = '';
                if (this.form.type == '1') {//按天
                    time = moment(val).format('YYYY-MM-DD')
                } else {//按月
                    if (this.timeType == 1) { //开始时间
                        time = moment(val).startOf("month").format('YYYY-MM-DD');
                    } else { //结束时间
                        time = moment(val).endOf('month').format('YYYY-MM-DD');
                    }
                }
                console.log(time)
                if (this.timeType == 1) {//开始时间
                    this.form.startDate = time
                    if (this.isM) {
                        this.form.startM = moment(val).format('YYYY-MM')
                    }
                } else if (this.timeType == 2) { //结束时间
                    if (!moment(this.form.startDate).isBefore(time)) {
                        return this.$toast('结束时间要大于开始时间!')
                    }
                    if (this.form.type == '1') {
                        if (moment(time).diff(this.form.startDate, 'days') + 1 > 31) {
                            return this.$toast('最多选31天!')
                        }
                    } else if (this.form.type == '2') {
                        if (moment(time).diff(this.form.startDate, 'months') + 1 > 12) {
                            return this.$toast('最多选12个月!')
                        }
                    }
                    if (this.isM) {//月份只是拿来显示的，后期都需要转换成按天格式的传给后台
                        this.form.endM = moment(val).format('YYYY-MM')
                    }
                    this.form.endDate = time
                }
                this.dateShow = false;
            },
            cancel(val) {
                this.dateShow = false;
            },
            selectTime(val, type) {
                console.log(val)
                this.timeType = val
                this.isM = (type == 'M' ? true : false);
                if (this.timeType == 2) {
                    if (this.isM) { //月份
                        if (!this.form.startM) {
                            return this.$toast('请先选择开始月份!')
                        }
                    } else {  //天数
                        if (!this.form.startDate) {
                            return this.$toast('请先选择开始时间!')
                        }
                    }

                }
                this.dateShow = true;
            },
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.handleScroll, true)
        },
    }
</script>
<style>
    .ws-cell-item {
        /* margin: 1.22rem !important; */
    }
</style>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .efficiency-wrap {
        background-color: #f5f5f5;
        height: 100vh;
    }
    .van-loading {
        text-align: center;
        padding-top: convertToVw(50);
    }

    .echrts {
        /*overflow-y: scroll;*/
        overflow-x: hidden;
        /*position: fixed;*/
        left: 0;
        right: 0;
        /*top: convertToVw(93);*/
        /*bottom: convertToVw(45);*/
        /*background-color: #fff;*/
        z-index: 101;
        .echart-box {
            width: 100vw;
            height: convertToVw(230);
            background: #ffffff;
            overflow: hidden;
        }
    }
</style>

