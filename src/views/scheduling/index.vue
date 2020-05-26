<template>
    <div class="sched-wrap">
        <header class="sched-header pr5">
            <div class="van-nav-bar__left" @click="onClickLeft">
                <i class="van-icon van-icon-arrow-left fs18 co-fff van-nav-bar__arrow"><!----></i>
            </div>
            <van-search
                    class="w90"
                    v-model="value"
                    placeholder="输入所属班务搜索"
                    @focus="focusFoot"
                    @blur="blurFoot"
                    show-action
                    shape="round"
            >
                <div slot="action" class="co-fff" @click="onSearch">搜索</div>
            </van-search>
        </header>
        <nav class="sched-nav">
            <Menu class="task-menu" @screenMenu='screen'/>
        </nav>
        <div class="att-content" :class="{'att-b':isSearch == true}">
            <van-list ref="vList"
                      v-model="loading"
                      :finished="finished"
                      :immediate-check="true"
                      :offset="offsetNum"
                      :finished-text="finishedText"
                      @load="onLoad">
                <ul v-show="isHave">
                    <li class="bg-fff pt10 pl15 pb15 pr10 lh18"
                        v-for="(item,index) in list"
                        :key="index"
                        @click="goItem(item)"
                    >
                        <h4 class="fs18 pb5">{{item.schedulingName}}</h4>
                        <p class="p-sched fs14 co-999">
                            <span>班务:     <b class="co-333">{{item.taskName}}</b></span>
                            <span>班务经理: <b class="co-333">{{item.managerNameAlias}}</b></span>
                            <span>开始时间: <b class="co-333">{{item.schedulingDate | formatCusDateString}}&nbsp;{{item.workStartTime}}</b></span>
                            <span>结束时间: <b class="co-333">{{item | endTimeFormatter}}</b></span>
                        </p>
                    </li>
                </ul>
            </van-list>
            <!--<van-loading v-show="request" type="spinner" color="#E95A34" vertical>加载中...</van-loading>-->
            <!--<div class="pt44 tc fs14" v-show="!isHave && !request">暂无相关信息...</div>-->
        </div>
        <div class="foot" :class="{'foot-hidden':isSearch === true}">
            <div class="f-item" :class="{'active': active == 1}" @click="tab('1')">待确认</div>
            <div class="f-item" style="background-color:#FCE8E3" :class="{'active': active == 2}" @click="tab('2')">
                待结算
            </div>
            <div class="f-item" :class="{'active': active == 3}" @click="tab('3')">已结算</div>
        </div>
    </div>
</template>

<script>
    import Menu from './components/dropdownMenu';

    let moment = require("moment");

    export default {
        name: "sched",
        components: {Menu},
        data() {
            return {
                list: [],
                active: '1',
                loading: false,
                request: false,
                finished: false,
                offsetNum: 1,
                currentPage: 1,
                pageSize: 20,
                value: "",
                value1: '',
                value2: '',
                form: {
                    selectType: '2',
                    status: '1',
                    managerId: '',
                    taskId: '',
                    settlementType: "",
                    startDate: '',
                    endDate: '',
                },
                isSearch: false,
                finishedText: '没有更多了',
            }
        },
        filters: {
            endTimeFormatter(item) {
                let endWorkType = ''
                if (Number(item.endWorkType) === 1) {
                    endWorkType = item.schedulingDate.substring(5, 10);
                } else if (Number(item.endWorkType) === 2) {
                    let now = moment(item.schedulingDate).add(1, 'days').format('YYYY-MM-DD');
                    console.log(now);
                    endWorkType = now.substring(5, 10);
                }
                return `${endWorkType} ${item.workEndTime}`
            },
            formatCusDateString(val) {
                if (val) {
                    return val.substring(5, 10)
                } else {
                    return ''
                }
            },
        },

        computed: {
            isHave() {
                return this.list.length == 0 ? false : true;
            }
        },
        mounted() {
            // this.getList()
        },
        beforeRouteEnter(to, from, next) {
            console.log(to, from)
            if (from.path == "/scheduling/detail") {
                to.meta.isBack = true;
            } else {
                to.meta.isBack = false;
            }
            next();
        },
        activated() {
            if (!this.$route.meta.isBack) {
                this.list = [];
                this.active = '1';
                this.value = '';
                this.value1 = '';
                this.value2 = '';
                this.offsetNum = 1;
                this.currentPage = 1;
                this.pageSize = 20;
                this.loading = false;
                this.isSearch = false;
                this.finishedText = '没有更多了';
                this.form.selectType = '2';
                this.form.status = '1';
                this.form.managerId = '';
                this.form.taskId = '';
                this.form.settlementType = '';
                this.form.settlementType = '';
                this.form.startDate = '';
                this.form.endDate = '';
                this.onLoad()
            } else {
                this.$route.meta.isBack = false;
                /*列表重新加载*/
            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1)
            },
            screen(val) {
                console.log(val)
                this.currentPage = 1;
                this.form.taskId = val.taskId
                this.form.managerId = val.managerId
                if (val.startDate) {
                    this.form.startDate = val.startDate
                }
                if (val.endDate) {
                    this.form.endDate = val.endDate
                }
                this.onLoad()
            },
            blurFoot() {
                this.isSearch = false
            },
            focusFoot() {
                this.isSearch = true
            },
            goItem(item) {
                this.$router.push({
                    name: 'scheduDetail',
                    query: item,
                })
            },
            onSearch() {
                console.log(this.value)
                this.currentPage = 1;
                this.onLoad()
            },
            onLoad() {
                let _this = this;
                if (_this.request) {
                    return
                }
                _this.request = true;
                // 异步更新数据
                _this.finishedText = '加载中...';
                setTimeout(async () => {
                    await _this.getList();
                    _this.request = false;
                    // 加载状态结束
                    // 数据全部加载完成
                }, 1000);
            },
            getList(TYPE) {
                let _this = this;
                // _this.list = [];
                // _this.finished = false;
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    status: this.form.status,
                    assignmentInfoId: this.form.taskId,
                    keyWords: this.value,
                    selectType: this.form.selectType,
                    managerId: this.form.managerId,
                    startDate: this.form.startDate,
                    endDate: this.form.endDate,
                }
                this.$api.scheduleList(params).then((res) => {
                    const {data, respCode} = res.data;
                    if (respCode === 0) {
                        const {list, nextPage, total, pageNum} = data;
                        _this.currentPage = nextPage || 1;
                        if (pageNum > 1) {
                            _this.list = _this.list.concat(Array.from(list));
                        } else { //1说明请求的是第一页
                            _this.list = list || [];
                        }
                        _this.loading = false;
                        if (!list || list.length < 20) {
                            _this.finished = true;
                            _this.finishedText = '没有更多了';
                        }
                        console.log(nextPage)
                    }
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {

                });
            },
            tab(index) {
                if (this.active == index) {
                    return
                }
                this.active = index;
                this.form.status = index;
                this.currentPage = 1;
                this.list = [];
                this.onLoad()
            },
            onClickRight() {
                console.log(2)
            }
        }
    }
</script>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }

    .sched-wrap {
        .sched-header {
            position: relative;
            display: flex;
            flex: 1;
            height: convertToVw(40);
            background-color: #E95A34;
            justify-content: flex-end;
            align-items: center;

            .van-field__control {
                font-size: convertToVw(14);
            }

            .van-search {
                padding: convertToVw(5);
                background-color: rgba(0, 0, 0, 0) !important;

                .van-cell {
                    padding: convertToVw(2);
                }
            }

            .van-nav-bar__left {
                left: convertToVw(10);
                top: convertToVw(12);
            }
        }

        .sched-nav {
            position: fixed;
            top: convertToVw(40);
            left: 0;
            right: 0;
            z-index: 230;
        }

        .att-b {
            bottom: convertToVw(0) !important;
        }

        .att-content {
            position: fixed;
            top: convertToVw(75);
            left: 0;
            right: 0;
            z-index: 1;
            bottom: convertToVw(45);
            /*height:86.5vh;*/
            background-color: #F5F5F7;
            overflow-y: auto;

            ul li {
                margin: convertToVw(12);
                border-radius: convertToVw(8);

                .p-sched {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    width: 100%;

                    b {
                        display: inline-block;
                        max-width: convertToVw(120);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    span {
                        display: flex;
                        width: 50%;
                    }
                }
            }
        }

        .foot {
            .active {
                background-color: #E75A34 !important;
                color: #fff;
            }
        }

        .foot-hidden {
            position: inherit !important;
        }
    }
</style>