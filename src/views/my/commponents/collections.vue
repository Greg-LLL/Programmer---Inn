<template>
  <div class="collect">
        <van-nav-bar
          :title="nameShower === true ? '收藏' :'历史'"
          left-arrow
          @click-left="$emit('close')"
          class="page-nav-bar"
        />
        <van-tabs v-model="active" @click="nameShower = !nameShower">
        <van-tab title="收藏"  >
            <ArticleItem 
            v-for="(obj,index) in list[0]"
            :key="index"
            :article ='obj'
            />
        </van-tab >
            <van-tab title="历史"  >
            <ArticleItem 
            v-for="(obj,index) in historyList[0]"
            :key="index"
            :article ='obj'
            />
            </van-tab>
        </van-tabs>
      </div>
</template>

<script>
import ArticleItem from '@/components/article-item'
import {getUserCollections,getUserHistory} from '@/api/user.js'
export default {
 data() {
    return {
      active: 2,
      list:[],
      historyList:[],
      nameShower:true
    };
  },
   name:'collectIndex',
  methods:{
     async loadUserCollections(){
         const{data} = await getUserCollections()
         const {results} = data.data
         this.list.push(results)
      },
       async loadUserHistory(){
         const{data} = await getUserHistory()
         const {results} = data.data
         this.historyList.push(results)

      }
  },
  created(){
      this.loadUserCollections()
      this.loadUserHistory()
  },
  components:{
      ArticleItem
  }
}
</script>

<style lang="less" scoped>

</style>