<template>
  <van-button
        @click="onCollect"
        :loading='loading'
        :icon="value===1 ? 'good-job':'good-job-o'"
        :class="{
            liked:value===1
            }"
    />
</template>

<script>
import {addLike,deleteLike} from '@/api/article.js'
export default {
    name:'likeArticle',
    data() {
        return {
            loading:false
        }
    },
    props:{
        value:{
            typr:Number,
            required:true
        },
        articleId:{
            type:[String,Number,Object],
            required:true
        }
    },
    methods:{
        async onCollect(){
            this.loading = true
            try {
                let status = -1
                if(this.value===1){
                    // 取消点赞
                    await deleteLike(this.articleId)
                } else {
                    await addLike(this.articleId)
                    status = 1;
                }
                this.$emit('input',status)
                this.$toast.success(status ===1 ? '点赞成功' : '取消点赞')
            } catch (error) {
                this.$toast.fail('操作失败，请稍后重试')
                console.log(error);
            }
            this.loading = false
        }
    }
}
</script>

<style lang="less" scoped>
    .liked {
        /deep/.van-icon {
            color:#e5645f !important;
        }
    }
</style>