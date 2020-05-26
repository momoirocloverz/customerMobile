<template>
    <div class="echrts">
        <div v-show="!loading && j.length>0" id="jian" class="echart-box linebdb mb10"></div>
        <div v-show="!loading && d.length>0" id="dai" class="echart-box linebdb mb10"></div>
        <div v-show="!loading && c.length>0" id="che" class="echart-box linebdb mb10"></div>
        <div v-show="!loading && dun.length>0" id="dun" class="echart-box linebdb mb10"></div>
        <van-loading v-show="loading" type="spinner" color="#E95A34" vertical>加载中...</van-loading>
        <div class="pt44 tc fs14" v-show="j.length == 0 && d.length == 0 && c.length == 0 && dun.length == 0 && !loading">暂无相关信息...</div>
    </div>
</template>

<script>
    import Bus from '../../../common/eventBus';

    export default {
        name: "echarts",
        props: {
            data:{
                type: Object,
                default:{}
            },
        },
        data() {
            return {
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
                            rotate:0,
                            fontSize: 10,
                        },
                    },
                    yAxis: {
                        type: 'value',
                        name: '单位:件/H',
                        axisLabel: {}
                    },
                    grid: [{top: "20%", right: "5%", left: "15%", bottom: "15%"}],
                    series: [
                        {
                            name: '件/H',
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
                options2: {},
                options3: {},
                options4: {},
                average: {},
                resData:JSON.parse(JSON.stringify(this.data)),
            }
        },
        watch:{
        },
        computed:{

        },
        created() {

        },
        mounted() {
            let _this = this;
            Bus.$on('send', function (val) {
                console.log('1')
                _this.getData(val,1)
            })
            this.getData()
        },
        methods: {
            getData(val,type) {
                console.log(val)
                console.log(this.data)
                let result ,_this = this;
                this.loading = true
                if(type == 1){
                    this.resData = JSON.parse(JSON.stringify(val));
                    result = this.resData.taskEfficiencies.list || [];
                }else{
                    result = this.resData.taskEfficiencies.list || [];
                }
                console.log(this.resData,'resData')
                console.log(result,'result')
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
            // getOldData() {
            //     console.log('2')
            //     let _this = this;
            //     this.loading = true
            //     let params = {
            //         pageNum: this.currentPage,
            //         pageSize: this.pageSize,
            //         type: this.form.type,
            //         startDate: this.form.startDate,
            //         endDate: this.form.endDate,
            //         taskIds: this.form.taskIds,
            //         status: this.form.status,
            //         managerId: this.form.managerId
            //     }
            //     if (this.form.status == 4) {
            //         delete params.status
            //     } else {
            //         delete params.taskIds
            //     }
            //     this.$api.analysisList(params).then(res => {
            //         if (res.data.respCode == 0) {
            //             console.log('3')
            //             _this.data = res.data.data;
            //             let result = res.data.data.taskEfficiencies.list;
            //             if(result){
            //                 let j = 0, d = 0, c = 0, dun = 0, h = 0;
            //                 for (let item of result) {
            //                     j += Number(JSON.parse(item.cusPieceSizeTotal).jian)
            //                     d += Number(JSON.parse(item.cusPieceSizeTotal).dai)
            //                     c += Number(JSON.parse(item.cusPieceSizeTotal).che)
            //                     dun += Number(JSON.parse(item.cusPieceSizeTotal).jian)
            //                     h += Number(item.attendanceHours)
            //                 }
            //                 _this.average.j = (j / h).toFixed(2);
            //                 _this.average.d = (d / h).toFixed(2);
            //                 _this.average.c = (c / h).toFixed(4);
            //                 _this.average.dun = (dun / h).toFixed(4);
            //                 _this.init()
            //             }else{
            //                 _this.j = [];
            //                 _this.d = [];
            //                 _this.c = [];
            //                 _this.dun = [];
            //             }
            //         }
            //     }).catch(err => {
            //
            //     }).finally(() => {
            //         _this.loading = false
            //     })
            // },

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