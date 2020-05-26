<template>
    <div class="delete">
        <!--班务经理多选-->
        <div class="u-mask" @click="cancelL()"></div>
        <section class="manger-popup">
            <div class="manger-top pt5">
                <span class="co-999" :class="{'co-orange':checked}" @click="checkedAll()">
                    <img v-show="!checked" class="img-icon"
                         src="../../../assets/img/check_hollow.png" alt="">
                    <img v-show="checked" class="img-icon"
                         src="../../../assets/img/check_filled.png" alt="">
                    &nbsp;全选
                </span>
                <span class="co-orange" @click="confirmR()">删除</span>
            </div>
            <div class="manger-content">
                <ul>
                    <li class="li-item" v-for="(chilidItem,chilidItemIndex) in list"
                        :key="chilidItemIndex"
                        @click="chengeDelete(chilidItem,chilidItemIndex)">
                        <img v-show="!value.includes(chilidItem.classTaskId)" class="img-icon"
                             src="../../../assets/img/check_hollow.png" alt="">
                        <img v-show="value.includes(chilidItem.classTaskId)" class="img-icon"
                             src="../../../assets/img/check_filled.png" alt="">
                        <div class="li-content">
                            {{`${chilidItem.classTaskName}`}}
                            <span class="fs12 co-999">{{`(${chilidItem.startTime.substring(0,10)} - ${chilidItem.endTime ?
                        chilidItem.endTime.substring(0,10) : '永久'})`}}</span>
                        </div>
                    </li>
                </ul>
                <!--<van-checkbox-group v-model="value">-->
                <!--<van-cell-group>-->
                <!--<van-cell-->
                <!--class="pb10"-->
                <!--v-for="(item, index) in list"-->
                <!--clickable-->
                <!--:key="index"-->
                <!--:title="`${item.classTaskName}(${item.startTime.substring(0,10)} - ${item.endTime ? item.endTime.substring(0,10) : '永久'})`"-->
                <!--&gt;-->
                <!--<van-checkbox-->
                <!--:name="item.classTaskId"-->
                <!--checked-color="#E95A34"-->
                <!--slot="left-icon"></van-checkbox>-->
                <!--</van-cell>-->
                <!--</van-cell-group>-->
                <!--</van-checkbox-group>-->
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "delete",
        props:{
            list:{
                type:Array,
                default:[]
            }
        },
        data(){
            return {
                value:[],
                deList:[],
            }
        },
        computed:{
            checked:{
                get:function(){
                    let idsList = this.list.filter(i=> i = !this.value.includes(i.classTaskId));
                    console.log(idsList);
                    if(idsList.length > 0){
                        return false
                    }else{
                        return true
                    }
                },
                set:function () {

                }
            }
        },
        methods:{
            chengeDelete(item,index){
                let idIndex = this.value.indexOf(item.classTaskId);
                if (idIndex > -1) {
                    this.value.splice(idIndex,1)
                } else {
                    this.value.push(item.classTaskId)
                }
                console.log(this.value)
            },
            cancelL(){
                this.$emit('del',{show:false})
            },
            checkedAll(){
                if(!this.checked){
                    this.value = [];
                    for (let item of this.list){
                        this.value.push(item.classTaskId)
                    }
                }else{
                    this.value = [];
                }
                this.checked = !this.checked;
            },
            confirmR(){
                if(this.value.length == 0){
                    return this.$toast('班务不能为空!')
                }
                let surplus = this.list.filter(i=> i = !this.value.includes(i.classTaskId));
                let surplusId = surplus.map(i=> i.classTaskId)
                console.log(surplusId);
                console.log(surplus);
                this.$emit('del',{show:false,ok:true,value:surplusId,list:surplus})
            },
        },

    }
</script>

<style lang="scss" scoped>
    $design_width: 375;
    $orange_color: #E95A34;
    @function convertToVw($size: 0) {
        @return (($size * 100 / $design_width) + vw);
    }
    .img-icon {
        display: flex;
        height: convertToVw(16);
        width: convertToVw(16);
    }
    .show-box{
        visibility: visible;
        transform: translateY(0);
        transition: .1s;
    }
    .manger-content{
        .li-item {
            display: flex;
            margin: convertToVw(12);
            padding:0 convertToVw(10);
            height: convertToVw(55);
            justify-content: flex-start;
            align-items: center;
            flex-direction: row;
            background-color: #fff;
            border: 1px solid #EBEBEB;
            border-radius: convertToVw(8);
            .li-content{
                padding-left: convertToVw(3);
                display: flex;
                justify-content: flex-start;
                align-items: center;
                line-height: 1.6;
                flex-wrap: wrap;
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
</style>