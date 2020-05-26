<template>
    <div class="income-wrap-detail">
        <mt-header :title="title" fixed class="mint-header-title">
            <mt-button icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <div class="content">
            <div class="pt10 pl20 pb10 co-orange">{{`${$route.query.startDate}~ ${$route.query.endDate}`}}</div>
            <ul v-show="tableData.length > 0">
                <li class="pt10 pb10 pl20 pr20 fs14 bg-fff" v-for="(item,index) in tableData"
                    :key="index"
                    @click="to(item)"
                >
                    <p class="pb5 p-head fs16">
                        <strong>{{item.classTaskName}}</strong>
                        <span class="co-orange">{{item.inCome.toFixed(2)}}元</span>
                    </p>
                    <p class=" ">
                        <span class="co-999">工时</span> <span class="pl20">{{item.cusSettlementHours.toFixed(1)}}</span>
                    </p>
                    <p class=" ">
                        <span class="co-999">产量</span> <span class="pl20">{{item.jian.toFixed(0)}}件、{{item.dai.toFixed(0)}}袋、{{item.che.toFixed(2)}}车、{{item.dun.toFixed(2)}}吨</span>
                    </p>
                    <p class=" ">
                        <span class="co-999 min-w-label">单价</span> <span class="min-w-conten">{{item.price | forPrice}}</span>
                    </p>
                </li>
            </ul>
            <div class="pt44 pl30 pr30 tc fs14" v-show="tableData.length == 0">暂无相关信息...</div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    export default {
        name: "",
        data() {
            return {
                title:'收入明细',
                tableData: [],
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
            forPrice(val){
                    let salary = JSON.parse(val)
                    if(salary && salary.price){
                        for (let item of salary.price) {
                            let content = ''
                            if (salary.valuationType == 1) {
                                content = `${item.countTime}元/小时`
                            } else if (salary.valuationType == 8) {
                                content = `${item.countFixed}元/天`
                            } else if (salary.valuationType == 2) {
                                if (salary.unit == 1) {
                                    content = `${item.countSettle}元/件`
                                } else if (salary.unit == 2) {
                                    content = `${item.countDai}元/袋`
                                } else if (salary.unit == 3) {
                                    content = `${item.countChe}元/车`
                                } else {
                                    content = `${item.countDun}元/吨`
                                }
                            } else if (salary.valuationType == 3) {
                                let varUnit
                                if (salary.unit == 1) {
                                    varUnit = '件'
                                } else if (salary.unit == 2) {
                                    varUnit = '袋'
                                } else if (salary.unit == 3) {
                                    varUnit = '车'
                                } else {
                                    varUnit = '吨'
                                }
                                content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                                for (let z in item.ladderObj) {
                                    if (z > 0 && z != (item.ladderObj.length - 1)) {
                                        content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`
                                    }
                                }
                                content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                            } else if (salary.valuationType == 4) {
                                if (item.countSettle) {
                                    content += `${item.countSettle}元/件,`
                                }
                                if (item.countDai) {
                                    content += `${item.countDai}元/袋,`
                                }
                                if (item.countChe) {
                                    content += `${item.countChe}元/车,`
                                }
                                if (item.countDun) {
                                    content += `${item.countDun}元/吨`
                                }
                            } else if (salary.valuationType == 5) {

                                if (salary.unit == 1) {
                                    content += `${item.countSettle}元/件，`
                                } else if (salary.unit == 2) {
                                    content += `${item.countDai}元/袋，`
                                } else if (salary.unit == 3) {
                                    content += `${item.countChe}元/车，`
                                } else {
                                    content += `${item.countDun}元/吨，`
                                }
                                content += `${item.countTime}元/小时`
                            } else if (salary.valuationType == 6) {
                                content += `${item.countTime}元/小时,`
                                let varUnit
                                if (salary.unit == 1) {
                                    varUnit = '件'
                                } else if (salary.unit == 2) {
                                    varUnit = '袋'
                                } else if (salary.unit == 3) {
                                    varUnit = '车'
                                } else {
                                    varUnit = '吨'
                                }
                                content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                                for (let z in item.ladderObj) {
                                    if (z > 0 && z != (item.ladderObj.length - 1)) {
                                        content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                                    }
                                }
                                content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                            } else {

                                if (item.countSettle) {
                                    content += `${item.countSettle}元/件,`
                                }
                                if (item.countDai) {
                                    content += `${item.countDai}元/袋,`
                                }
                                if (item.countChe) {
                                    content += `${item.countChe}元/车,`
                                }
                                if (item.countDun) {
                                    content += `${item.countDun}元/吨,`
                                }
                                content += `${item.countTime}元/小时`
                            }
                            return content
                        }
                    }else{
                        return ''
                    }
            }
        },
        watch: {},
        created() {
        },
        mounted() {
            this.title = `收入明细 ${this.$route.query.managerName? this.$route.query.managerName : ''}`
            this.getData();
        },
        methods: {
            ...mapMutations(['IS_SET']),
            to(item){

            },
            handleBack() {
                this.$router.go(-1)
            },
            getData() {
                let params = {
                    managerId: this.$route.query.managerId,
                    name: this.$route.query.managerName,
                    startDate:this.$route.query.startDate,
                    endDate:this.$route.query.endDate,
                }
                this.$api.getInComeDetailByManager(params).then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        this.tableData = Array.from(res.data.data);
                    }
                }).catch()
            },

        },
        beforeDestroy() {
        },
    }
</script>
<style>
</style>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .income-wrap-detail{
        .content {
            overflow-y: scroll;
            position: fixed;
            left: 0;
            right: 0;
            top: convertToVw(40);
            bottom:0;
            padding-bottom: convertToVw(40);
            z-index: 100;
            ul li{
                border-radius:convertToVw(8);
                margin:0 convertToVw(12) convertToVw(12);
                p{
                    display: flex;
                }
                .p-head{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }
        }

    }

</style>

