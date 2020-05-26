<template>
    <div class="selectManger">
        <div class="m-body pl10 pr10 pt10 pb50">
            <div class='label-wrap'>
                <span v-for="(item,index) in list" :key="index" class="s-label" :class="{'label-active':mangerForm.managerId == item.id}" @click="tab(item,index)">
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
            this.handeGetManagerList()
        },
        methods:{
            handleBack() {
                this.$emit('showManger', {show: false});
            },
            tab(item,index){
                this.mangerForm.managerId = item.id;
                this.mangerForm.managerName = item.nameAlias;
            },
            handOk(){
                console.log(this.mangerForm)
                if(!this.mangerForm.managerId){
                    return this.$toast('班务经理不能为空!')
                }
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