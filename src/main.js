import Vue from 'vue'
import * as Util from './common/util';
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'vant/lib/index.css';
import './assets/css/my-mint.scss'; //全局修改mint-UI样式
import api from './api/api'
import FastClick from 'fastclick'
import echarts from 'echarts'
// import BaiduMap from 'vue-baidu-map'
import { Field,CellGroup,Button,Divider,NavBar,Icon ,Loading,List,Search,RadioGroup, CheckboxGroup,Checkbox,Radio, Cell, } from 'vant';
Vue.use(Field).use(CellGroup).use(Button).use(Divider)
    .use(NavBar).use(Icon).use(Loading).use(List ).use(Search)
    .use(RadioGroup).use(Radio).use(Cell).use(CheckboxGroup).use(Checkbox);
Vue.use(Util)
Vue.use(Mint)

// Vue.use(BaiduMap, {
//   ak: 'HIpuFBetnp1KKYrfcleBipO6x31IeI63'
// })

const str = navigator.userAgent.toLowerCase()
const ver = str.match(/cpu iphone os (.*?) like mac os/)

if (!ver || parseInt(ver[1]) < 11) {
    // 非IOS系统 或 IOS小于11的
    // 引入fastclick 做相关处理
    FastClick.attach(document.body);
}

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts //将echarts存到Vue原型中


if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'pre') {
        Vue.prototype.$baseURL = 'http://pre.api.10000rc.com/pre/';
        Vue.prototype.$baseURLWS = 'pre.api.10000rc.com/pre/';
    } else if (process.env.VUE_APP_TITLE == 'test') {
        Vue.prototype.$baseURL = 'http://test.api.10000rc.com/';
        Vue.prototype.$baseURLWS = 'test.api.10000rc.com/';
    } else {
        Vue.prototype.$baseURL = 'http://www.10000rc.com/2.0/';
        Vue.prototype.$baseURLWS = 'www.10000rc.com/2.0/';
    }
} else {
    Vue.prototype.$baseURL = 'http://test.api.10000rc.com/';
    Vue.prototype.$baseURLWS = 'test.api.10000rc.com/';
}


Vue.prototype.bucketHost = 'http://img.10000rc.com'
new Vue({
    api,
    router,
    store,
    render: h => h(App)
}).$mount('#app')