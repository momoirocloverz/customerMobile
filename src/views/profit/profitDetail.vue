<template>
    <div class="profit-wrap-detail">
        <mt-header :title="title" fixed class="mint-header-title">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div class="content">
            <div class="detail-item">
                <div class="fs16 pb10">
                    <strong><img src="../../assets/img/307-1.png" class="pr5" alt="">收入</strong>
                    <span @click="to()" class="co-orange go-btn fright fs14">收入明细></span>
                </div>
                <ul class=" fs14">
                    <li class=""><span>班务</span>
                        <span>金额(元)</span></li>
                    <li class="fs14" v-for="(item,index) in tableData.incomeList"
                        :key="index"
                    >
                        <span>{{item.classTaskName}}</span>
                        <span>{{item.inCome | _number}}</span>
                    </li>
                    <li class="line-dashed mt5 mb5"></li>
                    <li class=""><span>合计</span>
                        <span class="co-orange">{{tableData.incomeTotal.toFixed(2)}}</span></li>
                </ul>
            </div>
            <div class="detail-item">
                <div class="fs16 pb10"><strong><img src="../../assets/img/307-2.png" class="pr5" alt="">支出</strong></div>
                <ul class="fs14 ">
                    <li class=""><span>事项</span>
                        <span>金额(元)</span></li>
                    <li class="fs14 " v-for="(item,index) in tableData.expendList"
                        :key="index"
                    >
                        <span>{{item.title}}</span>
                        <span>{{item.expend | _number}}</span>
                    </li>
                    <li class="line-dashed mt5 mb5"></li>
                    <li class="">
                        <span class="co-333">合计</span>
                        <span class="co-orange"> {{tableData.expendTotal.toFixed(2)}}</span>
                    </li>
                </ul>
            </div>
            <div class="detail-item">
                <div class="fs16 pb10"><strong><img src="../../assets/img/307-3.png" class="pr5" alt="">利润</strong></div>
                <ul class="fs14 ">
                    <li class=""><span>事项</span>
                        <span>金额(元)</span></li>
                    <li class="fs14 " v-for="(item,index) in tableData.profitList"
                        :key="index"
                    >
                        <span>{{item.title}}</span>
                        <span class="co-orange">{{item.profit | _number}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    let moment = require("moment");


    export default {
        name: "",
        data() {
            return {
                title: '利润明细',
                tableData: {
                    incomeList: [],
                    expendList: [
                        {title: '应付零工', expend: 0},
                        {title: '奖惩合计', expend: 0},
                    ],
                    profitList: [{title: '利润', profit: 0}],
                    incomeTotal: 0,
                    expendTotal: 0,
                },
            }
        },
        computed: {
            ...mapGetters(['getIsSet']),
        },
        filters: {
            _number(cellValue) {
                if (isNaN(Number(cellValue))) {
                    return 0
                } else {
                    return Number(cellValue).toFixed(2)
                }
            },
        },
        watch: {},
        created() {
        },
        mounted() {
            this.title = `利润明细 ${this.$route.query.createAt} ${this.$route.query.managerName ? this.$route.query.managerName : ''}`;
            this.getData();
        },
        methods: {
            ...mapMutations(['IS_SET']),
            to() {
                this.$router.push({
                    path: "/profit/incomeDetail",
                    query: {
                        ...this.$route.query
                    }
                })
            },
            handleBack() {
                this.$router.go(-1)
            },
            getData() {
                let params = {
                    classTaskDate: this.$route.query.createAt,
                    startDate: this.$route.query.startDate,
                    endDate: this.$route.query.endDate,
                    managerId: this.$route.query.managerId,
                    nameAlias: this.$route.query.managerName,
                    status: this.$route.query.status,
                    type: this.$route.query.type,
                    taskIds: this.$route.query.taskIds,
                }
                if (this.$route.query.status == 4) {
                    delete params.status
                } else {
                    delete params.taskIds
                }
                this.$api.classTaskProfitDetail(params).then(res => {
                    if (res.data.respCode == 0) {
                        this.tableData.incomeList = res.data.data.inComelist || [];
                        this.tableData.profitList[0].profit = res.data.data.profit || 0;
                        this.tableData.expendList[0].expend = res.data.data.classTaskExpend.schuduleInCome || 0;
                        this.tableData.expendList[1].expend = res.data.data.classTaskExpend.rewardsPenalties || 0;
                        if(this.tableData.incomeList.length && this.tableData.incomeList.length > 0){
                            for (let item of this.tableData.incomeList) {
                                this.tableData.incomeTotal += Number(item.inCome)
                            }
                        }
                        if(this.tableData.expendList.length && this.tableData.expendList.length > 0){
                            for (let item of this.tableData.expendList) {
                                this.tableData.expendTotal += Number(item.expend)
                            }
                        }
                    }
                }).catch()
            },

        },
        beforeDestroy() {
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

</style>

