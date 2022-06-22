<template>
  <div class="search-result">
    <van-list
        v-model="loading"
        :finished="finished"
        :error.sync = error
        error-text="加载失败，请稍后重试"
        finished-text="没有更多了"
        @load="onLoad"
    >
  <van-cell v-for="(article,index) in list" 
  :key="index" 
  :title="article.title" />
</van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
name:'SearchResult',
props:{
  searchText:{
    type:String,
    required:true 
  }
},
data(){
    return {
      list:[],
      loading: false,
      finished: false,
      page:1, //页数
      perpage:20 ,//每页数据条数
      error:false
    }
},
  methods: {
    async onLoad() {
     try {
      // 1.请求获取数据
      const { data } = await getSearchResult({
        page:this.page,
        per_page:this.perpage,
        q:this.searchText
      })
      // 测试加载失败
      // if(Math.random() > 0.5){
      //   JSON.parse('sfdasfdczcwa')
      // }
      // 2.将数据添加到数组列表中
      const {results} = data.data
      this.list.push(...results)
      // 3.将本次加载中的loading关闭
      this.loading =false
      // 4.判断是否还有数据
      if(results.length){
      //    如果有，则更新获取下一页数据的页码
        this.page++
      } else{
      //    如果没有，则将加载状态设置为结束
        this.finished = true
      }
     } catch (error) {
       this.$toast('请求失败，请稍后重试')
       this.error = true
       this.loading = false
       console.log(error);
     }
    },
  },
}
</script>

<style>

</style>