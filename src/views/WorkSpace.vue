<template>
    <div class="">
        <mt-header title="工作台" fixed class="mint-header-title"></mt-header>
        <div class="container">
            <div class="ws-cell">
                <div class="ws-cell-item" @click="routeToSalary('/scheduling/index')">
                    <span class="flex">
                        <img src="../../src/assets/img/307-h-1.png" class="task-icon"/>
                        <p class="task-label fs18 pl30">排班考勤统计</p>
                    </span>
                    <img class="ws-item-img" src="../../src/assets/img/right@3x.png" alt=""/>
                </div>
                <div class="ws-cell-item" @click="routeToSalary('/efficiency/index')">
                    <span class="flex">
                        <img src="../../src/assets/img/307-h-2.png" class="task-icon"/>
                        <p class="task-label fs18 pl30">班务效能分析</p>
                    </span>
                    <img class="ws-item-img" src="../../src/assets/img/right@3x.png" alt=""/>
                </div>
                <div class="ws-cell-item" @click="routeToSalary('/profit/index')">
                    <span class="flex">
                        <img src="../../src/assets/img/307-h-3.png" class="task-icon"/>
                        <p class="task-label fs18 pl30">利润趋势分析</p>
                    </span>
                    <img class="ws-item-img" src="../../src/assets/img/right@3x.png" alt=""/>
                </div>
                <div class="ws-cell-item" @click="routeToSalary('/managerProfit/index')">
                    <span class="flex">
                        <img src="../../src/assets/img/307-h-4.png" class="task-icon"/>
                        <p class="task-label fs18 pl30">班务经理利润分析</p>
                    </span>
                    <img class="ws-item-img" src="../../src/assets/img/right@3x.png" alt=""/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "WorkSpace",
        data() {
            return {
            }
        },
        mounted() {

        },
        methods: {
            routeToSalary(path) {
                this.$router.push({path:path});
            },

        },
        beforeDestroy() {
        },
    }
</script>

<style scoped lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .container{
        position: absolute;
        background-color: #F5F5F7;
        left: 0;
        right: 0;
        bottom:convertToVw(55);
    }
    .ws-cell-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-radius: convertToVw(8);
        padding:0 convertToVw(15) 0 convertToVw(30);
        height: convertToVw(90);
        margin: convertToVw(12);
        .task-label{
            color: #333;
        }
        .ws-item-img{
            display: flex;
            width: convertToVw(10);
            height: convertToVw(18);
        }
        .task-icon{
            display: flex;
            width: convertToVw(40);
            height: convertToVw(40);
        }
        img {
            display: flex;
            width: convertToVw(44);
            height: convertToVw(44);
        }
        p {
            text-align: center;
            white-space: nowrap;
            font-size: convertToVw(16);
            color: #E95A34;
        }
    }
</style>

