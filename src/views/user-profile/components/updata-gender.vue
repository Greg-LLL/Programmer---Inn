<template>
  <div class="updata-gender">
    <van-picker
        title="性别"
        show-toolbar
        :columns="columns"
        :default-index="value"
        @cancel="$emit('close')"
        @confirm='onConfirm'
        @change="onPickerChange"
    />
  </div>
</template>

<script>
import {updataUserProfile} from '@/api/user'
export default {
    name:'updataGender',
    data() {
    return {
      columns: ['男', '女'],
      localGender:this.value
    };
  },
  props:{
      value:{
          type:Number,
          required:true
      }
  },
  methods:{
      async onConfirm(){
            this.$toast.loading({
                message:'保存中',
                forbidClick:true,//禁止背景点击
                duration:0 //持续展示
            })
            try {
                const localGender = this.localGender
                await updataUserProfile({
                    gender:localGender
                })
                // 更新视图
                this.$emit('input',localGender)
                // 关闭弹层
                this.$emit('close')
                // 提示成功
                this.$toast.success('修改成功')
                
            } catch (error) {
                this.$toast.fail('修改失败')
            }
        },
        onPickerChange(picker,value,index){
            this.localGender = index
        }
  }
}
</script>

<style lang="less" scoped>

</style>