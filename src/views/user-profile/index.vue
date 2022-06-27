<template>
  <div class="user-profile">
      <!-- 导航栏 -->
      <van-nav-bar title="个人信息"
        class="page-nav-bar"
        left-arrow
        @click-left="$router.back()"
       />
      <!-- 导航栏 -->

      <input 
        type="file" 
        hidden ref="file"
        @change="onChange"
      >

      <!-- 个人信息 -->
      <van-cell title="头像" is-link>
        <van-image
            class="avatar"
            fit="cover"
            round
            :src="user.photo"
            @click="$refs.file.click()"
        />
      </van-cell> 
      <van-cell title="昵称" 
        @click="isUpdataNameShower = true"
        :value="user.name" 

        is-link
      />
      <van-cell title="性别" 
        :value="user.gender === 1 ? '女' : '男'" 
        @click="isUpdataGenderShower = true"
        is-link
      />
      <van-cell title="生日" 
        :value="user.birthday" is-link
        @click="isUpdataBirthdayShower = true"
      />
      <!-- 个人信息 -->

      <!-- 编辑昵称 -->
      <van-popup 
        position="bottom"
        v-model="isUpdataNameShower" 
        style="height:100%">
        <updataName 
            v-if="isUpdataNameShower"
            @close='isUpdataNameShower = false'
            v-model='user.name'
        /> 
      </van-popup>
      <!-- 编辑昵称 -->

      <!-- 编辑性别 -->
      <van-popup 
        position="bottom"
        v-model="isUpdataGenderShower" 
        
      >
       <updataGender 
        v-model="user.gender"
        v-if="isUpdataGenderShower"
        @close='isUpdataGenderShower = false' 
       />
      </van-popup>
      <!-- 编辑性别 -->

      <!-- 编辑生日 -->
      <van-popup 
        position="bottom"
        v-model="isUpdataBirthdayShower"
      >
       <updataBirthday 
       v-if="isUpdataBirthdayShower"
       v-model="user.birthday"
       @close="isUpdataBirthdayShower = false"
       />
      </van-popup>
      <!-- 编辑生日 -->

      <!-- 编辑头像 -->
       <van-popup 
        position="bottom"
        v-model="isUpdataPhotohower"
        style="height:100%"
      >
      <updataPhoto 
        v-if="isUpdataPhotohower"
        :img="img"
        @close='isUpdataPhotohower = false'
        @updata-photo="user.photo = $event"
      />
      </van-popup>
      <!-- 编辑头像 -->
  </div>
</template>

<script>
import {getUserProfile} from '@/api/user'
import updataGender from './components/updata-gender.vue'
import updataName from './components/updata-name.vue'
import updataBirthday from './components/updata-birdthay.vue'
import updataPhoto from './components/updata-photo.vue'
export default {
    name:'UserProfile',
    data(){
        return {
            user:{} ,//个人信息
            isUpdataNameShower:false,
            isUpdataGenderShower:false,
            isUpdataBirthdayShower:false,
            isUpdataPhotohower:false,
            img:null, //预览的图片
        }
    },
    created(){
        this.loadUserProfile()
    },
    methods:{
        async loadUserProfile(){
            try {
                const {data}= await getUserProfile()
                this.user = data.data
            } catch (error) {
                this.$toast.fail('数据获取失败')
            }
        },
        onChange(){
            // 获取文件对象
            const file = this.$refs.file.files[0]
            // 基于文件对象获取blob数据(图片的src),
            this.img  =  window.URL.createObjectURL(file)
            //  展示弹出预览图片弹出层
            this.isUpdataPhotohower = true
            // file-input 如果选了同一个文件不会触发chang事件
            // 解决办法：每次使用完毕，把它的value清空
            this.$refs.file.value=''
            
        }
    },
    components:{
        updataName,
        updataGender,
        updataBirthday,
        updataPhoto
    }
}
</script>

<style lang="less" scoped>
.user-profile {
    .avatar {
        width: 60px;
        height: 60px;
    }
    .van-popup {
        background-color: #f5f7f9;
    }
}
</style>