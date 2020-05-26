<template>
    <div class="selectClass">
        <mt-header title="选择班务" fixed class="mint-header-title pl10" style="z-index:2">
            <mt-button class="" icon="back" slot="left" @click="handleBack"></mt-button>
        </mt-header>
        <section class="class-search bg-fff">
            <van-search
                    v-model="keyWord"
                    placeholder="请输入班务名称"
                    show-action
                    shape="round"
            >
                <div class="pl10" slot="action" @click="onSearch">搜索</div>
            </van-search>
        </section>
        <div class="m-body">
            <div class="fs14 lh26">
                <!--<ul v-for="(item,index) in dataList" :key="index" v-show="currentIndex == index">-->
                <ul>
                    <li class="li-item" v-for="(chilidItem,chilidItemIndex) in list"
                        :key="chilidItemIndex"
                        @click="chenge(chilidItem,chilidItemIndex)">
                        <img v-show="!classForm.ids.includes(chilidItem.classTaskId)" class="img-icon"
                             src="../../../assets/img/check_hollow.png" alt="">
                        <img v-show="classForm.ids.includes(chilidItem.classTaskId)" class="img-icon"
                             src="../../../assets/img/check_filled.png" alt="">
                        <div class="li-content">
                            {{`${chilidItem.classTaskName}`}}
                            <span class="fs12 co-999">{{`(${chilidItem.startTime.substring(0,10)} - ${chilidItem.endTime ?
                        chilidItem.endTime.substring(0,10) : '永久'})`}}</span>
                        </div>
                    </li>
                    <li class="tc pt44" v-show="list.length == 0">
                        暂无相关信息...
                    </li>
                </ul>
            </div>
        </div>
        <div class="foot-btn foot-class">
            <div class="img-btn" @click="showClass()">
                <img class="mr10" :class="{'scaleDraw':scaleShow}" src="../../../assets/img/shop.png" alt="">
                已选
                <span class="num-i" :class="{'scaleDraw':scaleShow}" v-show="classForm.ids && classForm.ids.length>0">{{classForm.ids && classForm.ids.length}}</span>
                <strong style="color:#EA441A">{{(classForm.ids && classForm.ids.length) || 0}}</strong>
                个
            </div>
            <div class="btn-ok-class fs14" @click="handOk()">
                确认(已选{{(classForm.ids && classForm.ids.length) || 0}}个班务)
            </div>
        </div>
        <REMOVE v-if="showManger" @del="hide" :list="Array.from(classForm.result)"/>
    </div>
</template>

<script>
    import REMOVE from './delete'

    export default {
        name: "selectClassWork",
        components: {REMOVE},
        props: {
            form: {
                type: Object,
            }
        },
        data() {
            return {
                list:[],
                dataList: [
                    {
                        isRequest: false, //是否请求过
                        list: [],
                        statu: '1',//不传全部、1未开始、2进行中、3已结束
                        name: '未开始'
                    },
                    {
                        isRequest: false,
                        list: [],
                        statu: '2',
                        name: '进行中'
                    },
                    {
                        isRequest: false,
                        list: [],
                        statu: '3',
                        name: '已结束'
                    }
                ],
                currentIndex: 0,
                showManger: false,
                classForm: {},
                keyWord:'',
                scaleShow:false,
            }
        },
        watch:{

        },
        mounted() {
            this.classForm = JSON.parse(JSON.stringify(this.form))
            console.log(this.classForm);
            this.handeGetManagerList()
            // this.handeGetManagerList(0)
            // this.handeGetManagerList(1)
            // this.handeGetManagerList(2)
        },
        methods: {
            onSearch(){
                this.handeGetManagerList()
            },
            handleBack() {
                this.$emit('showClassWork', {show: false});
            },
            tab(item, index) {
                console.log(item)
                this.currentIndex = index;
            },
            hide(val) { //删除之后的数据
                this.showManger = val.show;
                if (val.ok) {
                    this.classForm.ids = val.value;
                    this.classForm.result = val.list;
                }
            },
            showClass() {
                if (this.classForm.ids.length == 0) {
                    return
                }
                console.log('1')
                this.showManger = true
            },
            chenge(item, index) {
                let _this = this;
                if(this.scaleShow){
                    return
                }
                let idIndex = this.classForm.ids.indexOf(item.classTaskId);
                if (idIndex > -1) {
                    this.classForm.result.splice(idIndex, 1)
                    this.classForm.ids.splice(idIndex, 1)
                } else {
                    this.classForm.ids.push(item.classTaskId)
                    this.classForm.result.push(item)
                }
                this.scaleShow = true;
                setTimeout(function () {
                    _this.scaleShow = false;
                },400)
            },
            handOk() {
                if (this.classForm.ids.length == 0) {
                    return this.$toast('班务不能为空!')
                }
                this.classForm.taskIds = this.classForm.ids.join(',');
                this.classForm.classTaskName = this.classForm.result[0].classTaskName;
                this.classForm.len = this.classForm.ids.length;
                this.$emit('showClassWork', {
                    show: false,
                    ok: true,
                    ...this.classForm,
                });
            },
            handeGetManagerList() {
                let _this = this;
                let params = {
                    status:'',
                    managerId: _this.classForm.managerId,
                    taskName:_this.keyWord,
                };
                this.$api.getTaskList(params).then(res => {
                    if (res.data.respCode === 0) {
                        let result = res.data.data;
                        let arr = [];
                        if(result){
                            for (let [key, value] of Object.entries(result)) {
                                arr.push(value);
                            }
                            this.list = [...this.$flatten(arr)]
                        }else{
                            this.list = []
                        }
                        // currentItem.list = arr
                    }
                })
                console.log(_this.list)
            },
        }
    }
</script>

<style lang="scss" scoped>
    $design_width: 375;
    $orange_color: #E95A34;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .scaleDraw{
        -webkit-animation: scale .5s ease-in-out;
    }
    @keyframes scale {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
        0%{
            transform: scale(1);  /*开始为原始大小*/
        }
        25%{
            transform: scale(1.2); /*放大1.1倍*/
        }
        50%{
            transform: scale(1.1);
        }
        75%{
            transform: scale(1);
        }
    }
    .selectClass {
        position: fixed;
        background-color:#F6F6F8;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 106;
        .tab-ul {
            position: absolute;
            left: 0;
            right: 0;
            top: convertToVw(40);
            display: flex;
            flex: 1;

            li {
                display: flex;
                flex: .33;
                height: convertToVw(35);
                align-items: center;
                justify-content: center;
            }

            .li-active {
                color: $orange_color;
                border-bottom: 1px solid $orange_color;
            }
        }
        .class-search{
            position: absolute;
            left: 0;
            right: 0;
            top: convertToVw(40);
            height: convertToVw(40);
            box-sizing: border-box;
            padding: convertToVw(3) convertToVw(15) convertToVw(0);
            .van-search .van-cell{
                padding:convertToVw(1) convertToVw(8) convertToVw(1) convertToVw(0);
            }
        }
        .m-body {
            position: absolute;
            left: 0;
            right: 0;
            top: convertToVw(80);
            bottom: convertToVw(45);
            overflow-y: scroll;
            .li-item {
                display: flex;
                margin: convertToVw(12);
                padding:0 convertToVw(10);
                height: convertToVw(60);
                justify-content: flex-start;
                align-items: center;
                flex-direction: row;
                background-color: #fff;
                border-radius: convertToVw(8);
                .li-content{
                    padding-left: convertToVw(3);
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    line-height: 1.6;
                    flex-wrap: wrap;
                }
                .img-icon {
                    display: flex;
                    height: convertToVw(16);
                    width: convertToVw(16);
                }
            }

            .label-wrap {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;

                .s-label {
                    display: flex;
                    height: convertToVw(26);
                    border-radius: convertToVw(5);
                    justify-content: center;
                    align-items: center;
                    min-width: convertToVw(50);
                    padding: 0 convertToVw(10);
                    margin-bottom: convertToVw(10);
                    border: 1px solid #e5e5e5;
                }

                .label-active {
                    color: $orange_color;
                    border-color: $orange_color;
                }
            }
        }

    }
</style>