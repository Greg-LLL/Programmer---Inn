<template>
  <div class="search-history">
      <van-cell title="搜索历史">
          <div v-if="isDeleteShow">
          <span @click='$emit("clearSearchHistory",[])'>全部删除</span>
          &nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
          </div>
          <van-icon 
          v-else 
          name="delete-o"
          @click="isDeleteShow = true"
           />
      </van-cell>
      <van-cell 
        v-for="(item,index) in searchHistory"
        :key="index"
        :title="item"
        @click="onSearchItemClick(item,index)"
        >
          <van-icon 
            v-show="isDeleteShow"
            name="close"/>
      </van-cell>

  </div>
</template>

<script>

export default {
    name:'SearchHostory',
    props:{
        // prop 数据
        //      如果是普通数据(数字,字符串,布尔值)绝对不能修改
        //      即便修改了也不会传导给父组件
        // 
        //      如果是引用类型数据(数组,对象)
        //      可以修改,例如[].push
        //      不能重新赋值,例如xxx = []
        searchHistory:{
            type:Array,
            required:true
        }
    },
    data(){
        return {
        isDeleteShow:false,//控制删除显示状态
        }

    },
    methods:{
       onSearchItemClick(item,index){
           if(this.isDeleteShow){
               // 删除状态,删除某个历史记录   
               this.searchHistory.splice(index,1)
           } else {
               //非删除状态,直接进入搜索
               this.$emit('search',item)    
           }
       }
    },
    
}
</script>

<style>

</style>