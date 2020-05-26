<template>
    <div class="selectManger select-manger-2">
        <div class="m-body pl10 pr10 pt10 pb50">
            <div class='label-wrap'>
            <span v-for="(item,index) in list" :key="index" class="s-label" :class="{'label-active':mangerForm.ids.includes(item.id)}" @click="tab(item,index)">
               {{item.nameAlias}}
            </span>
            </div>
        </div>
        <div class="box-btn box-btn-foot">
            <span class="cancel-2 cancel-manager-2" @click="handleBack">取消</span>
            <span class="confirm-2 confirm-manager-2" @click="handOk()">确定</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: "selectManger",
        props:{
            form:{
                type:Object,
            }
        },
        data() {
            return {
                list:[],
                mangerForm:{},
            }
        },
        mounted(){
            this.mangerForm = JSON.parse(JSON.stringify(this.form));
            console.log(this.mangerForm);
            this.handeGetManagerList()
        },
        methods:{
            handleBack() {
                this.$emit('showManger', {show: false});
            },
            tab(item,index){
                let ind = this.mangerForm.ids.indexOf(item.id);
                if(ind > -1){
                    this.mangerForm.ids.splice(ind,1);
                    this.mangerForm.result.splice(ind,1);
                }else{
                    this.mangerForm.ids.push(item.id);
                    this.mangerForm.result.push(item.nameAlias);
                }
                console.log(this.mangerForm.ids)
                console.log(this.mangerForm.result)
            },
            handOk(){
                if(this.mangerForm.ids.length == 0){
                    return this.$toast('班务经理不能为空!')
                }
                this.mangerForm.managerId = this.mangerForm.ids.join(',')
                this.mangerForm.managerName = this.mangerForm.result.join(',')
                this.mangerForm.len = this.mangerForm.ids.length;
                this.$emit('showManger', {show: false,ok:true,...this.mangerForm});
            },
            handeGetManagerList(){
                let _this = this;
                _this.list = []
                this.$api.getManagerList({pageSize:0}).then(res=>{
                    if(res.data.respCode === 0){
                        let result = Array.from(res.data.data)
                        for (let item of result) {
                            _this.list.push(item)
                        }
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
</style>