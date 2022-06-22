import request from '@/utils/request.js'

// 请求搜索联想建议
export const getSearchSuggestions = q =>{
    return request({
        method:'get',
        url:'/v1_0/suggestion',
        params:{
            q
        }
    })
}

// 获取搜索结果
export const getSearchResult = params =>{
    return request({
        method:'get',
        url:'/v1_0/search',
        params
    })
}