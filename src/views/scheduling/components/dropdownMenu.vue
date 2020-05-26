<template>
    <div class="wrap-drop">
        <van-dropdown-menu :close-on-click-overlay="true" :close-on-click-outside="false">
            <van-dropdown-item v-model="value2" :title-class="class2" :title="title2" :options="option2"
                               @change="changeValue(2)"/>
            <van-dropdown-item v-model="value3" :title-class="class3" :title="title3" :options="option3"
                               @change="changeValue(3)"/>
            <van-dropdown-item title="筛选" ref="item" :title-class="class4">
                <div class="dro-body">
                    <ul class="pt20 pb20 pl20 pr20">
                        <li class="pb15">
                            <div class="pb10">选择时段:</div>
                            <van-radio-group class="" v-model="date">
                                <van-radio name="1">本月</van-radio>
                                <van-radio name="2">上月</van-radio>
                                <van-radio name="3">自定义</van-radio>
                            </van-radio-group>
                            <div class=" input-box" v-show="date == '3'">
                                <input placeholder="请选择开始时间" readonly type="text" v-model="startDate"
                                       @click="selectTime(1)">
                                <span class="pr10"> - </span>
                                <input placeholder="请选择结束时间" readonly type="text" v-model="endDate"
                                       @click="selectTime(2)">
                            </div>
                        </li>
                    </ul>
                </div>
                <van-button block type="info" @click="onConfirm">确认</van-button>
            </van-dropdown-item>
        </van-dropdown-menu>
        <div class="mask" v-show="dateShow">

        </div>
        <div class="foot foot-date" style="z-index:203;" v-show="dateShow">
            <van-datetime-picker class="w100"
                                 v-model="currentDate"
                                 :type="modelTime"
                                 :min-date="minDate"
                                 @confirm="confirm"
                                 @cancel="cancel"
            />
            <!--:max-date="maxDate"-->
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {DropdownMenu, DropdownItem, DatetimePicker} from 'vant';

    let moment = require("moment");
    Vue.use(DropdownMenu).use(DropdownItem).use(DatetimePicker);

    export default {
        name: "dropdownMenu",
        data() {
            return {
                value2: '',
                value3: '',
                class2: '',
                class3: '',
                class4: '',
                title2: '所属任务',
                title3: '班务经理',
                option2: [
                    {text: '不限', value: ''},
                ], option3: [
                    {text: '不限', value: ''},
                ],
                date: '1',
                startDate: "",
                endDate: "",
                currentDate: new Date(),
                minDate: new Date(2018, 1, 1),
                dateShow: false,
                modelTime: 'date',
                timeType: 1,//1是开始时间 2是结束时间
            }
        },
        watch: {
            'date': function (val, old) {
                if (val == '1') {
                    this.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.endDate = moment(new Date()).format('YYYY-MM-DD');
                } else if (val == '2') {
                    this.startDate = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
                    this.endDate = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
                } else {
                    this.startDate = ''
                    this.endDate = ''
                }
            },
        },
        mounted() {
            this.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
            this.endDate = moment(new Date()).format('YYYY-MM-DD');
            this.getTask();
            this.getPmList();
        },
        methods: {
            changeValue(val) {
                switch (Number(val)) {
                    case 2:
                        this.class2 = 'cg-is-active2';
                        if (this.value2 === '') {
                            this.title2 = '所属任务'
                        } else {
                            this.title2 = ''
                        }
                        this.value3 = '';
                        this.title3 = '班务经理';
                        this.getPmList(this.value2);
                        break;
                    case 3:
                        this.class3 = 'cg-is-active3';
                        if (this.value3 === '') {
                            this.title3 = '班务经理'
                        } else {
                            this.title3 = ''
                        }
                        break;
                }
                this.$emit('screenMenu', {
                    taskId: this.value2,
                    managerId: this.value3,
                })
            },
            selectTime(val) {
                this.timeType = val
                if (this.timeType == 2 && !this.startDate) {
                    return this.$toast('请先选择开始时间!')
                }
                this.dateShow = true;
            },
            confirm(val) {
                let time = moment(val).format('YYYY-MM-DD')
                if (this.timeType == 1) {//开始时间
                    this.startDate = time
                } else if (this.timeType == 2) { //结束时间
                    if (moment(time).isBefore(this.startDate)) {
                        return this.$toast('结束时间要大于开始时间!')
                    }
                    if (moment(time).diff(this.startDate, 'days') + 1 > 31) {
                        return this.$toast('最多选31天!')
                    }
                    this.endDate = time
                }
                this.dateShow = false;
                console.log(this.endDate)
            },
            cancel(val) {
                this.dateShow = false;
            },
            onConfirm() {
                if(!this.startDate){
                    return this.$toast('开始时间不能为空!')
                }
                if(!this.endDate){
                    return this.$toast('结束时间不能为空!')
                }
                this.$emit('screenMenu', {
                    taskId: this.value2,
                    managerId: this.value3,
                    startDate: this.startDate,
                    endDate: this.endDate,
                })
                this.class4 = 'cg-is-active4';
                this.$refs.item.toggle();
            },
            getTask(){
              this.$api.getMyTaskList({
                belongTo: "",
                belongToType: "",
                pageNum: 1,
                pageSize:0,
                processStatus: "",
                settlementType: "",
                taskName: "",
              }).then(res=>{
                  this.option2 = [
                      {text: '不限', value: ''},
                  ];
                  if (res.data.respCode == 0) {
                      let result = Array.from(res.data.data.list);
                      for (let item of result) {
                          this.option2.push({text: item.taskName, value: item.assignmentInfoId})
                      }
                  }
              })
            },
            getPmList(assmId) {
                this.$api
                    .getManagerList({assmId:assmId})
                    .then(res => {
                        this.option3 = [
                            {text: '不限', value: ''},
                        ];
                        console.log(res);
                        if (res.data.respCode == 0) {
                            let result = Array.from(res.data.data);
                            for (let item of result) {
                                this.option3.push({text: item.nameAlias, value: item.id})
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
        }
    }
</script>

<style lang="scss">
    .wrap-drop {
        .dro-body{
            .van-radio-group{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content:flex-start;
                justify-items: center;
                .van-radio{
                    margin-bottom: convertToVw(10);
                }
                .van-icon{
                    display: none;
                    visibility: hidden;
                }
                .van-radio__label{
                    display: flex;
                    box-sizing: border-box;
                    min-width: convertToVw(100);
                    height: convertToVw(30);
                    border: 1px solid #DBDBDB;
                    border-radius: convertToVw(5);
                    justify-content: center;
                    align-items: center;
                    margin: 0 convertToVw(10) 0 0;
                    padding:0 convertToVw(10);
                }
                .van-radio__icon--checked~.van-radio__label{
                    background-color: #FCE8E3;
                    color: #C4340F;
                    border: none;
                }
            }
            .input-box{
                display: flex;
                box-sizing: border-box;
                justify-content: flex-start;
                align-items: center;
                input{
                    display: flex;
                    height: convertToVw(30);
                    border-radius: convertToVw(5);
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    margin-right: convertToVw(10);
                    width:convertToVw(115);
                    border: 1px solid #dbdbdb;
                }
            }
        }
        .van-dropdown-menu {
            display: flex;
            justify-content: center;
            align-items: center;
            height: convertToVw(35);
        }

        .cg-is-active1, .cg-is-active2, .cg-is-active3, .cg-is-active4 {
            color: #E95A34;
        }

        .van-dropdown-menu__item {
            flex: none;
            min-width: 33.3%;
        }

        .van-dropdown-menu__title--active {
            color: #E95A34;
            font-size: convertToVw(15);
        }

        .van-dropdown-item {
            border-top: 1px solid #eee;
        }

        .van-dropdown-item__icon {
            /*color:#1989fa;*/
        }
    }
</style>