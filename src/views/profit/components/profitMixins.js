let moment = require("moment");
let mixins = {

    data: function () {
        return {
            form: {
                type: '1',  //1按天 2按月
                date: '1', //1本月 2上月 3自定义
                year: '1', //1本年度 2自定义
                startDate: '',
                endDate: '',
                startM: '',
                endM: '',
                status: '',// 全部班务 2进行中的班务 3已结束的班务 4自定义
                manager: '',
                managerId: '',
                managerName: '',
                taskIds: '',
                ids: [],
                result: [],
                len: 0,
                classTaskName: '',//班务第一个名称
                cusTimeDay:'',
                cusTimeYear:'',
            },
            modelTime: 'date',
            boxShow:false,//时间选择弹出
            isFirst:false,//首次加载会执行change 方法，在此标记首次加载
            //echarts
            formStatement:{
                dataSource: '1',
                inCome: 0,
                inComeList: [],
                expend: 0,
                expendList: [],
                profit: 0,
                profitList: [],
                x:[],
            },
            show:false,
            resData:{},
            options: {
                tooltip: {
                    trigger: 'axis',
                    // formatter: function (data, index) {
                    //     console.log(data)
                    //     // return Number(data[0].value).toFixed(2)
                    // }
                },
                toolbox: {
                    show: false,
                    // feature: {
                    //     dataView: {readOnly: false},
                    //     magicType: {type: ['line', 'bar']},
                    // }
                },
                dataZoom: [{
                    type: 'slider',
                    show: false,
                    xAxisIndex: [0],
                    left: '15%',
                    bottom: -5,
                    start:0,
                    zoomLock:true,
                    end:100 //初始化滚动条
                }, {
                    type: 'inside',
                    zoomLock:true,
                }],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    name: '',
                    data: [],
                    axisLabel: {
                        rotate:0,
                        fontSize: 10,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '收入',
                    axisLabel: {
                        fontSize: 10,
                    }
                },
                grid: [{top: "20%", right: "5%", left: "15%", bottom: "30%"}],
                series: [
                    {
                        name: '收入',
                        type: 'line',
                        smooth: true,
                        data: [],
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    color:'#E95A34'
                                },
                            }
                        },
                        label: {
                            normal: {
                                show: false,
                                position: 'top',
                                fontSize: 10,
                                formatter: function (value, index) {
                                    return value.toFixed(2);
                                }
                            }
                        },
                    }
                ]
            },
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
    watch: {
        'formStatement.dataSource':function (val,oldVal) {
            this.init();
        }
    },
    mounted() {
        let _this = this
        setTimeout(()=>{
            //为ture后才可以执行change
            _this.isFirst = true;
        },1000)
    },
    methods: {
        changeType(val){
            if(this.isFirst){
                console.log(val,'type')
                if (val == '1') {
                    this.form.date = '1'
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
                    this.modelTime = 'date'//按天
                    this.handleOk();
                } else if (val == '2') {
                    this.form.year = '1'
                    this.form.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.modelTime = 'year-month'//按月
                    this.handleOk();
                }
                console.log(this.form.startDate, this.form.endDate)
            }
        },
        changeDay(val){
            if(this.isFirst) {
                console.log(val, 'day')
                if (val == '1') {
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
                    this.form.cusTimeDay = '';
                    this.handleOk();
                } else if (val == '2') {
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.form.startDate = moment(new Date()).subtract('days', 29).format('YYYY-MM-DD');
                    this.form.cusTimeDay = '';
                    this.handleOk();
                } else {
                    this.form.startDate = '';
                    this.form.endDate = '';
                    this.boxShow = true;
                }
            }
        },
        changeYear(val){
            if(this.isFirst) {
                console.log(val, '--year')
                if (val == '1') {
                    this.form.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.form.cusTimeYear = '';
                    this.handleOk();
                } else if (val == '2') {
                    this.form.startDate = '';
                    this.form.startM = '';
                    this.form.endM = '';
                    this.form.endDate = '';
                    this.boxShow = true;
                }
            }
        },
        changeManager(val){
            if(this.isFirst) {
                console.log(val, 'manager')
                if (val == '1') {
                    this.showManger(true);
                } else {
                    this.form.managerId = '';
                    this.form.managerName = '';
                    this.childManagerShow = false;
                    this.handleOk();
                }
            }
        },
        changeClass(val){
            if(this.isFirst) {
                console.log(val, 'class')
                if (val != '4') {
                    this.form.taskIds = '';
                    this.form.classTaskName = '';
                    this.form.len = 0;
                    this.form.ids = [];
                    this.form.result = [];
                    this.childClassShow = false;
                    this.handleOk();
                } else {
                    this.classShow(true);
                }
            }
        },
        //合并后的
        showManger(val) {
            if (typeof val === 'boolean') {
                if (this.form.len > 0) {
                    this.$messagebox({
                        title: `提示`,
                        message: `自定义班务经理后，原自定义已选择的班务将清空，需重新选择。`,
                        showCancelButton: true,
                        confirmButtonText: "确认",
                        cancelButtonText: "取消"
                    }).then(action => {
                        if (action == 'confirm') {
                            this.form.taskIds = '';
                            this.form.classTaskName = '';
                            this.form.len = 0;
                            this.form.ids = [];
                            this.form.result = [];
                            this.childManagerShow = val
                            this.form.status = '';
                            this.handleOk()
                        } else {

                        }
                    })
                } else {
                    this.childManagerShow = val
                }
            }
            if (typeof val === 'object') {
                this.childManagerShow = val.show;
                if (val.ok) {
                    this.form.managerId = val.managerId
                    this.form.managerName = val.managerName
                    this.handleOk()
                }else{
                    if(!this.form.managerId){
                        this.form.manager = '';
                        this.handleOk()
                    }
                }
            }
            this.boxShow = false;
            this.childClassShow = false;
        },
        cancelTwo(){
            if (this.form.type == '1') {
                if(!this.form.cusTimeDay){
                    this.form.date = '1'
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.form.startDate = moment(new Date()).subtract('days', 6).format('YYYY-MM-DD');
                    this.modelTime = 'date'//按天
                    this.handleOk();
                }
            } else if (this.form.type == '2') {
                if(!this.form.cusTimeYear) {
                    this.form.year = '1'
                    this.form.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.form.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.modelTime = 'year-month'//按月
                    this.handleOk();
                }
            }
            this.childClassShow = false;
            this.childManagerShow = false;
            this.boxShow = false;
        },
        classShow(val) {
            if (typeof val === 'boolean') {
                this.childClassShow = val
            }
            console.log(this.form)
            if (typeof val === 'object') {
                this.childClassShow = val.show;
                if (val.ok) {
                    this.form.taskIds = val.taskIds;
                    this.form.classTaskName = val.classTaskName;
                    this.form.len = val.len;
                    this.form.ids = val.ids;
                    this.form.result = val.result;
                    this.handleOk()
                }else{
                    if(this.form.len <= 0){
                        this.form.status = '';
                        this.handleOk()
                    }
                }
            }
            this.boxShow = false;
            this.childManagerShow = false;
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
            if (this.form.status == 4 && !this.form.taskIds) {
                return this.$toast('班务不能为空!')
            }
            this.childShow = false;
            this.boxShow = false;
            this.childManagerShow = false;
            this.childClassShow = false
        },
        getEchartData() {
            this.loading = true
            this.show = true;
            if (this.tableData.length > 0) {
                let {expendTotal, expend, inComeTotal, inCome, profitTotal, profit,x} = this.resData;
                this.formStatement.inCome = inComeTotal.toFixed(2)
                this.formStatement.inComeList = inCome
                this.formStatement.expend = expendTotal.toFixed(2)
                this.formStatement.expendList = expend
                this.formStatement.profit = profitTotal.toFixed(2)
                this.formStatement.profitList = profit
            } else {
                this.formStatement.inCome = 0
                this.formStatement.inComeList = []
                this.formStatement.expend = 0
                this.formStatement.expendList = []
                this.formStatement.profit = 0
                this.formStatement.profitList = []
            }
            this.options.xAxis.data = this.resData.x;
            console.log(this.formStatement);
            this.init()
            this.loading = false
        },
        init() {
            let jEchart = this.$echarts.init(document.querySelector("#profit"));
            //件
            if(this.formStatement.dataSource == 1){
                this.options.yAxis.name = '收入'
                this.options.series[0].name = '收入'
                this.options.series[0].data = this.formStatement.inComeList.map(it => {
                    if (it === 0) {
                        return null;
                    } else {
                        return it.toFixed(2);
                    }
                })
            }else if(this.formStatement.dataSource == 2){
                this.options.yAxis.name = '支出'
                this.options.series[0].name = '支出'
                this.options.series[0].data = this.formStatement.expendList.map(it => {
                    if (it === 0) {
                        return null;
                    } else {
                        return it.toFixed(2);
                    }
                })
            }else if(this.formStatement.dataSource == 3){
                this.options.yAxis.name = '利润'
                this.options.series[0].name = '利润'
                this.options.series[0].data = this.formStatement.profitList.map(it => {
                    if (it === 0) {
                        return null;
                    } else {
                        return it.toFixed(2);
                    }
                })
            }
            this.handleShowNull(this.options.series[0].data)
            jEchart.setOption(this.options, true);
            jEchart.resize();
        },
        handleShowNull(list){
            if(list.every(it=>it===0)){
                this.show = true;
            }else {
                this.show = false;
            }
        },
    }
};

export default mixins