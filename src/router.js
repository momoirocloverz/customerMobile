import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import( './views/Home.vue')
const WorkSpace = () => import( './views/WorkSpace.vue')

const Login = () => import( './views/login/Login.vue')
const ForgetPsw = () => import( './views/login/ForgetPsw.vue')
const Mine = () => import( './views/mine/Mine.vue')
const Setting = () => import(  './views/mine/Setting.vue')
const ChangePsw = () => import( './views/mine/ChangePsw.vue')
const ChangePhone = () => import( './views/mine/ChangePhone.vue')
const WechatOpt = () => import( /* webpackChunkName: 'attendence' */ './views/login/WechatOpt.vue')

//账号

//效能分析
const Efficiency = () => import( /* webpackChunkName: 'Acount' */ './views/efficiency/index.vue')

//利润分析
const ProfitTrend = () => import( /* webpackChunkName: 'Acount' */ './views/profit/index.vue')
const ManagerProfitTrend = () => import( /* webpackChunkName: 'Acount' */ './views/managerProfit/index.vue')
const ProfitDetail = () => import( /* webpackChunkName: 'Acount' */ './views/profit/profitDetail.vue')
const ManagerProfitDetail = () => import( /* webpackChunkName: 'Acount' */ './views/managerProfit/profitDetail.vue')
const IncomeDetail = () => import( /* webpackChunkName: 'Acount' */ './views/profit/incomeDetail.vue')
const ManagerIncomeDetail = () => import( /* webpackChunkName: 'Acount' */ './views/managerProfit/incomeDetail.vue')

//考勤管理
const Scheduling = () => import( /* webpackChunkName: 'Attendance' */ './views/scheduling/index.vue')
const ScheduDetail = () => import( /* webpackChunkName: 'Attendance' */ './views/scheduling/detail.vue')
Vue.use(Router)

export default new Router({
  routes: [{
      path: "/home",
      name: "home",
      component: Home,
      alias: '首页',
      meta: {
        isRequireAuth: true,
      }
    },
    {
      path: "/",
      name: "login",
      component: Login,
      alias: '登录',
      meta: {
        isRequireAuth: false,
      }
    },
    {
      path: '/home',
      component: Home,
      children: [{
          path: '',
         name:'WorkSpace',
          redirect: 'workspace',
        },
        {
          path: 'workspace',
          component: WorkSpace,
          name: 'WorkSpace',
          alias: '工作台',
          meta: {
            isRequireAuth: true,
          }
        },
        {
          path: 'mine',
          component: Mine,
          name: 'Mine',
          alias: '个人中心',
          meta: {
            isRequireAuth: true,
          }
        },
      ],
    },
    {
      path: "/forgetPsw",
      name: "forgetPsw",
      alias: '忘记密码',
      component: ForgetPsw,
      meta: {
        isRequireAuth: false,
      }
    },
    //设置页面
    {
      path: "/setting",
      name: "setting",
      component: Setting,
      alias: '设置',
      meta: {
        isRequireAuth: true,
      }
    },
    //更换手机号码
    {
      path: "/mine/changePhone",
      name: "changePhone",
      alias: '更换手机号码',
      component: ChangePhone,
      meta: {
        isRequireAuth: true,
      }
    },
    //更换密码
    {
      path: "/mine/changePsw",
      name: "changePsw",
      component: ChangePsw,
      alias: '更换密码',
      meta: {
        isRequireAuth: true,
      }
    },
    //绑定微信
    {
      path: "/wechatOpt",
      name: "wechatOpt",
      component: WechatOpt,
      alias: '绑定微信',
      meta: {
        isRequireAuth: false,
      }
    },
      //效能分析
    {
      path: "/efficiency/index",
      name: "efficiency",
      component: Efficiency,
      alias: '效能分析',
      meta: {
        isRequireAuth: true,
      }
    },  //利润分许
    {
      path: "/profit/index",
      name: "profitTrend",
      alias: '利润分析',
      component: ProfitTrend,
      meta: {
        isRequireAuth: true,
      }
    },
    {
      path: "/managerProfit/index",
      name: "managerProfitTrend",
      alias: '班务经理利润分析',
      component: ManagerProfitTrend,
      meta: {
        isRequireAuth: true,
      }
    },
    {
      path: "/profit/profitDetail",
      name: "profitDetail",
      alias: '利润明细',
      component: ProfitDetail,
      meta: {
        isRequireAuth: true,
      }
    },
    {
      path: "/profit/incomeDetail",
      name: "incomeDetail",
      alias: '收入明细',
      component: IncomeDetail,
      meta: {
        isRequireAuth: true,
      }
    },
    {
      path: "/managerProfit/profitDetail",
      name: "managerProfitDetail",
      alias: '班务经理利润明细',
      component: ManagerProfitDetail,
      meta: {
        isRequireAuth: true,
      }
    },
    {
      path: "/managerProfit/incomeDetail",
      name: "managerIncomeDetail",
      alias: '班务经理收入明细',
      component: ManagerIncomeDetail,
      meta: {
        isRequireAuth: true,
      }
    },
      //考勤管理
    {
      path: "/scheduling/index",
      name: "scheduling",
      alias: '排班',
      component: Scheduling,
      meta: {
        isRequireAuth: true,
        keepAlive:true,
        isBack:false,
      }
    },{
      path: "/scheduling/detail",
      name: "scheduDetail",
      alias: '考勤',
      component: ScheduDetail,
      meta: {
        isRequireAuth: true,
      }
    },
  ],
})