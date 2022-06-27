<template>
  <div class="my-container">
        <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left" @click="gotoUserInfo">
          <van-image
            class="avatar"
            :src="userInfo.photo"
            round
            fit="cover"
          />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size='mini' to="/user/profile" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录头部 -->
    <div v-else class="header not-login" >
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- grid导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item" @click="shoucangshow = true">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
        
       <van-grid-item class="grid-item" @click="shoucangshow = true">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
       </van-grid-item>     
    </van-grid>

       <van-popup v-model="shoucangshow" position="bottom" :style="{height:'100%'}">
      <Collection 
      v-if="shoucangshow"
      @close='shoucangshow = false'
      />
      </van-popup>

    <!-- 消息通知，小志同学以及退出登录 -->
  
      <van-cell title="消息通知"  is-link/>
      <van-cell title="AI客服"  is-link class="md9"/>
      <van-cell v-if="user" 
        class="lgout-cell" 
        title="退出登录"
        clickable
        @click="onLogout"
      />

  </div>
</template>

<script>
import{ mapState } from "vuex"
import { getUserInfo } from '@/api/user.js'
import Collection from './commponents/collections.vue'
export default {
    name:'MyIndex',
    data(){
      return{
        userInfo:{} , //用户信息
        shoucangshow:false
      }
    },
    computed:{
      ...mapState(['user'])
    },
    methods:{
      onLogout(){
        // 退出提示
        this.$dialog.confirm({
          title: '是否退出登录？',
        })
          .then(() => {
            // 确认会执行这里
            this.$store.commit('setUser',null)
          })
          .catch(() => {
            // 取消执行这里
            console.log('取消');
          });
        // 清楚登录状态（容器中的user和本地存储中的user）

      },
      async loadUserInfo(){
        try{
          const { data } = await getUserInfo()
          this.userInfo = data.data
        } catch (err) {
          this.$toast('获取数据失败，请稍后重试')
        }
      },
      gotoUserInfo(){
        this.$router.push({
          name:'user',
          params:{
            userId:this.userInfo.id
          }
        })
      }
      
    },
    created(){
      // 如果用户登录了，则请求加载用户信息数据
      if(this.user){
        this.loadUserInfo()
      }

    },
    components:{
      Collection
    }
    
}
</script>

<style lang="less" scoped>
  .my-container{
    .header{
      height: 361px;
      background: url('~@/assets/banner.png');
      background-size: cover;

    }
    .not-login{
      display: flex;
      justify-content: center;
      align-items: center;
      
      .login-btn{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .mobile-img{
            width: 132px;
            height: 132px;
            margin-bottom: 15px;
          }
          .text{
            font-size: 28px;
            color: #fff;
          }
      }
    }
    .user-info{
      .base-info{
        height: 231px;
        padding: 76px 32px 23px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left{
          display: flex;
          align-items: center;
          .avatar{
            width: 132px;
            height: 132px;
            margin-right: 23px;
            border: 4px solid #fff;
          }
          .name{
            font-size: 30px;
            color: #fff;
          }
        }
        
      }
      .data-stats{
        display: flex;
        .data-item{
          flex: 1;
          height: 130px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          .count{
            font-size: 36px;
          }
          .text{
            font-size: 23px;
          }
        }
      }
    }

    .grid-nav{
      .grid-item{
        height: 141px;
        i.toutiao{
          font-size: 45px;
        }
        .toutiao-shoucang{
          color: #eb5253;
        }
        .toutiao-lishi{
          color: #ff9d1d;
        }
        span.text{
          font-size: 28px;
        }
      }
    }
    .lgout-cell{
      text-align: center;
      color: #d86262;
    }
    .md9{
      margin-bottom: 9px;
      
    }
   
  }

</style>>

