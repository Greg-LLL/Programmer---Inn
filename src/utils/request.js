import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// JSONBig 能处理数据中超出JS安全整数范围的问题

// JSONBig.parse() 把JSON格式的字符串转为JS对象
// 使用的时候需要把BIGNumber类型的数据转为字符串


// JSONBig.stringify() 把JS对象转化为JSON格式的字符串
const request = axios.create({
    baseURL:"http://toutiao.itheima.net" ,// 基础路径
    // 自定义后端返回的原始数据
    transformResponse: [function (data) {
    //  处理BigNumber
      try {
        return JSONBig.parse(data)
      } catch (error) {
        return data
      }
    }],
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
    // 请求发起会经过这里
      // config 配置对象:本次请求的配置对象
    const { user } = store.state
    if(user && user.token){
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意：这里务必要返回config配置对象,否则请求就停在这里 出不去了
    return config;
  }, function (error) {
    // 如果请求出错(请求还未发出去) 会进入这里
  
    
    return Promise.reject(error);
  });


// 响应拦截器
request.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export default request