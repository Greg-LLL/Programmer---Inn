<template>
      <van-button
            v-if="value"
            class="follow-btn"
            round
            :loading = 'loading'
            size="small"
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            :loading = 'loading'
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
          >关注</van-button>
</template>

<script>
import{addFollow,deleteFollow} from '@/api/user.js'
export default {
    props:{
        value:{
            type:Boolean,
            required:true
        },
        userId:{
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
        async onFollow(){
        try {
          this.loading = true
          if(this.value){
            // 已关注，取消关注
           const {data} = await deleteFollow(this.userId)
          //  this.article.is_followed = false
          } else {
            // 未关注，关注
           const {data} = await addFollow(this.userId)

          }
        //    this.article.is_followed = ! this.article.is_followed
        //   this.$emit('update-is_followed',!this.value)
        this.$emit('input',!this.value)
        } catch (err) {
          const message = '操作失败，请重试'
          if(err.response && err.response.status === 400){
            this.$toast('不能关注自己哦')
          } else if(err.response && err.response.status === 401) {
            this.$toast('请先登录')
          } else {
            this.$toast(message)
            console.log(err);
          }
          
        }
         this.loading = false
      }
    }

}
</script>

<style lang="less" scoped>

</style>