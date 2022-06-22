<template>
  <div class="home-container">
      <!-- 当前页面导航栏 -->
  <van-nav-bar class="page-nav-bar" fixed> 
    <van-button 
    class="search-btn"
    slot="title"
    type="info"
    size="small"
    round
    icon="search"
    to="/search"
    >搜索</van-button>
  </van-nav-bar>
   <!-- 当前页面导航栏 -->
  <!-- 频道列表 -->
  <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
  <van-tabs class="channel-tabs" v-model="active" animated swipeable>
    <van-tab 
      :title="channel.name"
      v-for="channel in channels" 
      :key="channel.id"
    >
    <!-- 文章列表 -->
    <ArticleList :channel='channel'/>
     <!-- 文章列表 -->
    </van-tab>
     
    <div slot="nav-right" class="placeholder"></div>
    <div 
      slot="nav-right" 
      class="hamburger-btn" 
      @click="isChennelEditShow = true">
      <i class="toutiao toutiao-gengduo"></i>
    </div>
    
     <!-- 频道列表 -->
  </van-tabs>
  <!-- 频道编辑弹出层 -->
  <van-popup
    v-model="isChennelEditShow"
    closeable
    position="bottom"
    :style="{ height: '100%' }"
    close-icon-position="top-left" 
  >
    <ChennelEdit 
    :my-channels='channels' 
    :active='active'
    @update-active="onUpdateActive"
    />
  </van-popup>
  <!-- 频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import ArticleList from './components/article.vue'
import ChennelEdit from './components/chennel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
    name:"HomeIndex",
    data(){
      return{
        active: 0,
        channels:[],//频道列表
        isChennelEditShow:false //控制编辑频道弹出层的展示状态
      }
    },
    created(){
      this.loadChannels()
    },
    methods:{
      async loadChannels(){
        try {
          // const{ data } = await getUserChannels()
          // this.channels = data.data.channels
          let channels = []
          // 1.判断用户是否登录
          if(this.user){
            // 2.用户登录,请求用户的频道
            const { data } = await getUserChannels()
            channels = data.data.channels
          } else {
            // 3.用户未登录
            const localChannels = getItem('TOUTIAO_CHANNELS')
            // 4.判断用户本地存储是否有频道,有则拿本地存储的频道
            if(localChannels){
              channels = localChannels
            } else {
              // 5.用户本地存储没有频道,请求默认频道
              const { data } = await getUserChannels()
              channels = data.data.channels
            }
          }
          this.channels =  channels
        } catch (error) {
          this.$toast('获取频道失败')
        }
      },
      onUpdateActive(index,isChennelEditShow = true){
        this.active = index
        this.isChennelEditShow =isChennelEditShow
      }
    },
    components:{
      ArticleList,
      ChennelEdit
    },
    computed:{
      ...mapState(['user'])
    }
}
</script>

<style  scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
    .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon{
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap{
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line{
      width: 31px !important; 
      bottom: 8px;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }

      &::before{
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url('~@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
  }
  

}
</style>