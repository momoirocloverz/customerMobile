import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules:[
        'isArrears',
        'cost',
        'isSet',
        'isCusManger',
        'isClassWork',
        'efficFormInfo',
        'profitFormInfo',
        'managerFormInfo',
    ]
})
export default new Vuex.Store({
    state: {
        isArrears: false,//是否欠费
        cost: 0,//欠费金额
        isSet: false,//是否处于设置页面
        isCusManger: false,//是否处于选择班务经理页面
        isClassWork: false,//是否处于选择班务页面
        efficFormInfo:{}, //获取效能设置属性
        profitFormInfo:{},//获取利润分析表设置属性
        managerFormInfo:{},//获取班务经理设置属性
    },
    getters: {
        getArrears: (state) => {
            return state.isArrears;
        },
        getCost: (state) => {
            return state.cost;
        },
        getIsSet: (state) => {
            return state.isSet;
        },
        getCusManger: (state) => {
            return state.isCusManger;
        },
        getClassWork: (state) => {
            return state.isClassWork;
        },
        getEFI:(state => {
            return state.efficFormInfo;
        }),
        getPFI:(state => {
            return state.profitFormInfo;
        }),
        getMFI:(state => {
            return state.managerFormInfo;
        }),
    },
    mutations: {
        SET_EFI(state, payload) {
            state.efficFormInfo = payload;
        },
        SET_PFI(state, payload) {
            state.profitFormInfo = payload;
        },
        SET_MFI(state, payload) {
            state.managerFormInfo = payload;
        },
        SET_ARREARS(state, payload) {
            state.isArrears = payload;
        },
        SET_COST(state, payload) {
            state.cost = payload;
        },
        IS_SET(state, payload) {
            state.isSet = payload;
        },
        CUS_MANGER(state, payload) {
            state.isCusManger = payload;
        },
        CLASS_WORK(state, payload) {
            state.isClassWork = payload;
        },
    },
    actions: {},
    plugins: [vuexLocal.plugin]
})