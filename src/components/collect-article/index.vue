<template>
    <van-button
        @click="onCollect"
        :loading='loading'
        :icon="value ? 'star':'star-o'"
        :class="{
            collected:value
            }"
    />
</template>

<script>
import {addCollect,deleteCollect} from '@/api/article.js'
export default {
    name:'collectArticle',
    props:{
        value:{
            type:Boolean,
            required:true
        },
        articleId:{
            type:[Number,String,Object],
            required:true
        }
    },
    data(){
        return {
            loading:false
        }
    },
    methods:{
        async onCollect(){
            this.loading = true
            try {
                if(this.value){
                    // 已收藏。取消收藏
                    await deleteCollect(this.articleId)
                } else {
                    // 未收藏，添加收藏
                    await addCollect(this.articleId)
                }
                // 自定义事件修改数据并不是立即的
                this.$emit('input',!this.value)
                this.$toast.success(!this.value ? '收藏成功' :'取消收藏')
            } catch (err) {
                this.$toast('操作失败，请重试')
            }
            this.loading = false
        }
    }
}
</script>

<style lang="less" scoped>
.collected {
    /deep/.van-icon {
        color: #ffa500 !important;
    }
}
</style>