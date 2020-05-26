<template>
    <div class="wrap-drop-detail">
        <van-dropdown-menu :close-on-click-overlay="true" :close-on-click-outside="false">
            <van-dropdown-item v-model="value2" :title-class="class2" :title="title2" :options="option2"
                               @change="changeValue(2)"/>
            <van-dropdown-item v-model="value3" :title-class="class3" :title="title3" :options="option3"
                               @change="changeValue(3)"/>
        </van-dropdown-menu>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {DropdownMenu, DropdownItem, DatetimePicker} from 'vant';
    Vue.use(DropdownMenu).use(DropdownItem).use(DatetimePicker);

    export default {
        name: "dropdownMenu",
        props:{
            id:{
            }
        },
        data() {
            return {
                value2: '',
                value3: '',
                class2: '',
                class3: '',
                class4: '',
                title2: '工种',
                title3: '结算方式',
                option2: [
                    {text: '不限', value: ''},
                ], option3: [
                    {text: '不限', value: ''},
                    {text: '月结', value: '2'},
                    {text: '周结', value: '4'},
                    {text: '日结', value: '1'},
                ],
            }
        },
        watch: {
        },
        mounted() {
            this.getPmList();
        },
        methods: {
            changeValue(val) {
                switch (Number(val)) {
                    case 2:
                        this.class2 = 'cg-is-active2';
                        if (this.value2 === '') {
                            this.title2 = '工种'
                        } else {
                            this.title2 = ''
                        }
                        break;
                    case 3:
                        this.class3 = 'cg-is-active3';
                        if (this.value3 === '') {
                            this.title3 = '结算方式'
                        } else {
                            this.title3 = ''
                        }
                        break;
                }
                this.$emit('screenMenu', {
                    industry: this.value2,
                    settlementType: this.value3,
                })
            },
            getPmList() {
                this.$api
                    .industry({
                        schedulingId:this.id
                    })
                    .then(res => {
                        this.option2 = [
                            {text: '不限', value: ''},
                        ];
                        if (res.data.respCode == 0) {
                            let result = Array.from(res.data.data);
                            for (let item of result) {
                                this.option2.push({text: item.industryName, value: item.industry})
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
    .wrap-drop-detail {
        .van-dropdown-menu {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: convertToVw(35);
        }

        .cg-is-active1, .cg-is-active2, .cg-is-active3, .cg-is-active4 {
            color: #E95A34;
        }

        .van-dropdown-menu__item {
            flex: none;
            min-width:25%;
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