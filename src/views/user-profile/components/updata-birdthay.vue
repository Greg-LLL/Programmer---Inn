<template>
  <div class="updata-birthday">
    <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="$emit('close')"
        @confirm='onConfirm'
    />
  </div>
</template>

<script>
import {updataUserProfile} from '@/api/user'
import dayjs from 'dayjs'
export default {
name:'updataBirthday',
 data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  props:{
      value:{
          type:String,
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
                const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
                await updataUserProfile({
                    birthday:currentDate
                })
                // 更新视图
                this.$emit('input',currentDate)
                // 关闭弹层
                this.$emit('close')
                // 提示成功
                this.$toast.success('修改成功')
                
            } catch (error) {
                this.$toast.fail('修改失败')
                console.log(error);
            }
        }
  }
}
</script>

<style lang="less" scoped>

</style>