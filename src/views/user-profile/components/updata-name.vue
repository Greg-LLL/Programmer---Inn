<template>
    <div class="updata-name">
        <!-- 导航栏 -->
        <van-nav-bar 
            title="设置昵称"
            left-text="取消"
            right-text="完成"
            @click-left="$emit('close')"
            @click-right='onConfim'
        />
      <!-- 导航栏 -->

      <!-- 输入框 -->
      <div class="filed-wrap">
        <van-field
            v-model.trim="localName"
            rows="2"
            autosize
            type="textarea"
            maxlength="7"
            placeholder="请输入昵称"
            show-word-limit
        />
      </div>
      <!-- 输入框 -->
    </div>
</template>

<script>
import {updataUserProfile} from '@/api/user'
export default {
    name:'updataName',
    data(){
        return {
            localName:this.value,
        }
    },
    props:{
        value:{
            type:String,
            required:true
        }
    },
    methods:{
        async onConfim(){
            this.$toast.loading({
                message:'保存中',
                forbidClick:true,//禁止背景点击
                duration:0 //持续展示
            })
            try {
                const localName = this.localName
                if(!localName.length){
                    this.$toast('昵称不能为空')
                    return
                }
                await updataUserProfile({
                    name:localName
                })
                // 更新视图
                this.$emit('input',localName)
                // 关闭弹层
                this.$emit('close')
                // 提示成功
                this.$toast.success('修改成功')
                
            } catch (error) {
                this.$toast.fail('修改失败')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.filed-wrap {
    padding: 20px;
}
</style>