/**
 * 键值对存入全局对象
 * @param {string} key
 * @param {*} value
 */
export function setStorageItem(key, values, iDay) {
    sessionStorage.setItem(key, JSON.stringify(values));
}

/**
 * 根据key获取全局变量
 * @param {string} key
 */
export function getStorageItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

/**
 * 删除key全局变量
 * @param {string} key
 */
export function removeStorageItem(key) {
    sessionStorage.removeItem(key);
}

/**
 * 删除所有的key全局变量
 * @param {string} key
 */
export function removeAll() {
    sessionStorage.clear();
}
/*
 *判断手机  判断内核
 */
export function versions() {
    let u = navigator.userAgent,
        app = navigator.appVersion;
    return { //移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        hsCtcs: u.indexOf('hsCtcs') > -1 //是否为手机端，自定义字符在webview加载之后
    };
}
/**
 * 将多维数组拉成一个数组
 */
export function flatten(arr){
    let res = [];
    for(let i=0;i<arr.length;i++){
        if(Array.isArray(arr[i])){
            res = res.concat(flatten(arr[i]));
        }else{
            res.push(arr[i]);
        }
    }
    return res;
}

/**
 * 取四舍五入n位小数的字符串
 * @param n 小数位数
 * @returns {*} 保留之后的字符串
 */
export function toFixed(num,n) {
    let symbol = 1;
    if (num < 0) {
        // 符号为负
        symbol = -1;
        num *= -1
    }
    let num2 = (Math.round(num * Math.pow(10, n))
        / Math.pow(10, n) + Math.pow(10, -(n + 1)))
        .toString().slice(0, -1);
    return parseFloat(num2 * symbol).toFixed(n)
}
/**
 * 防抖函数
 * @param func 用户传入的防抖函数
 * @param wait 等待的时间
 */
export function debounce(func,wait = 50) {
    // 缓存一个定时器id
    let timer = null;
    // 这里返回的函数时每次用户实际调用的防抖函数
    // 如果已经设定过定时器了就清空上一次的定时器
    // 开始一个定时器，延迟执行用户传入的方法
    return function(...args){
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            //将实际的this和参数传入用户实际调用的函数
            func.apply(this,args);
        },wait);
    }
}
/*
 * vue插件
 */
export function install(Vue, options) {
    Vue.prototype.$setStorageItem = setStorageItem;
    Vue.prototype.$getStorageItem = getStorageItem;
    Vue.prototype.$removeStorageItem = removeStorageItem;
    Vue.prototype.$removeAll = removeAll;
	Vue.prototype.$versions = versions;
    Vue.prototype.$toFixed = toFixed;
    Vue.prototype.$flatten = flatten;
    Vue.prototype.$debounce = debounce;
}