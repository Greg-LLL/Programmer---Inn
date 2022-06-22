<template>
  <div class="search-suggestion">
      <van-cell 
      v-for="(text,index) in suggestions"
      :key="index"
       icon="search"
       @click="$emit('search',text)"
      >
        <div slot="title" v-html="hightlight(text)"></div>
       </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
    name:'SearchSuggestion',
    props:{
        searchText:{
            type:String,
            required:true
        },
    },
    data(){
        return {
            suggestions:[],
        }

    },
    watch:{
        searchText:{
            // handler(val){
            //     this.loadSearchSuggestions(val)
            // },
            // 该回调将在侦听开始之后被立即被调用
            handler:debounce(function(val){
                this.loadSearchSuggestions(val)
            },200),
            immediate:true
        },

    },
    methods:{
        async loadSearchSuggestions(q){
            try {
                const { data } =  await getSearchSuggestions(q)   
                    this.suggestions = data.data.options 
            } catch (error) {
                this.$toast('数据获取失败,请稍后重试')
            }
        },
        hightlight (text) {
            const hightlightStr = `<span class="active">${this.searchText}</span>`
            
            // 正则表达式 //中间的内容都会当作匹配字符串来使用,而不是数据变量
            // 如果需要根据数据变量动态的创建正则表达式,则手动new RegExp
            // RegExp 正则表达式构造函数
            //      参数1：匹配模式字符串,它会根据这个字符串创建正则对象
            //      参数2：匹配模式，要写到字符串中
            if(this.suggestions.length > 1){
                const reg = new RegExp(this.searchText,'gi')
                return text.replace(reg,hightlightStr)
            } else {
                return
            }
        }
    }
}
</script>

<style lang="less" scoped>
.search-suggestion {
    /deep/span.active {
        color:#3296fa ;
    }
}
</style>