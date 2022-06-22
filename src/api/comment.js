// 评论请求模块
import request from '@/utils/request'

// 获取文章评论列表
export const getComments = params =>{
    return request({
        method:'get',
        url:'/v1_0/comments',
        params
    })
}

// 对文章评论点赞 
export const addCommentLike = target =>{
    return request({
        method:'post',
        url:'/v1_0/comment/likings',
        data:{
            target
        }
    })
}


// 对文章评论取消点赞 
export const deleteCommentLike = target =>{
    return request({
        method:'delete',
        url:`/v1_0/comment/likings/${target}`,
        
    })
}