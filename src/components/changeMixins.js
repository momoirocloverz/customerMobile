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
            //以下是echars
            currentPage: 1,
            pageSize: 40,
            loading: false,
            j: [],
            d: [],
            c: [],
            dun: [],
            options: {
                tooltip: {
                    trigger: 'axis'
                },
                title: {
                    text: '平均处理效率:  件/H',
                    textStyle: {
                        //文字颜色
                        // fontcolor:'#E95A34',
                        //字体风格,'normal','italic','oblique'
                        fontStyle: 'normal',
                        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                        fontWeight: '500',
                        //字体系列
                        //字体大小
                        fontSize: 12
                    },
                    top: '4%',
                    left: 'center'
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
                        // fontcolor:'#E95A34',
                        rotate:0,
                        fontSize: 10,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '单位:件/H',
                    axisLabel: {
                        fontSize: 10,
                    }
                },
                grid: [{top: "20%", right: "5%", left: "15%", bottom: "15%"}],
                series: [
                    {
                        name: '件/H',
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
            options2: {},
            options3: {},
            options4: {},
            average: {},
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
        //echars 初始话
        getEchartData() {
            let result = this.tableData ,_this = this;
            this.loading = true
            if(result.length > 0){
                let j = 0, d = 0, c = 0, dun = 0, h = 0;
                for (let item of result) {
                    j += Number(JSON.parse(item.cusPieceSizeTotal).jian)
                    d += Number(JSON.parse(item.cusPieceSizeTotal).dai)
                    c += Number(JSON.parse(item.cusPieceSizeTotal).che)
                    dun += Number(JSON.parse(item.cusPieceSizeTotal).jian)
                    h += Number(item.attendanceHours)
                }
                _this.average.j = (j / h).toFixed(2);
                _this.average.d = (d / h).toFixed(2);
                _this.average.c = (c / h).toFixed(4);
                _this.average.dun = (dun / h).toFixed(4);
                _this.init()
            }else{
                _this.j = [];
                _this.d = [];
                _this.c = [];
                _this.dun = [];
            }
            _this.loading = false
        },
        init() {
            this.options.xAxis.data = this.resData.x;
            this.j = this.resData.jian.filter(i => i > 0);
            this.d = this.resData.dai.filter(i => i > 0);
            this.c = this.resData.che.filter(i => i > 0);
            this.dun = this.resData.dun.filter(i => i > 0);
            let jEchart = this.$echarts.init(document.querySelector("#jian"));
            let dEchart = this.$echarts.init(document.querySelector("#dai"));
            let cEchart = this.$echarts.init(document.querySelector("#che"));
            let dunEchart = this.$echarts.init(document.querySelector("#dun"));
            //件
            this.options.title.text = `平均处理效率: ${this.average.j} 件/H`;
            this.options.yAxis.name = '单位: 件/H'
            this.options.series[0].name = '件/H'
            this.options.series[0].data = this.resData.jian.map(it => {
                if (it === 0) {
                    return null;
                } else {
                    return it;
                }
            })
            console.log(this.options)
            jEchart.setOption(this.options, true);
            //袋

            this.options2 = Object.assign({}, this.options)
            this.options2.title.text = `平均处理效率: ${this.average.d} 袋/H`;
            this.options2.series[0].data = this.resData.dai.map(it => {
                if (it === 0) {
                    return null;
                } else {
                    return it;
                }
            })
            this.options2.yAxis.name = '单位: 袋/H'
            this.options2.series[0].name = '袋/H'
            dEchart.setOption(this.options2, true);
            console.log(this.options2)
            //车
            this.options3 = Object.assign({}, this.options)
            this.options3.title.text = `平均处理效率: ${this.average.c} 车/H`;
            this.options3.series[0].data = this.resData.che.map(it => {
                if (it === 0) {
                    return null;
                } else {
                    return it;
                }
            })
            this.options3.yAxis.name = '单位: 车/H'
            this.options3.series[0].name = '车/H'
            console.log(this.options3)
            cEchart.setOption(this.options3, true);
            //吨
            this.options4 = Object.assign({}, this.options)
            this.options4.title.text = `平均处理效率: ${this.average.dun} 吨/H`;
            this.options4.series[0].data = this.resData.che.map(it => {
                if (it === 0) {
                    return null;
                } else {
                    return it;
                }
            })
            this.options4.yAxis.name = '单位: 吨/H'
            this.options4.series[0].name = '吨/H'
            console.log(this.options4)
            dunEchart.setOption(this.options4, true);
            jEchart.resize();
            dEchart.resize();
            cEchart.resize();
            dunEchart.resize();
        },
    }
};

export default mixins