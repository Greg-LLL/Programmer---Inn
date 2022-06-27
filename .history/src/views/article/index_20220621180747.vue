<template>
    <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="头条"
       @click-left="onClickLeft"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap" >
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime }}</div>
          <!-- 模板中的$event 是事件参数（
          此处是follow-user传过来的！this.isFollowed） 
          
          当我们传递给子组件的数据既要子组件使用还要修改
              传递:props
              :isFollowed='article.is_followed'              
              修改：自定义事件
              @update-is_followed='article.is_followed = $event'              
           简写方式:在组件中使用v-model 
              v-model相当于执行以下两条代码
              value="article.is_followed"  
              @input="article.is_followed = $event"
              所有我们需要将子组件的isFollowed改成value
                将
          -->
          <FollowUser 
            class="follow-btn"
            v-model="article.is_followed"
            :userId='article.aut_id'
          />
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            :loading = 'followLoading'
            size="small"
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            :loading = 'followLoading'
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
          >关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="markdown-body  article-content" 
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章的评论列表 -->
        <CommentList
          :list='commentList' 
          @replyClick='onReplyClick'
          :source = 'article.art_id'
          @onload-success = 'totalCommentCount = $event.total_count '
        />
        <!-- 文章的评论列表 -->
            <!-- 底部区域 -->

            <!-- 发布评论 -->
            <van-popup 
            v-model="isPostShower"
            position="bottom"
            >
            <CommentPost
              :target="article.art_id"
              @post-success='onPostSuccess'
               
            /></van-popup>
            <!-- 发布评论 -->
    <div class="article-bottom">
      <van-button
      @click="isPostShower = true"
        class="comment-btn"
        type="default"
        round
        size="small"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      />
      <CollectArticle 
        class="btn-item"
        v-model="article.is_collected"
        :articleId='article.art_id'
      />
      <!-- <van-icon
        color="#777"
        name="star-o"
      /> -->
      <LikeArticle
        class="btn-item"
        v-model="article.attitude"
        :articleId='article.art_id'
      />
      <!-- <van-button
        class="btn-item"
        icon="good-job-o"
      /> -->
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button 
          @click="loadArticle"
          class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

      <!-- 评论回复 -->
       <van-popup 
            v-model="isReplyShower"
            position="bottom"
            style="height:100%"
           
        >
            <CommentReply 
              :comment="currentComment"
            />
        </van-popup>
      <!-- 评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant';
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'
// ImagePreview({ 
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg',
//   ],
//   // 起始位置,从0开始
//   startPosition: 1,
//    onClose() {
//     console.log('onClose');
//   },
// });
export default {
    name:'ArticleIndex',
    props:{
      articleId:{
        type:[Number,String,Object],
        requied:true
      }
    },
    data(){
      return {
        article:{}, //文章详情
        loading:true ,//加载状态
        errStatus:0 ,//失败的状态码
        totalCommentCount:0,
        isPostShower:false,
        commentList:[] , //评论列表
        isReplyShower:false,
        currentComment:{}
      }
    },
    created(){
      this.loadArticle()
    },
    methods:{
      async loadArticle () {
        this.loading = true
        try {
          const { data } = await getArticleById(this.articleId)
          // 测试代码
          // if(Math.random() > 0.5){
          //   JSON.parse('sdadafaxcdw')
          // }
          this.article = data.data

          // 初始化图片，点击预览
          // console.log(this.$refs['article-content']);
          setTimeout(() =>{
            this.previewImage()
          },0)
          
        } catch (err) {
          if(err.response && err.response.status === 404){
            this.errStatus = 404
          }
        }
        this.loading = false
      },
      onClickLeft(){
        this.$router.back()
      },

      previewImage(){
        // 得到所有的img节点
        const articleContent = this.$refs['article-content']
        const imgs = articleContent.querySelectorAll('img')
        imgs.src = './1.jpg'
        // 获取所有的img地址
        const images = []
        imgs.forEach((img,index) => {
          images.push(img.src)
          img.onclick= () => {
            ImagePreview({
              // 预览的图片地址数组
              images,
              // 起始位置,点谁，起始位置就是谁的索引
              startPosition: index,
            });
          }
        });
      },

      onPostSuccess(data){
            //   关闭弹出层
            this.isPostShower = false
            // 发布的内容显示到顶部
            this.commentList.unshift(data.new_obj)
      },
      onReplyClick(comment){

        this.currentComment = comment
        // 显示评论结果
        this.isReplyShower = true
      }
     
    
    },
    components:{
      FollowUser,
      CollectArticle,
      LikeArticle,
      CommentList,
      CommentPost,
      CommentReply
    }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css"; 
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
     
    }
    /deep/.van-icon {
      font-size: 40px;
      color:#777777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .article-content{
    /deep/img {
      height: 150px;
      width: 150px;
    }
  }

}
</style>