<template>
  <div class="article-list">
    <van-pull-refresh 
    v-model="isreFreshLoading" 
    :success-text="refreshSuccessText"
    :success-duration='1500'
    @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            finished-text="没有更多了"
            @load="onLoad"
            >
        
        <ArticleItem 
            v-for="(article,index) in list" 
            :key="index" 
            :article ='article'
        />
        <!-- <van-cell 
            v-for="(article,index) in list" 
            :key="index" 
            :title="article.title" 
        /> -->
        </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {  getArticles } from '@/api/article.js'
import  ArticleItem  from '@/components/article-item/index.vue'
export default {
    name:'ArticleList',
    props:{
        channel:{
            type:Object,
            required:true
        }
    },
    components:{
        ArticleItem
    },
    data(){
        return {
            list: [], //存储列表数据的数组
            loading: false,//控制加载中loading状态
            finished: false,//控制数据加载结束的状态
            timestamp:null ,//请求获取下一页的时间戳
            error:false, //控制列表加载失败的提示状态
            isreFreshLoading:false,//控制下拉刷新的loading状态
            refreshSuccessText:'刷新成功'//下拉刷新提示成功文本
        }
    },
    methods:{
        // 初始化或滚动到底部时会触发onload事件
        //     onLoad() {
        //     // 1.请求获取数据   
        //     // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        //     setTimeout(() => {
        //         for (let i = 0; i < 10; i++) {
        //         this.list.push(this.list.length + 1);
        //         }

        //         // 加载状态结束
        //         this.loading = false;

        //         // 数据全部加载完成
        //         if (this.list.length >= 40) {
        //         this.finished = true;
        //         }
        //     }, 1000);
        // }
          async onLoad() {
             try {
            // 1.请求获取数据 
                const {data}  = await getArticles({
                    channel_id:this.channel.id, //频道id
                    // 请求第一页数据：当前最新时间戳
                    // 用于请求之后数据的时间戳会在当前请求结果中返回给你
                    timestamp:this.timestamp || Date.now()
                   
                })

            // 2.把请求结果数据放到list数组中
                const { results } = data.data
                // ...是数组的展开操作符，它会把数组元素一个一个拿出来
                // 例如:results[0],results[1],results[2],results[3]等
                this.list.push(...results)

            // 3.本次数据加载结束之后要把加载状态设置为结束
                this.loading = false

            // 4.判断数据是否全部加载完成
                if(results.length){
                    // 更新下一页数据的时间戳
                    this.timestamp = data.data.pre_timestamp
                } else {
                    // 没有数据了，将finished 设置 为true，不再load 加载更多
                    this.finished = true
                }
                
            } catch (error) {
                // 展示错误提示
                this.error = true;
                // 请求失败了,loading也要关闭
                this.loading = false
            }
           
        },

        // 当下拉刷新的时候会触发该函数
        async onRefresh(){
            try {
                // 请求回去数据
                const {data}  = await getArticles({
                    channel_id:this.channel.id, //频道id
                    timestamp:Date.now() //下拉刷新，每次请求的都是当前最新数据                   
                   
                })
                //  console.log(data); 
                // 模拟随机失败案例
                // if(Math.random() > 0.2){
                //     JSON.parse('afasdasf')
                // }

                // 将数据追加到列表的顶部
                const { results } = data.data
                this.list.unshift(...results)
                // 关闭下拉刷新的loading状态
                this.isreFreshLoading = false;   
                this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`            
            } catch (error) {
                this.refreshSuccessText = '刷新失败'
                this.isreFreshLoading = false
            }
        }
    }
}
</script>

<style>
.article-list {
    height: 79vh;
    overflow-y: auto;
}
</style>