<template>
    <div class="sched-wrap-detail">

            <van-nav-bar
                    title="考勤"
                    left-text=""
                    right-text=""
                    left-arrow
                    @click-left="onClickLeft"
                    @click-right="onClickRight">
                <van-icon v-show="$route.query.settleStatus == 2  && pdfUrl" name="export" slot="right"></van-icon>
            </van-nav-bar>
        <nav class="sched-nav">
            <Menu :id="$route.query.id" class="task-menu" @screenMenu='screen'/>
        </nav>
        <div class="att-content">
            <ul>
                <li class="bg-fff pt10 pl10 pb10 pr10 lh18">
                    <p class="p-sched fs14 co-999">
                        <span>排班日期: <b class="co-333">{{$route.query.schedulingDate}}</b></span>
                        <span>班务经理: <b class="co-333">{{$route.query.managerName}}</b></span>
                        <span>排班人数: <b class="co-333">{{$route.query.cusAuthorizedNumber}}</b></span>
                        <span>结算状态: <b class="co-333">{{$route.query.schedulingStatus}}</b></span>
                    </p>
                </li>
            </ul>
            <van-list ref="vList"
                    v-model="loading"
                    :finished="finished"
                    :immediate-check="false"
                    :offset="offsetNum"
                    :finished-text="finishedText"
                    @load="onLoad">
                <ul v-show="isHave">
                    <li class="pt10 pl10 pb10 pr10 lh18"
                        v-for="(item,index) in list"
                        :key="index"
                    >
                        <div class="linebdb pb15 mb15 label-box">
                        <span class="fs18">{{item.realNameAlias}}</span>
                        <span class="co-999 pl10">{{item.sexName}}</span>
                        <span class="co-999 pl10">{{item.age}}</span>
                        <span class="label-indus fs12 ml20">{{item.industryName}}</span>
                        <span class="label-settype fs12 ml20">{{item.settlementTypeName}}</span>
                    </div>
                        <p class="p-sched fs14 co-999">
                            <span>工时:     <b class="co-333">&nbsp; {{item.workHours | formatText}}</b></span>
                            <span>产量:       <b class="co-333">&nbsp;{{item.pieceSize | formatSize}}</b></span>
                            <span>开始时间: &nbsp;<b class="co-333" v-show="item.customerStartTime"> {{item.customerStartDate | formatCusDateString}} {{item.customerStartTime | formatCusTimeString}}</b><b v-show="!item.customerStartTime" class="co-orange"> 未打卡</b></span>
                            <span>结束时间: &nbsp;<b class="co-333" v-show="item.customerEndTime"> {{item.customerEndDate | formatCusDateString}} {{item.customerEndTime | formatCusTimeString}}</b><b v-show="!item.customerEndTime" class="co-orange"> 未打卡</b></span>
                        </p>
                    </li>
                </ul>
            </van-list>
        </div>
        <div class="cus-pdf" v-show="showType == 2">
            <div class="vant-nav-top">
                <van-nav-bar
                        title="确认表"
                        left-text=""
                        left-arrow
                        @click-left="onLeftShow()"
                        @click-right="rightExport">
                    <van-icon name="export" slot="right"></van-icon>
                </van-nav-bar>
            </div>
            <div class="pdf-wrap">
                <img :src='pdfUrl' alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import Menu from './components/dropdown';

    export default {
        name: "schedDetail",
        components:{Menu},
        data() {
            return {
                list: [],
                loading: false,
                request:false,
                finished: false,
                offsetNum:1,
                currentPage: 1,
                pageSize: 20,
                pageCount: 1,
                total: 0,
                industry:'',
                settlementType:'',
                talentType:1,
                showType:1,
                pdfUrl:'',
                finishedText: '没有更多了',
            }
        },
        filters: {
            formatCusTimeString(val) {
                if (val) {
                    return val.substring(0, 5)
                } else {
                    return '无'
                }
            },
            formatCusDateString(val) {
                if (val) {
                    return val.substring(5, 10)
                } else {
                    return ''
                }
            },
            formatText(val){
              if(val){
                  return `${val}小时`
              }else{
                  return '无'
              }
            },
            formatSize(val) {
                if (val) {
                    let datas = JSON.parse(val)
                    let content = (datas.jian == '' || datas.jian == '0' || !datas.jian ? '' : datas.jian + '件') +
                        (datas.dai == '' || datas.dai == '0' || !datas.dai ? '' : datas.dai + '袋,') +
                        (datas.che == '' || datas.che == '0' || !datas.che ? '' : datas.che + '车,') +
                        (datas.dun == '' || datas.dun == '0' || !datas.dun ? '' : datas.dun + '吨,')
                    return content || '无'
                } else {
                    return '无'
                }
            },
        },
        computed: {
            isHave() {
                return this.list.length == 0 ? false : true;
            }
        },
        mounted() {
            console.log(this.$route.query)
            this.getList()
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1)
            },
            screen(val){
                console.log(val)
                this.industry = val.industry;
                this.settlementType = val.settlementType;
                this.currentPage = 1;
                this.onLoad()
            },
            rightExport(){
                window.open(this.pdfUrl)
            },
            onLoad() {
                let _this = this;
                if(_this.request){return}
                _this.request = true;
                // 异步更新数据
                _this.finishedText = '加载中...';
                setTimeout(async () => {
                   await _this.getList();
                    _this.request = false;
                    // 加载状态结束
                    // 数据全部加载完成
                },1000);
            },
            getList(TYPE) {
                let _this = this;
                // _this.list = [];
                const params = {
                    industry:this.industry,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    schedulingId: this.$route.query.id,
                    settlementType: this.settlementType,
                    talentType: this.talentType,
                }
                this.$api.shedEmployee(params).then((res) => {
                    const {data, respCode} = res.data;
                    if (respCode === 0) {
                        const {list, nextPage, total, pageNum} = data;
                        _this.currentPage = nextPage || 1;
                        console.log(list)
                        if(pageNum > 1){//说明请求的是加载更多
                            _this.list = _this.list.concat(Array.from(list)) || [];
                        }else{
                            _this.list = list || [];
                        }
                        if(list){
                            _this.pdfUrl = _this.list[0].pdfUrl || '';
                            console.log(_this.pdfUrl)
                        }
                        _this.loading = false;
                        if (!list || list.length < 20) { //没有数据或者数据不满足一页20条，说明没有更多了
                            _this.finished = true;
                            _this.finishedText = '没有更多了';
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {

                });
            },
            onLeftShow(){
                this.showType = 1;
            },
            onClickRight() {
                this.showType = 2;
            }
        }
    }
</script>

<style lang="scss">
    $design_width: 375;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .sched-wrap-detail {
        .pdf-wrap{
            display: flex;
            overflow: hidden;
            height: convertToVw(532);
        }
        .sched-nav{
            position: fixed;
            top: convertToVw(40);
            left: 0;
            right: 0;
            z-index:230;
        }
        .att-content {
            position: fixed;
            top: convertToVw(75);
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            background-color: #F5F5F7;
            overflow-y: auto;

            ul li {
                margin: convertToVw(12);
                border-radius: convertToVw(8);
                background-color: #fff;
                .label-box{
                    display: flex;
                    justify-content:flex-start;
                    align-items:center;
                    .label-indus{
                        display: flex;
                        height:convertToVw(22);
                        padding:0 convertToVw(5);
                        min-width: convertToVw(36);
                        justify-content: center;
                        align-items: center;
                        border-radius:convertToVw(4);
                        color: #fff;
                        background-color: #439DFF;
                    }
                    .label-settype{
                        display: flex;
                        height:convertToVw(22);
                        width: convertToVw(36);
                        justify-content: center;
                        align-items: center;
                        border-radius:convertToVw(4);
                        color:#C4340F;
                        background-color:#fce8e3;
                    }
                }
                .p-sched {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    width: 100%;

                    span {
                        display: flex;
                        width: 50%;
                    }
                }
            }
        }
    }
    .cus-pdf{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        padding-top: convertToVw(40);
        overflow-y: auto;
        z-index:232;
        .vant-nav-top{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
        }
        img{
            display: block;
            width: 100%;
        }
    }
</style>