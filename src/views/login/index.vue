<template>
  <div class="login-container">
    <!-- 当前页面导航栏 -->
  <van-nav-bar class="page-nav-bar "
    title="登录"
  > 
  <van-icon
   slot="left"  
   name="cross"
   @click="$router.back()"
   />
  </van-nav-bar>
  <!-- 表单 -->
  <van-form 
  ref="loginForm"
  @submit="onSubmit"
  >
  <van-field
    v-model="user.mobile"
    name="mobile"
    placeholder="请输入手机号"
    :rules="userFormRules.mobile" 
    type="number"
    maxlength="11"
    left-icon="smile-o" 
  >
  <i slot="left-icon" class="toutiao toutiao-shouji"></i>
  </van-field>
  <van-field
    v-model="user.code"
    :rules="userFormRules.code" 
    type="number"
    maxlength="6"
    name="code"
    placeholder="请输入验证码"
  >
  <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
  <template #button>
    <!-- time:倒计时时长 -->
    <van-count-down 
      v-if="isCountDownShow"
      :time="1000 * 60" 
      format="ss s" 
      @finish='isCountDownShow = false'
    />
    <van-button class="send-ssm-btn" 
      v-else
      native-type="button"
      round size="small" 
      type="default"
      @click="onSendSms"
    >发送验证码</van-button>
  </template>
  </van-field>
  <div class="login-btn-warp">
    <van-button  class="login-btn" block type="info" native-type="submit">登录</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
import {login,sendSms} from '@/api/user.js'
export default {
    name:'LoginIndex',
    data() {
    return {
      user:{
        mobile:'',
        code:''
      },
      userFormRules:{
        mobile:[{ 
          required: true, 
          message: '手机号不能为空' 
          },{
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message:'手机号格式错误'
          }
          ],
        code:[{ 
          required: true, 
          message: '请填写验证码' 
          },{
            pattern :/^\d{6}$/,
            message:'验证码错误'
          }]
      },
      isCountDownShow:false
    };
  },
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user

      // 2.表单验证

      // 在组件中必须通过this.$toast来调用toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,  //禁用背景点击
        duration:0,//持续时间,默认是2000毫秒.如果为0则持续展示
      });

      // 3.提交表单,请求登录
      try{
        const { data } =await login(user);
        this.$store.commit('setUser',data.data)
        this.$toast.success('登录成功')

        // 登录成功，跳转回原来页面
        // back方式不严谨
        this.$router.back()
      } catch(err){
        if(err.response.status === 400){
          this.$toast.fail('手机或验证码错误');
        }else{  
           this.$toast.fail('登录失败,请稍后重试')
        }
      }

      // 4.根据表单响应结果,处理后续操作
    },

    async onSendSms(){
      // 1.校验手机号
      try{
        await this.$refs.loginForm.validate('mobile')
      }catch(err){
        return console.log('验证失败',err);
      }
      // 2.验证通过,显示倒计时
        this.isCountDownShow = true

      // 3.请求发送验证码
        try {
          await sendSms(this.user.mobile)
          this.$toast('发送成功')
        } catch (err){
          if(err.response.status === 429){
            // 发送失败,关闭倒计时
            this.isCountDownShow = false
            this.$toast('发送太频繁了，请稍后重试')
          } else {
            this.$toast('发送失败')
          }
        }
    }
  },
}

</script>

<style lang="less" scoped>
  .login-container{
    .toutiao {
      font-size: 37px;
    }
    .send-ssm-btn{
      background-color: #ededed;
      width:158px;
      height: 50px;
      line-height: 46px;
      font-size:22px;  
      color: #666;
      // display: block;
    }
    .login-btn-warp{
      padding: 53px 33px;
      .login-btn{
        background-color: #6db4fb;
        border: none;
      }
    }
  }
</style>>
    
