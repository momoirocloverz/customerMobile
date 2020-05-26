<template>
    <div class="index">
        <div class="page-content">
            <mt-cell title="省市区:" :value="position" is-link @click.native="handlerArea"></mt-cell>
            <mt-popup v-model="areaVisible" class="area-class" position="bottom">
                <mt-picker :slots="slots" @change="onValuesChange"  value-key="dicName"  :show-toolbar="true"
                           ref="natitonPicker"  :visible-item-count="5">
                  <div @click="handleConfirm" class="sure">确认</div>
                </mt-picker>
            </mt-popup>
            <!--<mt-popup v-model="streetVisible" class="area-class" position="bottom">-->
                <!--<mt-picker :slots="slotstree" @change="onStreeChange"></mt-picker>-->
            <!--</mt-popup>-->
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        position:'',
        province:'',
        city:'',
        area:'',
        provinceCode:'',
        cityCode:'',
        areaCode:'',
        slots:[
          {
            flex: 1,
            values: [], //省份数组
            className: 'slot1',
            textAlign: 'center'
          },
          //分隔符
          {
            divider: true,
            content: '',
            className: 'slot2'
          },
          //市
          {
            flex: 1,
            values:  [],//北京市
            className: 'slot3',
            textAlign: 'center'
          },
          {
            divider: true,
            content: '',
            className: 'slot4'
          },
          //县
          {
            flex: 1,
            values: [],//北京市
            className: 'slot5',
            textAlign: 'center'
          }
        ]
      }
    },
    mounted(){
      this.getProList('0')
      this.getCityList('110000')
      this.getAreaList('110100')
    },
    watch:{
      provinceCode:function (val,oldval) {
        console.log('监听省'+val)
        if(val){
          this.getCityList(val)
        }
      },
      cityCode:function (val,oldval) {
        console.log('监听市'+val)
        if(val){
          this.getAreaList(val)
        }
      },
    },
    methods:{
      handleConfirm(){
        this.position = this.province+this.city+this.area
        this.areaVisible = false
      },
    handlerArea() {
       this.areaVisible = true
     },
      onValuesChange(picker, values){
      this.picker=picker;
      console.log(picker)
      console.log(values)
        if(values[0]){
          this.province = values[0].dicName
          this.provinceCode = values[0].dicVal
        }
        if(values[1]){
          this.city = values[1].dicName
          this.cityCode = values[1].dicVal
        }
       if(values[2]){
         this.area = values[2].dicName
         this.areaCode = values[2].dicVal
       }
      },
      getProList(value) {
        this.$api
            .getDicList("city", value)
            .then(response => {
              if(response.data.respCode==0){
                this.slots[0].values = response.data.data
//                return response.data.data
              }else{
              }

            })
            .catch(error => {
              console.log(error);
            });
      },
      getCityList(value) {
        this.$api
            .getDicList("city", value)
            .then(response => {
              if(response.data.respCode==0){
                this.picker.setSlotValues(1, response.data.data);
              }else{
              }

            })
            .catch(error => {
              console.log(error);
            });
      },
      getAreaList(value) {
        this.$api
            .getDicList("city", value)
            .then(response => {
              if(response.data.respCode==0){
                this.picker.setSlotValues(2, response.data.data);
                return response.data.data
              }else{
              }

            })
            .catch(error => {
              console.log(error);
            });
      },
    }
  }
</script>

<!--<script>-->
  <!--// 导入数据-->
  <!--import data from '../assets/data/data2.json'-->
  <!--var index = 0-->
  <!--var index2 = 0-->
  <!--var index3 = 0-->
  <!--// 初始化省-->
  <!--let province = Object.keys(data)-->
  <!--// 初始化市-->
  <!--let _y = Object.values(data)-->
  <!--let _m = _y.map(res => {-->
    <!--return Object.keys(res)-->
  <!--})-->
  <!--let city = _m[index]-->
  <!--// 初始化区-->
  <!--let _c = Object.values(data)-->
  <!--_c = _c.map(res => {-->
    <!--return Object.values(res)-->
  <!--})-->
  <!--let __d = Object.values(_c[index])-->
  <!--let area = Object.keys(__d[index])-->
  <!--// 初始化街-->
  <!--let __a = Object.values(__d[0])-->
  <!--let street = __a[0]-->
  <!--export default {-->
    <!--name: 'index',-->
    <!--data() {-->
      <!--return {-->
        <!--areaVisible: false,-->
        <!--streetVisible: false,-->
        <!--areaString: '请选择',-->
        <!--streetString: '请选择',-->
        <!--slots: [{-->
          <!--flex: 1,-->
          <!--values: province,-->
          <!--className: 'slot1',-->
          <!--textAlign: 'left'-->
        <!--}, {-->
          <!--divider: true,-->
          <!--content: '-',-->
          <!--className: 'slot2'-->
        <!--}, {-->
          <!--flex: 1,-->
          <!--values: city,-->
          <!--className: 'slot3',-->
          <!--textAlign: 'left'-->
        <!--}, {-->
          <!--divider: true,-->
          <!--content: '-',-->
          <!--className: 'slot4'-->
        <!--}, {-->
          <!--flex: 1,-->
          <!--values: area,-->
          <!--className: 'slot5',-->
          <!--textAlign: 'left'-->
        <!--}],-->
        <!--slotstree: [{-->
          <!--flex: 1,-->
          <!--values: street,-->
          <!--className: 'slot1',-->
          <!--textAlign: 'center'-->
        <!--}]-->
      <!--}-->
    <!--},-->
    <!--methods: {-->
      <!--handlerArea() {-->
        <!--this.areaVisible = true-->
      <!--},-->
      <!--handlerStreet() {-->
        <!--if (this.slotstree[0].values.length === 0) {-->
          <!--this.streetString = '无可选街道'-->
          <!--return-->
        <!--}-->
        <!--this.streetVisible = true-->
      <!--},-->
      <!--onValuesChange(picker, values) {-->
        <!--index = province.indexOf(values[0])-->
        <!--index2 = _m[index].indexOf(values[1])-->
        <!--if (index >= 0) {-->
          <!--picker.setSlotValues(1, _m[index])-->
        <!--}-->
        <!--if (index >= 0 && index2 >= 0) {-->
          <!--let __d = Object.values(_c[index])-->
          <!--let area = Object.keys(__d[index2])-->
          <!--index3 = area.indexOf(values[2])-->
          <!--picker.setSlotValues(2, area)-->
          <!--this.areaString = values.join(',')-->
          <!--if (index3 >= 0) {-->
            <!--let __a = Object.values(__d[index2])-->
            <!--let street = __a[index3]-->
            <!--this.slotstree[0].values = street-->
          <!--} else {-->
            <!--this.$set(this.slotstree[0].values, [])-->
            <!--this.streetString = '无可选街道'-->
          <!--}-->
        <!--}-->
      <!--},-->
      <!--onStreeChange(picker, values) {-->
        <!--this.streetString = values.join(',')-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->
<style>
    .area-class {
        width: 100%;
        /*height: 50%;*/
    }
    .sure{
      float: right;
      padding:5px;
      color:#666;
      margin: 5px 5px 0 0;
    }
</style>