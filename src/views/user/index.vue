<template>
  <div class="user-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      :title="list.name"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="user-info">
      <div class="base-info">
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="list.photo"
        />
        <div class="right-area">
          <div class="stats-wrap">
            <div class="stats-item">
              <span class="count">{{ list.art_count }}</span>
              <span class="text">发布</span>
            </div>
            <div class="stats-item">
              <span class="count">{{ list.fans_count }}</span>
              <span class="text">关注</span>
            </div>
            <div class="stats-item">
              <span class="count">{{ list.follow_count }}</span>
              <span class="text">粉丝</span>
            </div>
            <div class="stats-item">
              <span class="count">{{ list.like_count }}</span>
              <span class="text">获赞</span>
            </div>
          </div>
          <van-button class="follow-btn" @click="userProfileBtn">编辑资料</van-button>
        </div>
      </div>
      <div class="label-info">
        <div class="bio-wrap">
          <span class="label">简介：</span>
          <span class="text">{{ list.info }}</span>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { getUserMessage } from '@/api/user.js'
export default {
  name: 'UserIndex',
  components: {},
  props: {
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      list:{}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserMessage()
  },
  mounted () {},
  methods: {
    async loadUserMessage(){
      try {
        const {data} = await getUserMessage()

        this.list = data.data
      } catch (error) {
        this.$toast.fail('数据获取失败')
        console.log(error);
      }
    },
    userProfileBtn(){
      this.$router.push('/user/profile')
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-info {
    background-color: #fff;
    padding: 25px 32px;
    .base-info {
      display: flex;
      margin-bottom: 25px;
      .avatar {
        width: 155px;
        height: 155px;
        margin-right: 62px;
      }
    }
    .label-info {
      font-size: 25px;
      .bio-wrap {
        .label {
          color: #646263;
        }
        .text {
          color: #212121;
        }
      }
    }
  }
  .right-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .stats-wrap {
      display: flex;
      justify-content: space-between;
      .stats-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .count {
          font-size: 26px;
          color: #0d0a10;
        }
        .text {
          font-size: 21px;
          color: #9c9b9d;
        }
      }
    }
    .follow-btn {
      width: 289px;
      height: 55px;
      line-height: 55px;
      background-color: #6bb5ff;
      color: #fff;
      border: none;
      margin-left: 75px;
    }
  }
}
</style>