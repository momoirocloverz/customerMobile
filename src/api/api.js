import Axios from './http'
import {
    get,
    deletes,
    getForm
} from './http'

let baseURL = 'http://test.api.10000rc.com';
// let baseURL = 'http://192.168.8.26/2.0' //泽阳本地
// let baseURL = 'http://192.168.8.20:8186' //庆文本地
//let baseURL = 'http://192.168.8.14/2.0' //健权本地
if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'pre') {
        baseURL = 'http://pre.api.10000rc.com/pre';
    } else if (process.env.VUE_APP_TITLE == 'test') {
        baseURL = 'http://test.api.10000rc.com';
    } else {
        baseURL = 'http://www.10000rc.com/2.0';
    }
}

const publicURL = baseURL + '/public';
const bizURL = baseURL + '/biz';
const financeURL = baseURL + '/finance';
const userURL = baseURL + '/user';


// const ip = 20
// const publicURL = `http://192.168.8.${ip}/public`;
// const bizURL = `http://192.168.8.${ip}:8180/biz`;
// const financeURL = `http://192.168.8.${ip}:8182/finance`;
// const userURL = `http://192.168.8.${ip}:8186/user`;


export default {
    //登录
    login: (param) => { //登录
        return Axios.post(`${userURL}/user/login`, param)
    },
    getSmsCode: (params) => { //获取短信验证码
        return get(`${publicURL}/sms/code`, params)
    },
    postImg: (params1, params2) => { //上传图片
        return Axios.post(`http://upload.qiniu.com/putb64/-1/`, params1, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": "UpToken " + params2,
            },
            withCredentials: false
        })
    },
    changeImg: (params) => { //修改头像
        return Axios.post(`${userURL}/user/avatar`, params)
    },
    UpdateUserPassword: (param) => { //更新密码
        return Axios.post(`${userURL}/user/updatePassword`, param)
    },
    loginnameCheck: (param) => { //更新密码
        return Axios.post(`${userURL}/user/check/loginname`, param)
    },
    changeBankMobile: (param) => { // 更换银行手机号
        return Axios.put(`${financeURL}/accountBank/changeBankMobile?mobile=${param.mobile}`)
    },
    //获取qiuniuToken
    getToken: () => {
        return get(`${publicURL}/qiniu/token`)
    },
    //获取普工信息
    getUserInfo: () => {
        return get(`${bizURL}/talent/authentication/detail`)
    },
    // 修改普工信息
    UpdatePhone: (param) => { //更新手机号
        return Axios.post(`${userURL}/user/update/app/mobile`, param)
    },
    checkMobileMsg: (param) => { //check mobile
        return get(`${userURL}/user/check/mobile`, param)
    },
    // 获取服务器时间
    getHostTime: () => {
        return get(`${publicURL}/system/currentTime`)
    },
    //获取服务器时间新
    getCurrentTime: () => {
        //写死8-16   8-13号版本需要改回来
        return get(`${publicURL}/system/currentTime/format`)
    },
    getServiceWechat: () => { // 获取客服微信
        return get(`${publicURL}/sysparam/info/string?paramName=customer_service_we_chat`)
    },
    LoginOut: () => { //登录
        return get(`${userURL}/user/logout`)
    },
    AccountDetail: (param) => { //账户详情
        return Axios.post(`${financeURL}/account/detail`, param)
    },

    AccountCharge: (param) => { //账户流水
        return Axios.post(`${financeURL}/account/record/runningAccount`, param)
    },

    WechatLogin: (param) => { //wechat login
        return get(`${userURL}/wechat/login`, param)
    },
    BindWechat: (param) => { //绑定微信跳转
        return get(`${publicURL}/wechat/talent/binding/redirect`, param)
    },
    BindWechatInfo: (param) => { //绑定微信
        return get(`${publicURL}/wechat/talentBindingUrl`, param)
    },
    getAvatar: (param) => { //微信头像
        return get(`${publicURL}/wechat/talent/headImg/redirect`, param)
    },
    CashOut: (param) => { //提现
        return get(`${financeURL}/yeePay/remit`, param)
    },
    ParamsInfo: (params) => { //参数详情
        return get(`${publicURL}/sysparam/info`, params)
    },
    BindChat: (params) => { //登入绑定微信
        return get`${publicURL}/wechat/talent/binding/redirect?userId=${params}`
    },
    SocketConnect: (params) => { //websocket
        return `ws://test.api.10000rc.com/biz/attendance/websocket?schedulingId=${params}`
    },
    CardBinInfo: (param) => { //binding银行卡信息
        return get(`${financeURL}/yeePay/cardBinInfo`, param)
    },
    wechatHandle: (param) => { //微信处理
        return get(`${publicURL}/wechat/operateRedirect`, param)
    },
    WechatToBind: (param) => { //微信绑定
        return get(`${publicURL}/wechat/talent/binding/auth`, param)
    },
    shareSDK: (param) => { //微信绑定
        return get(`${publicURL}/wechat/jsConfigObj`, param)
    },
    unbindWechat: (param) => { // 微信解绑  参数talentUserId
        return get(`${publicURL}/wechat/unBinding`, param)
    },
    // 参数schedulingId
    getAddDailyEmpCode: (param) => { // 获取验证码
        return get(`${bizURL}/attendance/getAddDailyEmpCode`, param)
    },
    appStore: () => {
        return Axios.get(`${publicURL}/version/latest`, {
            params: {},
            headers: {
                os: 'Android',
                appType: '3'
            }
        })
    },
    //3.0.3.2
    wechatHandleNew: (param) => { //微信处理
        return get(`${bizURL}/newtalent/operateQr`, param)
    },
    managementFee: (param) => { //查询管理费欠费
        return Axios.post(`${baseURL}/finance/account/record/subFeeRemind`)
    },
    //报表
    analysisList: (params) => {
        return Axios.post(`${bizURL}/task/statistics/analysisReport`, params)
    },
    getManagerList: (param) => {
        return get(`${bizURL}/classTask/managerFilter`, param)
    },
    // 班务
    getTaskList: (params) => {
        return get(`${bizURL}/task/statistics/taskList`, params)
    },
    classTaskProfit: (param) => { //按时汇总（按天）
        return Axios.post(`${bizURL}/taskProfit/classTaskProfit`,param)
    },
    getClassTaskProfitByManager: (param) => {
        return Axios.post(`${bizURL}/taskProfit/classTaskProfitByManager`, param)
    },
    classTaskProfitDetail: (param) => { //查看利润明细
        return Axios.post(`${bizURL}/taskProfit/classTaskProfitDetail`,param)
    },
    classTaskProfitInComeDetail: (param) => { //查看收入明细
        return Axios.post(`${bizURL}/taskProfit/classTaskProfitInComeDetail`,param)
    },
    getProfitDetailByManagerId: (param) => {//班务经理利润明细
        return Axios.post(`${bizURL}/taskProfit/getProfitDetailByManagerId`, param)
    },

    getInComeDetailByManager: (param) => {//班务经理收入明细
        return Axios.post(`${bizURL}/taskProfit/getInComeDetailByManager`, param)
    },
    //3.0.7
    detailCustomer: (params) => {
        return get(`${bizURL}/customer/detail`, params)
    },
    //考勤相关接口
    getPmListCus: (params) => {
        const {customerId} = JSON.parse(localStorage.getItem('userInfo'));
        const $params = {
            ...params,
            customerId
        }
        return get(`${bizURL}/newtalent/classManagerList`, {...$params})
    },
    innerList: (param) => { //对内考勤
        return Axios.post(`${bizURL}/punch/innerList`, param)
    },
    innerListSummary: (param) => { //对内考勤-合计
        return Axios.post(`${bizURL}/punch/innerListSummary`, param)
    },
    taskBelongSpToList: () => {
        return get(`${bizURL}/assignmentInfo/taskBelongToList`);
    },
    attendanceList2: (param) => { //排班人员2
        return Axios.post(`${bizURL}/punch/outerList`, param)
    },
    getPhotoSet: (param) => { //排班人员
        return get(`${bizURL}/attendance/getPhotoSet`, param)
    },
    outListSummary: (param) => { //合计
        return Axios.post(`${bizURL}/punch/outListSummary`, param)
    },
    outerListExport: (param) => { //导出excel
        return Axios.post(`${bizURL}/punch/outerListExport`, param)
    },
    updateForC: (param) => { //对内考勤-修改考勤-提交
        return Axios.post(`${bizURL}/attendance/updateForC`, param)
    },
    attendanceExport: (param) => { //排班人员
        return Axios.post(`${bizURL}/attendance/export`, param)
    },
    //排班
    scheduleList: (param) => { //排班列表
        return Axios.post(`${bizURL}/scheduling/customer/lists`, param)
    },
    schePmList: () => { //排班人员
        return Axios.post(`${bizURL}/scheduling/customerSchedulingManagers`)
    },
    shedEmployee: (params) => { //排班人员
        return Axios.post(`${bizURL}/scheduling/platform/employee`,params)
    },
    industry: (params) => { //工种
        return get(`${bizURL}/scheduling/platform/employee/industry`,params)
    },
    getMyTaskList: (param) => { //我的任务列表
        return Axios.post(`${bizURL}/classTask/myTaskList`, param)
    },
}