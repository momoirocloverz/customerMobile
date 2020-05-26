import axios from 'axios';
import router from '../router';
import Store from '@/store.js'
import {
    Toast,
    MessageBox
} from 'mint-ui';
let Base64 = require('js-base64').Base64;
require('es6-promise').polyfill();
let notify;
let message;
let CancelToken = axios.CancelToken;
let timer = null;
let isBug = false; //是否本地开发模式
let baseURL = 'http://test.api.10000rc.com'; //放在这里是方便微信绑定调后台的接口
if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'pre') {
        baseURL = 'http://pre.api.10000rc.com/pre';
    } else if (process.env.VUE_APP_TITLE == 'test') {
        baseURL = 'http://test.api.10000rc.com';
    } else {
        baseURL = 'http://www.10000rc.com/2.0';
    }
}
const axiosInstance = axios.create({
    // baseURL: 'http://10000rc.com:9093/bos',
    // baseURL: 'http://test.api.10000rc.com',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
});

axios.interceptors.request.use(config => {
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个 不同的时间戳
    let requestName
    if (config.method === 'post') {
        if (config.data && config.data.requestName) {
            requestName = config.data.requestName
        } else {
            requestName = new Date().getTime()
        }

    } else {
        if (config.params && config.params.requestName) {
            requestName = config.params.requestName
        } else {
            requestName = new Date().getTime()
        }
    }
    // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
    if (requestName) {
        if (axios[requestName] && axios[requestName].cancel) {
            axios[requestName].cancel()
        }
        config.cancelToken = new CancelToken(c => {
            axios[requestName] = {}
            axios[requestName].cancel = c
        })
    }
    return config
}, error => {
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(
    response => {
        switch (response.data.respCode) {
            case -1:
                if (response.data.errorCode == 80100) {

                } else if (response.data.errorCode == 80101) {

                } else if (response.data.errorCode == 80102) {

                } else if (response.data.errorCode == 80103) {
                    message = Toast(`微信登录失败，当前微信未绑定万才经理人账号！`)
                    sessionStorage.setItem('cusopenid', response.data)
                    localStorage.setItem('cusopenid', response.data)
                    sessionStorage.removeItem('custoken')
                    localStorage.removeItem('custoken')
                    router.replace({
                        path: '/register',
                    })
                } else if (response.data.errorCode == 80104) {

                } else if (response.data.errorCode == 80105) {

                } else if (response.data.errorCode == 90007) {

                } else if (response.data.errorCode == 90004) {

                } else if (response.data.errorCode == 90005) {

                } else if (response.data.errorCode == 90006) {

                } else if (response.data.errorCode == 90008) {

                } else if (response.data.errorCode == 90009) {

                } else if (response.data.errorCode == 90010) {

                } else if (response.data.errorCode == 900072) {

                } else if (response.data.errorCode == 900073) {

                } else if (response.data.errorCode == 150007) {

                }else if(response.data.errorCode == 80064){

                } else if (response.data.errorCode == 90055) {
                } else if (response.data.errorCode == 20034) {
                } else {
                    message = Toast(response.data.errorMsg)
                    console.log(response.data.errorMsg)
                }
                break;
            case -2:
                if (response.data.errorCode == 20004) {
                    MessageBox({
                        title: `提示`,
                        message: `你还未进行登录,需登录后才能继续操作`,
                        showCancelButton: true,
                        confirmButtonText: "登录",
                        cancelButtonText: "关闭"
                    }).then(action => {
                        if (action == 'confirm') {
                            router.replace({path: '/'})
                        } else {

                        }
                    })
                } else if (response.data.errorCode == 80103) {
                    message = Toast(`微信登录失败，当前微信未绑定万才经理人账号！`)
                    sessionStorage.setItem('cusopenid', response.data.errorMsg)
                    localStorage.setItem('cusopenid', response.data.errorMsg)
                    router.replace({
                        path: '/',
                    })
                } else {
                    message = Toast(response.data.errorMsg)
                    console.log(response.data.errorMsg)
                    router.replace({
                        path: '/',
                    })
                }
                sessionStorage.removeItem('custoken')
                localStorage.removeItem('custoken')
                break;
        }
        if (response.headers.status == 1) {
            sessionStorage.setItem("custoken", response.headers.authorization);
            localStorage.setItem('custoken', response.headers.authorization)
        }
        return response;
    },
    error => {
        if (error.response.status == 401) {
            message = Toast(error.response.data.errorMsg)
            console.log(error.response.data.errorMsg)
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;


export function get(url, params) {
    let token = sessionStorage.getItem('custoken') || localStorage.getItem('custoken')
    return new Promise((resolve, reject) => {
        axiosInstance.get(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err)
        })
    });
}

export function deletes(url, params) {
    let token = sessionStorage.getItem('custoken') || localStorage.getItem('custoken')
    return new Promise((resolve, reject) => {
        axiosInstance.delete(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err)
        })
    });

}

// router.afterEach((to,from,next) => {
//   window.scrollTo(0,0);
// });

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem('custoken');
    if (to.name == 'wechatOpt') {
        if (!from.name) {
            console.log(location.href)
            let url = location.href.split('=')
            let type = url[1].split('&')[0]
            let code = url[2].split('&')[0]
            let state = (url[3].split('&')[0]).split('#')[0];
            let l = decodeURIComponent(state);
            let data = {
                code: code,
                state: '',
                type: type,
            }
            if (type == '16') {
                state = Base64.decode(l);
                data.state = JSON.parse(state)
            }else if(type == '17'){
                let str = state.replace(/%3D/g,'=')
                state = Base64.decode(str);
                data.state = JSON.parse(state)
            } else {
                data.state = state
            }
            console.log(state)
            sessionStorage.setItem('cuswechatLogin', JSON.stringify(data))
            next();
        } else {
            sessionStorage.removeItem('cuswechatLogin')
            next()
        }
    }
    if (to.meta.isRequireAuth) {
        if (token) {
            //以下是微信绑定
            if (!isBug) {
                bindWeixin();
            }
            next();
        } else {
            if (to.path === '/') { //这就是跳出循环的关键
                next()
            } else {
                next('/')
            }
        }
    } else {
        next()
    }
})
router.afterEach((to, from) => {
    // ...
    if (timer) {
        clearTimeout(timer);
    }
})
axiosInstance.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('custoken') || localStorage.getItem('custoken')
        if (token && config.url != 'http://upload.qiniu.com/putb64/-1/') { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

function bindWeixin() {
    let id = JSON.parse(sessionStorage.getItem("cusInfo")).userId;
    let href = `${baseURL}/public/wechat/operateRedirect?type=20&scope=snsapi_userinfo&state=${id}`;
    let userInfo = JSON.parse(sessionStorage.getItem("cusInfo"))
    let wechaterror = sessionStorage.getItem('cuswechaterror')  // 微信绑定没有出错才跳转到微信绑定，否则会进入死循环
    if (userInfo.isBindingWeChat == false) {
        sessionStorage.setItem('cuslastBindStatus', false)
    }
    let lastBindStatus = sessionStorage.getItem('cuslastBindStatus')
    if (lastBindStatus == "false" && userInfo.isBindingWeChat) {
        MessageBox({
            title: '已将您的微信与当前登录账号进行绑定，绑定后无需登录即可访问',
            message: '后续您可在个人中心-账号设置页面，进行微信的解绑和绑定操作',
            confirmButtonText: '确认'
        }).then(action => {
            sessionStorage.setItem('cuslastBindStatus', true)
        })
    }
    if (userInfo.isBindingWeChat == false && !wechaterror) {
        timer = setTimeout(() => {
            clearTimeout(timer)
            window.location.href = href;
        }, 1)
    }
    //微信绑定结束
}