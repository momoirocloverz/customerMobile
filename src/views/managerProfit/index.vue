<template>
    <div class="profit-wrap">
        <mt-header title="利润趋势分析" fixed class="mint-header-title">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div class="eff-title fs13 pl10 pr10 linebdb" v-if="!childShow">
            <div class="eff-t-l">
                <div class="span-wrapper">
                    <span class="span-wrapper-i" v-html="wordText"></span>
                    <span class="span-i bg-green">{{form.len > 0? `已选${form.len}个班务经理` :'全部班务经理'}}</span>
                </div>
            </div>
            <div class="cus-btn" @click="childShowFalse()"></div>
        </div>
        <div class="contont-wrap" ref="managerWrap" :class="{'pt72': !childShow}">
            <div class="set-wrap set-manager-wrap" ref="setWrap" v-if="childShow">
                <div class="box-mask-0" v-if="boxShow || childManagerShow"></div>
                <div class="set-body">
                    <ul class="pl15 pt10 pr10 fs14">
                        <li class="pb8">
                            <div class="bg-orange label-text">时段</div>
                            <van-radio-group class="" v-model="form.date">
                                <van-radio name="1">近7天</van-radio>
                                <van-radio name="2">近30天</van-radio>
                                <van-radio name="3" @click="boxShow = true;childManagerShow = false;">
                                    {{form.cusTimeDay ? form.cusTimeDay : '自定义'}}
                                    <img class="icon-date-img" v-show="form.cusTimeDay" src="../../assets/img/xiugai.png" alt="">
                                </van-radio>
                            </van-radio-group>
                        </li>
                        <li class="">
                            <div class="bg-green label-text">班务经理</div>
                            <van-radio-group class="" v-model="form.manager">
                                <van-radio name="">全部班务经理</van-radio>
                                <van-radio name="1" @click="setShow(true)">
                                    {{form.len > 0? `已选${form.len}个班务经理` :'自定义班务经理'}}
                                </van-radio>
                            </van-radio-group>
                        </li>
                    </ul>
                    <div class="cus-btn cus-rota" @click="changeShow()"></div>
                </div>
            </div>
            <div class="managerProfit" ref="managerProfit">
                <div class="content" v-show="active == 1">
                    <ul class="pt12" v-show="!loading && tableData.length > 0">
                        <li class="pt12 pb12 pl10 pr10 fs14 bg-fff" v-for="(item,index) in tableData"
                            :key="index"
                            @click="to(item)"
                        >
                            <p class="fs15">
                                <img class="pr5" src="../../assets/img/anquan-4@2x.png" alt="">{{item.managerName}}
                            </p>
                            <p class="pt5">
                                <span class="span-item"> {{item.inCome.toFixed(2)}}<span class="co-999">收入(元)</span></span>
                                <span class="span-item co-orange"><strong class="fs17">{{item.profit.toFixed(2)}}</strong>收益(元)</span>
                                <span class="span-item"> {{item.expend.toFixed(2)}}<span class="co-999">支出(元)</span></span>
                            </p>
                        </li>
                    </ul>
                    <van-loading v-show="loading" type="spinner" color="#E95A34" vertical>加载中...</van-loading>
                    <div class="pt44 pl30 pr30 tc fs14" v-show="!loading && tableData.length == 0">暂无相关信息...</div>
                </div>
                <Echart :form="form" v-if="active == 2"/>
            </div>
        </div>
        <div class="foot">
            <div class="f-item" :class="{'active': active == 1}" @click="tab('1')">明细</div>
            <div class="f-item" :class="{'active': active == 2}" @click="tab('2')">趋势图</div>
        </div>
        <!--自定义时间-->
        <div class="cus-date-box-mask cus-date-managerbox-mask" v-show="boxShow || childManagerShow"></div>
        <div class="cus-date-box cus-date-managerbox" v-show="boxShow">
            <div class=" input-box" v-show="form.date == '3'">
                <input placeholder="请选择开始时间" readonly type="text" v-model="form.startDate" @click="selectTime(1)">
                <span class="pr10"> - </span>
                <input placeholder="请选择结束时间" readonly type="text" v-model="form.endDate" @click="selectTime(2)">
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
            <!--:max-date="maxDate"-->
        </div>
        <selectManger v-if="childManagerShow" :form="form" @showManger="setShow"></selectManger>
        <!--<Set @SET="setShow" :form="form" v-if="childShow"/>-->
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import Bus from '../../common/eventBus';
    import Echart from './components/echarts'
    import {DatetimePicker} from 'vant';
    import selectManger from './components/selectManger'

    Vue.use(DatetimePicker);
    import 'vant/lib/index.css';

    let moment = require("moment");

    export default {
        name: "",
        components: {Echart, selectManger},
        data() {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 40,
                active: '1',
                wordText2: '',//选中条件的关键词
                tableData: [],
                form: {
                    type: '1',  //1按天 2按月
                    date: '1', //1本月 2上月 3自定义
                    year: '', //1本年度 2自定义
                    startDate: '',
                    endDate: '',
                    status: '',// 全部班务 2进行中的班务 3已结束的班务 4自定义
                    manager: '',
                    managerId: '',
                    managerName: '',
                    taskIds: '',
                    ids: [],
                    result: [],
                    len: 0,
                    classTaskName: '',//班务第一个名称
                    cusTimeDay: '',
                },
                boxShow: false,//时间选择弹出
                childManagerShow: false,//时间选择弹出
                isFirst: false,//首次加载会执行change 方法，在此标记首次加载
                childShow: true, //是否显示设置页面
                resData: {},
                currentDate: new Date(),
                minDate: new Date(2018, 1, 1),
                // maxDate: '',
                dateShow: false,
                modelTime: 'date',
                timeType: 1,//1是开始时间 2是结束时间
                scrollTop:0,
            }
        },
        watch: {
            'form.date': function (val, old) {
                if (this.isFirst) {
                    console.log(val, 'day')
                    if (val == '1') {
                        this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                        this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
                        this.form.cusTimeDay = '';
                        this.boxShow = false;
                        this.childManagerShow = false;
                        this.handleOk();
                    } else if (val == '2') {
                        this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                        this.form.startDate = moment(new Date()).subtract('days', 29).format('YYYY-MM-DD');
                        this.form.cusTimeDay = '';
                        this.boxShow = false;
                        this.childManagerShow = false;
                        this.handleOk();
                    } else {
                        this.form.startDate = '';
                        this.form.endDate = '';
                        this.boxShow = true;
                        this.childManagerShow = false;
                    }
                }
            },
            'form.manager': function (val, oldVal) {
                if (this.isFirst) {
                    console.log(val, 'manager')
                    if (val == '1') {
                        this.setShow(true);
                        this.boxShow = false;
                    } else {
                        this.form.managerId = '';
                        this.form.managerName = ''
                        this.form.ids = []
                        this.form.result = []
                        this.form.len = 0
                        this.childManagerShow = false;
                        this.boxShow = false;
                        this.handleOk();
                    }
                }
            },
        },
        computed: {
            ...mapGetters(['getMFI']),
            wordText() {
                let text = '';
                if (this.form.type == '1') {
                    if (this.form.date == '1') {
                        text += '<span class="bg-orange">近7天</span>'
                    } else if (this.form.date == '2') {
                        text += '<span class="bg-orange">近30天</span>'
                    } else if (this.form.date == '3') {
                        text += `<span class="bg-orange">${this.form.startDate} ~ ${this.form.endDate}</span>`
                    } else {
                    }
                }
                return text;
            }
        },
        filters: {
            _number(cellValue) {
                if (isNaN(Number(cellValue))) {
                    return 0
                } else {
                    return Number(cellValue).toFixed(2)
                }
            },
            statuText(val) {
                let text = '';
                switch (val) {
                    case '2':
                        text = '进行中的班务'
                        break;
                    case '3':
                        text = '已结束的班务'
                        break;
                    case '':
                        text = '全部班务'
                        break;
                    default:
                        text = ''
                        break;
                }
                return text
            },
        },
        created() {
        },
        mounted() {
            let _this = this
            setTimeout(() => {
                //为ture后才可以执行change
                _this.isFirst = true;
            }, 1000)
            window.addEventListener('scroll', this.handleScroll, true)
            let oldId = localStorage.getItem('userOldId');
            let curId = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
            this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
            this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
            if (oldId == curId) {
                if (this.getMFI.ok) { //说明之前设置过，取之前的属性
                    this.form = this.getMFI;
                }
            }
            this.getData();
        },
        methods: {
            ...mapMutations(['SET_MFI']),
            handleScroll() {
                let _this = this;
                let scrollTop = this.$refs.managerProfit.getBoundingClientRect().top;
                this.scrollTop = scrollTop;
                if (scrollTop <= 38) {
                    this.childShow = false;
                    // this.top = true;
                } else {
                    this.childShow = true;
                    // this.top = false;
                }
            },
            to(item) {
                this.$router.push({
                    path: '/managerProfit/profitDetail',
                    query: {
                        startDate: this.form.startDate,
                        endDate: this.form.endDate,
                        ...item,
                    }
                })
            },
            childShowFalse() {
                this.childShow = true;
                this.$nextTick(() => {
                    console.log(this.$refs.managerWrap)
                    this.$refs.managerWrap.scrollTop = 0;//还没有效果，不知道什么问题
                });
            },
            changeShow() {
                if (!this.form.startDate) {
                    return this.$toast('开始时间不能为空!')
                }
                if (!this.form.endDate) {
                    return this.$toast('结束时间不能为空!')
                }
                if (this.form.manager == 1 && !this.form.managerId) {
                    return this.$toast('班务经理不能为空!')
                }
                this.childShow = false;
                this.boxShow = false;
                this.childManagerShow = false;
            },
            handleBack() {
                this.$router.go(-1)
            },
            tab(index) {
                this.active = index;
            },
            getData() {
                let _this = this;
                _this.loading = true;
                let params = {
                    startDate: this.form.startDate,
                    endDate: this.form.endDate,
                    managerIds: this.form.managerId
                }
                this.$api.getClassTaskProfitByManager(params).then(res => {
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            if (res.data.data.classTaskProfitList) {
                                let result = Array.from(res.data.data.classTaskProfitList);
                                this.tableData = result
                            } else {
                                this.tableData = []
                            }
                        }
                    }
                }).catch().finally(() => {
                    _this.loading = false;
                })
            },
            setShow(val) {
                if (typeof val === 'boolean') {
                    this.childManagerShow = val
                }
                if (typeof val === 'object') {
                    this.childManagerShow = val.show;
                    if (val.ok) {
                        this.form.managerId = val.managerId
                        this.form.managerName = val.managerName
                        this.form.ids = val.ids
                        this.form.result = val.result
                        this.form.len = val.len
                        this.handleOk()
                    }else{
                        if(this.form.len <= 0){
                            this.form.manager = '';
                            this.form.managerId = '';
                            this.form.managerName = ''
                            this.form.ids = []
                            this.form.result = []
                            this.form.len = 0
                            this.handleOk()
                        }
                    }
                }
                this.boxShow = false;
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
                let id = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
                //发给父元素
                //发给图表页面兄弟组件用的
                Bus.$emit('sendThr', {show: false, ok: true, ...this.form})
                //记住设置的属性，下次进如果是同一人就取这些属性展示
                this.SET_MFI({show: false, ok: true, ...this.form})
                localStorage.setItem('userOldId', id)
                this.getData()
            },
            confirm(val) {
                let time = moment(val).format('YYYY-MM-DD')
                if (this.timeType == 1) {//开始时间
                    this.form.startDate = time
                } else if (this.timeType == 2) { //结束时间
                    if (!moment(this.form.startDate).isBefore(time)) {
                        return this.$toast('结束时间要大于开始时间!')
                    }
                    if (moment(time).diff(this.form.startDate, 'days') + 1 > 31) {
                        return this.$toast('最多选31天!')
                    }
                    this.form.endDate = time
                }
                this.dateShow = false;
            },
            cancelTwo(){
                if(!this.form.cusTimeDay){
                    this.form.date = '1'
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
                    this.modelTime = 'date'//按天
                    this.handleOk();
                }
                this.childManagerShow = false;
                this.boxShow = false;
            },
            async confirmTime() {
                if (!this.form.startDate) {
                    return this.$toast('开始时间不能为空!')
                }
                if (!this.form.endDate) {
                    return this.$toast('结束时间不能为空!')
                }
                if (this.form.manager == 1 && !this.form.managerId) {
                    return this.$toast('班务经理不能为空!')
                }
                let s1 = this.form.startDate.replace(/-/g, '/');
                let s2 = this.form.endDate.replace(/-/g, '/');
                this.form.cusTimeDay = `${s1} - ${s2}`
                await this.handleOk();
                this.boxShow = false;
            },
            cancel(val) {
                this.dateShow = false;
            },
            selectTime(val) {
                console.log(val)
                this.timeType = val
                if (this.timeType == 2 && !this.form.startDate) {
                    return this.$toast('请先选择开始时间!')
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

    .profit-wrap {
        background-color: #f5f5f5;
        height: 100vh;

        .span-wrapper-i span:first-child {
            margin-left: convertToVw(0);
        }

        .eff-title {
            /*position: fixed;*/
            /*left: 0;*/
            /*right: 0;*/
            /*z-index: 100;*/
            /*display: flex;*/
            /*justify-content: space-between;*/
            /*align-items: center;*/
            /*top: convertToVw(40);*/
            /*height: convertToVw(45);*/
            /*background-color: #fff;*/
        }

        .content {
            ul li {
                p {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
            }
        }
    }
</style>

