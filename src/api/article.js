// 文章请求模块
import request from '@/utils/request.js'

// 请求获取文章列表数据
export const getArticles = params =>{
    return request({
        method:'get',
        url:'/v1_0/articles',
        params
    })
}

// 请求获取文章详情
export const getArticleById = articleId =>{
    return request({
        method:'get',
        url:`/v1_0/articles/${articleId}`,
    })
}

//收藏文章
export const addCollect = target =>{
    return request({
        method:'post',
        url:"/v1_0/article/collections",
        data:{
            target
        }
    })
}

//取消收藏文章
export const deleteCollect = target =>{
    return request({
        method:'delete',
        url:`/v1_0/article/collections/${target}`,
        
    })
}
//点赞文章
export const addLike = target =>{
    return request({
        method:'post',
        url:'/v1_0/article/likings',
        data:{
            target
        }
    })
}

//取消点赞文章
export const deleteLike = target =>{
    return request({
        method:'delete',
        url:`/v1_0/article/likings/${target}`,
    })
}

//发布文章评论或者对文章评论评论
export const addComments = data =>{
    return request({
        method:'post',
        url:'/v1_0/comments',
        data
    })
}