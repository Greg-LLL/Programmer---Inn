<template>
  <div class="comment-reply">
    <van-nav-bar
        title="xx条回复"
    >
        <van-icon slot="left" name="cross"></van-icon>
    </van-nav-bar>
    <!-- 当前评论项 -->
    <CommentItem 
        :comment="comment"
    />
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
export default {
    name:'CommentReply',
    components:{
        CommentItem,
    },
    props:{
        comment:{
            type:Object,
            required:true
        }
    }
}
</script>

<style lang="less" scoped>

</style>