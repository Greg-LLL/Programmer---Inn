<template>
  <van-list
    v-model="loading"
    :finished="finished"
    :immediate-check="false"
    finished-text="没有更多了"
    @load="onLoad"
    :error='error'
    error-text="加载失败，点击重试"
  >
  <CommentItem 
  v-for="(item,index) in list" 
  :key="index" 
  :comment="item"
  @replyClick="$emit('replyClick',$event)"
  />
  
</van-list>
</template>

<script>
import {getComments} from '@/api/comment.js'
import CommentItem from './comment-item.vue'
export default {
name:'CommentList',
props:{
  source:{
    type:[Number,String,Object],
    required:true
  },
  list:{
    type:Array,
    default:()=>[]
  },
  type:{
    type:String,
    // 自定义校验
     Validator(value){
      return ['a','c'].includes(value)
    },
    default:'a',
  }
},
data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset:null,//获取下一页数据的标记
      limit:10,
      error:false
    };
  },
  created(){
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const {data} = await getComments({
          type:this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source:this.source.toString(), //源id，文章id或评论id
          // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          offset:this.offset,
          limit:this.limit
        })
        // 2.将数据添加到列表中
        const { results, } = data.data
        this.list.push(...results)

        // 把文章评论的总数量传递到外部
        this. $emit('onload-success',data.data)

        // 3.将loading设置为false
        this.loading = false
        // 4.判断是否还有数据
        if(results.length){
          // 有数据就更新获取下一页数据
          this.offset = data.data.last_id
        } else {
          // 没有就将finished设置为true
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
    },
   
  },
  components:{
    CommentItem
  }
}
</script>

<style lang="less" scoped>

</style>