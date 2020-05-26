<template>
    <div class="innerList">
        <ul>
            <li v-for="(item,index) in list" :key="index">
                {{item.schedulingName}} 暂时不做
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "innerList",
        data(){
            return {
                currentPage:1,
                pageSize:10,
                list:[],
                loading:false,
                form: {
                    settlementType: '',
                    keyWord: '',
                    date: '',
                    selectType: '2',
                    managerId: '',
                    startDate:'',
                    endDate:'',
                },
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            getList() {
                let _this = this;
                this.loading = true;
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    managerId: this.form.managerId,
                    selectType: this.form.selectType,
                    keyWords: this.form.keyWord,
                    startDate: this.form.startDate,
                    endDate: this.form.endDate,
                    settlementType: this.form.settlementType,
                }
                this.$api.innerList(params).then(res => {
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            const { list} = res.data.data
                            this.list = list || []
                        }
                    }
                }).catch().finally(()=>{
                    setTimeout(()=>{
                        _this.loading = false
                    },500)
                });
            },
        }
    }
</script>

<style scoped>

</style>