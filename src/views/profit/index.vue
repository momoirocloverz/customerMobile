<template>
    <div class="profit-wrap">
        <mt-header title="利润趋势分析" fixed class="mint-header-title pl10">
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
        <div class="contont-wrap" ref="profitWrap" :class="{'pt72': !childShow && !form.cusTimeYear && !form.cusTimeDay,'pt110': !childShow && (form.cusTimeYear || form.cusTimeDay)}">
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
            <div ref="profitContent">
                <div class="content" v-show="active == 1">
                    <ul class="pt12" v-show="!loading && tableData.length > 0">
                        <li class="pt12 pb12 pl10 pr10 fs14 bg-fff" v-for="(item,index) in tableData"
                            :key="index"
                            @click="to(item)"
                        >
                            <p class="fs15">
                                <img class="pr5" src="../../assets/img/anquan-4@2x.png" alt="">{{item.createAt}}
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
                <div class="echrts-pro" v-show="active == 2">
                    <div class="pl10">
                        <van-dropdown-menu active-color="#E75A34"  class="w25" :overlay="false">
                            <van-dropdown-item
                                    class="w25"
                                    v-model="formStatement.dataSource"
                                    :options="[
                                        { text: '收入', value: '1'},
                                        { text: '支出', value: '2'},
                                        { text: '利润', value: '3'}
                                     ]" />
                        </van-dropdown-menu>
                        <!--<van-radio-group class="fs14 echart-radio" v-model="formStatement.dataSource">-->
                            <!--<van-radio name="1" checked-color="#E95A34">收入</van-radio>-->
                            <!--<van-radio name="2" checked-color="#E95A34">支出</van-radio>-->
                            <!--<van-radio name="3" checked-color="#E95A34">利润</van-radio>-->
                        <!--</van-radio-group>-->
                    </div>
                    <div id="profit" v-show="!show && !loading" class="echart-box mb10"></div>
                    <van-loading v-show="loading" type="spinner" color="#E95A34" vertical>加载中...</van-loading>
                    <div class="pt44 pb40 tc fs14" v-show="show && !loading">暂无相关信息...</div>
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
        <!--<Set @SET="setShow" :form="form" v-if="childShow"/>-->
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import selectManger from './components/selectManger'
    import selectClassWork from './components/selectClassWork'
    import {DropdownMenu, DropdownItem, DatetimePicker} from 'vant';
    Vue.use(DropdownMenu).use(DropdownItem).use(DatetimePicker);
    let moment = require("moment");
    import mixins from './components/profitMixins'


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
                loading:false,
                //子页面合并
                currentDate: new Date(),
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
            ...mapGetters(['getPFI']),
            wordText() {
                let text = '';
                if (this.form.type == '1') {
                    text += '<span class="bg-blue ml6">按天</span>'
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
                        text = '进行中班务'
                        break;
                    case '3':
                        text = '已结束班务'
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
        watch: {},
        created() {
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll, true)
            let oldId = localStorage.getItem('userOldId');
            let curId = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
            this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
            this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
            if(oldId == curId){
                if(this.getPFI.ok){ //说明之前设置过，取之前的属性
                    this.form = this.getPFI;
                }
            }
            this.getData();
        },
        methods: {
            ...mapMutations(['SET_PFI']),
            handleScroll(){
                let _this = this;
                let scrollTop = this.$refs.profitContent.getBoundingClientRect().top;
                this.scrollTop = scrollTop;
                if(scrollTop <= 38){
                    this.childShow = false;
                    // this.top = true;
                }else{
                    this.childShow = true;
                    // this.top = false;
                }
            },
            childShowFalse(){
                this.childShow = true;
                this.$nextTick(() => {
                    this.$refs.profitWrap.scrollTop = 0;//还没有效果，不知道什么问题
                });
                // if(this.scrollTop > 38){
                //     //悬浮
                //     this.top = false;
                // }else{
                //     this.top = true;
                // }
                // console.log(this.scrollTop,this.top)
            },
            to(item){
                this.$router.push({
                    path:'/profit/profitDetail',
                    query:{
                        ...this.form,
                        ...item,
                    }
                })
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
                this.$api.classTaskProfit(params).then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            this.resData = res.data.data;
                            if (res.data.data.classTaskProfitList) {
                                let result = Array.from(res.data.data.classTaskProfitList);
                                this.tableData = result
                            } else {
                                this.tableData = []
                            }
                        }
                        this.getEchartData();
                    }
                }).catch().finally(()=>{
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
                //发给图表页面兄弟组件用的
                // Bus.$emit('sendTwo',{show: false,ok:true,...this.form})
                // //记住设置的属性，下次进如果是同一人就取这些属性展示
                this.SET_PFI({show: false, ok: true, ...this.form});
                localStorage.setItem('userOldId', id);
                this.boxShow = false;
                this.getData()
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

    .van-loading {
        text-align: center;
        padding-top: convertToVw(50);
    }

</style>

