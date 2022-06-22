<template>
  <div class="comment-reply">
    <van-nav-bar
        :title="comment.reply_count > 0 ? `有${comment.reply_count}条回复` : '暂无回复'"
    >
        <van-icon 
            slot="left" 
            name="cross" 
            @click="$emit('close')"
        />
    </van-nav-bar>
   <div class="scroll-wrap">
        <!-- 当前评论项 -->
        <CommentItem 
            :comment="comment"
    />
    <!-- 当前评论项 -->

    <!-- 评论的回复列表 -->
    <van-cell title="全部回复"/>
    <CommentList
        :list="commentList" 
        :source="comment.com_id"
        type="c"
    />
    <!-- 评论的回复列表 -->
   </div>

    <!-- 底部评论 -->
    <div class="post-wrap">
        <van-button 
        @click="isPostShower = true"
        class="post-btn" 
        size="small" round
        >写评论</van-button>
    </div>
    <!-- 底部评论 -->

    <!-- 发布评论 -->
    <van-popup 
        
        v-model="isPostShower" 
        position="bottom">
        <CommentPost 
            :target="comment.com_id"
            @post-success="onPostSuccess"
        />
    </van-popup>
    <!-- 发布评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
    name:'CommentReply',
    components:{
        CommentItem,
        CommentList,
        CommentPost
    },
    props:{
        comment:{
            type:Object,
            required:true
        }
    },
    data(){
        return {
            isPostShower:false,
            commentList:[] //评论的回复列表 
        }
    },
    methods:{
        onPostSuccess(data) {
            // 更新的回复的数量
            this.comment.reply_count ++
            // 关闭弹层
            this.isPostShower = false
            // 将最新的回复内容展示到列表的顶部
            this.commentList.unshift(data.new_obj)
        }
    }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow: auto  ;
}

.post-wrap{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn {
        width: 60%;

    }
}
</style>