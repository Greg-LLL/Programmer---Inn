// 用户相关请求模块
import request from "../utils/request";
// import store from "../store";
export const login = data =>{
    return request({
        method:'post',
        url:'/v1_0/authorizations',
        data
    })
}

// 发送验证码
// 每个手机每分钟只能发送一次
export const sendSms = mobile =>{
    return request({
        url:`/v1_0/sms/codes/${mobile}`,
        method:'get'
    })
}


// 获取用户自己的信息

export const getUserInfo = () =>{
    return request({
        url:'/v1_0/user',
        method:'get',
        // 发送请求头数据
        // headers:{
        //     // 注意:该接口需要授权才能访问
        //     // token的数据格式:Bearer token数据，主要Bearer 后面有个空格
        //     Authorization:`Bearer ${store.state.user.token}`
        // }
    })
}

// 获取用户频道列表

export const getUserChannels = () =>{
    return request({
        url:'/v1_0/user/channels',
        method:'get',
    })
}

// 关注用户
export const addFollow = target =>{
    return request({
        url:'/v1_0/user/followings',
        method:'post',
        data:{
            target
        }
    })
}

// 取消关注用户
export const deleteFollow = target =>{
    return request({
        url:`/v1_0/user/followings/${target}`,
        method:'delete',
    })
}

/**
 * 获取当前登录用户的个人资料
 */
 export const getUserProfile = target => {
    return request({
      method: 'GET',
      url: '/v1_0/user/profile'
    })
  }

/**
 * 获取当前登录用户的个人资料
 */
 export const updataUserProfile = data => {
    return request({
      method: 'PATCH',
      url: '/v1_0/user/profile',
      data
    })
  }

  /**
 * 更新用户的招聘资料
 */
 export const updataUserPhoto = data => {
    return request({
      method: 'PATCH',
      url: '/v1_0/user/photo',
      data
    })
  }