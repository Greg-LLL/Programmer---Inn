<template>
  <div class="search-container">
    <!-- 搜索栏 -->
   <form class="search-from" action="/">
    <van-search
        v-model="searchText"
        show-action
        background='#3692fa'
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
    />
    <!-- 搜索栏 -->
   </form>
    <!-- 搜索结果 -->
    <SearchResult 
    v-if="isResultShow"
    :searchText='searchText'
    />
   <!-- 搜索结果 -->
   
    <!-- 联想建议 -->
   <SearchSuggestion 
    v-else-if="searchText"
    :searchText = 'searchText'
    @search='onSearch'
   />
   <!-- 联想建议 -->

   <!-- 搜索历史纪录 -->
   <SearchHistory 
   v-else
   :searchHistory='searchHistory'
   @clearSearchHistory=' searchHistory = []'
   @search='onSearch'
   />
   <!-- 搜索历史纪录 -->
  </div>
</template>

<script>
import {setItem,getItem} from '@/utils/storage.js'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
export default {
    name:'SearchIndex',
    data(){
        return {
            searchText:'',
            isResultShow:false,  //控制搜索结果展示
            searchHistory:getItem('SEARCHHISTORY') || [] //搜索的历史记录数据
        }
    },
    methods: {
        onSearch(val) {
            // 更新文本框内容
            this.searchText = val;
            

            // 存储搜索历史记录 
            // 要求:不要有重复的历史记录
            //      最新的排在最前面
            const index = this.searchHistory.indexOf(val)
            if(index !== -1){
                this.searchHistory.splice(index,1)
            }
            this.searchHistory.unshift(val)

            //  渲染搜索结果
            this.isResultShow = true;

            
        },
        onCancel() {
            this.$router.back()
        },
    },
    watch:{
        searchHistory(val){
            // 本地存储搜索历史记录
            setItem('SEARCHHISTORY',val)
        }
    },
    components:{
        SearchHistory,
        SearchResult,
        SearchSuggestion
    },
}
</script>

<style lang="less" scoped>
.search-container {
    padding-top: 108px;
    .van-search__action {
        color: #fff;
    }
    .search-from {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}

</style>