<template>
    <div class="echrts-pro">
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
</template>

<script>
    import Vue from 'vue';
    import Bus from '../../../common/eventBus';
    import {DropdownMenu, DropdownItem} from 'vant';
    Vue.use(DropdownMenu).use(DropdownItem);

    export default {
        name: "echarts",
        props: {
            form: {
                type: Object,
            }
        },
        data() {
            return {
                currentPage: 1,
                pageSize: 40,
                loading: false,
                show:false,
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
                formCopy:{},
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
                        }
                    },
                    grid: [{top: "20%", right: "5%", left: "15%", bottom: "30%"}],
                    series: [
                        {
                            name: '收入',
                            type: 'line',
                            smooth: true,
                            data: [],
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
        watch:{
            'formStatement.dataSource':function (val,oldVal) {
                this.init();
            }
        },
        created() {
            let _this = this;
            Bus.$on('sendTwo', function (val) {
                console.log(val)
                _this.getData(val)
            })
        },
        mounted() {
            this.formCopy = JSON.parse(JSON.stringify(this.form));
            this.getData()
        },
        methods: {
            getData(val) {
                this.loading = true
                this.show = true;
                if(val && val.ok){
                    this.formCopy = JSON.parse(JSON.stringify(val));
                }
                let params = {
                    type: this.formCopy.type,
                    startDate: this.formCopy.startDate,
                    endDate: this.formCopy.endDate,
                    taskIds: this.formCopy.taskIds,
                    status: this.formCopy.status,
                    managerId: this.formCopy.managerId
                }
                if (this.formCopy.status == 4) {
                    delete params.status
                } else {
                    delete params.taskIds
                }
                this.$api.classTaskProfit(params).then(res => {
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            if (res.data.data.classTaskProfitList) {
                                let {expendTotal, expend, inComeTotal, inCome, profitTotal, profit,x} = res.data.data;
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
                            this.options.xAxis.data = res.data.data.x;
                            console.log(this.formStatement);
                            this.init()
                        }
                    }
                }).catch(err => {

                }).finally(() => {
                    this.loading = false
                })
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
    }
</script>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .van-loading {
        text-align: center;
        padding-top: convertToVw(50);
    }

    .echrts-pro{
        /*overflow-y: scroll;*/
        /*overflow-x: hidden;*/
        /*position: fixed;*/
        /*left: 0;*/
        /*right: 0;*/
        /*top: convertToVw(93);*/
        /*bottom: convertToVw(45);*/
        background-color: #fff;
        z-index: 101;
        .echart-radio{
            display: flex;
            justify-content: space-around;
            justify-items: center;
            .van-radio{
                margin-right: convertToVw(20);
            }
        }
        .echart-box {
            width: 100vw;
            height: convertToVw(280);
            background: #ffffff;
            overflow: hidden;
        }
    }
</style>