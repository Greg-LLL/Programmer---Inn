<template>
  <div class="chennel-edit">
    <!-- 我的频道 -->
    <van-cell :border='false'>
        <div slot="title" class="title-text">我的频道</div>
        <van-button 
        type="danger" 
        plain 
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid
        class="my-grid" 
        :gutter="10">

        <van-grid-item
        @click="onMyChannelClick(channel,index)"
        class="grid-item" 
        v-for="(channel,index) in myChannels" 
        :key="index" 
        > 
        <van-icon 
        v-show="isEdit && !fiexdChannels.includes(channel.id)"
        slot="icon" 
        name="clear"
        ></van-icon>
        <span 
        class="text" 
        slot="text"
        :class="{ active:index === active}"
        >
        {{channel.name}}</span>
        </van-grid-item>
    </van-grid>
    <!-- 我的频道 -->

    <!-- 频道推荐 -->
     <van-cell :border='false'>
        <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
        <van-grid-item 
        @click="onAddChannel(channel)"
        class="grid-item"
        icon="plus"
        v-for="(channel,index) in recommendChannels" 
        :key="index" 
        :text="channel.name" />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>

import  { 
    getAllChannels,
    addUserChannel,
    deleteUserChannel 
}  from '@/api/chennel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'

export default {
    name:'ChennelEdit',
    data() {
        return {
            allChannels:[],
            isEdit:false, //控制关闭图标的显示
            fiexdChannels:[0] //固定频道，不允许删除
        }
    },
    props:{
        myChannels:{
            type:Array,
            required:true,
        },
        active:{
            type:Number,
            required:true
        }
    },
    computed:{
    //     recommendChannels () {
    //         const channels = []
    //         this.allChannels.forEach(channel => {
    //             const ret =  this.myChannels.find(myChannel => {
    //                 return myChannel.id === channel.id
    //             })
    //             if(!ret) {
    //                 channels.push(channel)
    //             }
    //         })
    //         return channels
    //     }
    // },
    ...mapState(['user']),
     recommendChannels () {
         return this.allChannels.filter(channel => {
             return !this.myChannels.find(myChannels => {
                 return myChannels.id === channel.id
             }
             )
         })
        }
    },
    created () {
        this.loadAllChannels()
    },
    methods:{
        async loadAllChannels(){
            try {
                const { data } = await getAllChannels()
                this.allChannels = data.data.channels
            } catch (error) {
                this.$toast('数据获取失败')
            }
        },
        async onAddChannel(channel){
            this.myChannels.push(channel)
            // 数据持久化处理
            if(this.user){
                try {
                // 已登录,把数据请求接口放到线上
                    await addUserChannel({
                        id:channel.id,
                        seq:this.myChannels.length
                })
                } catch (error) {
                    this.$toast('保存失败,请稍后重试')
                }
            }else {
            // 未登录,把数据存储到本地
                setItem('TOUTIAO_CHANNELS',this.myChannels)
            }


        },
        async deleteChannel(channel){
            try {
                if(this.user){
                // 已登录，将数据更新到线上
                await deleteUserChannel(channel.id)
            } else {
                // 未登录，将数据更新到本地
                setItem('TOUTIAO_CHANNELS',this.myChannels)
            }
            } catch (error) {
                this.$toast('操作失败，请稍后重试')
            }
            
        },
        onMyChannelClick(channel,index){
            // 如果是编辑状态，执行删除频道
            // 非编辑状态，则执行切换频道
            if(this.isEdit){
                // 判断是否为固定频道，如果是固定频道则不删
                if(this.fiexdChannels.includes(channel.id)){
                    return
                }
                this.myChannels.splice(index,1)
                // 参数1：要删除的开始元素索引（包括该索引）
                // 参数2：要删除的元素个数,如果不指定，则从元素1一直删到最后
                if(index <= this.active){
                    this.$emit('update-active',this.active -1,true)
                }
                // 处理持久化
                this.deleteChannel(channel)
            } else {
                this.$emit('update-active',index,false)
            }
           
        }
    }
}

</script>

<style lang="less" scoped>
.chennel-edit {
    padding: 85px 0;

    .title-text{
        font-size: 32px;
        color: #333333;
    }
    .edit-btn {
        width: 104px;
        height: 48px;
        font-size: 26px;
        color:#f85959;
        border: 1px solid #f85959;
    }

    /deep/.grid-item {
        width: 160px;
        height: 86px;
        .van-grid-item__content{
            white-space: nowrap;
            background-color: #f4f5f6;
            .van-grid-item__text,.text {
                font-size: 28px;
                color:#222;
                margin-top: 0;
            }
            .active {
                color: red;
            }
            .van-grid-item__icon-wrapper{
                position: unset;
            }
        }
    }

    /deep/ .my-grid {
        .grid-item {
            .van-icon-clear {
                position: absolute;
                right: -10px;
                top: -10px;
                font-size: 30px;
                color: #cacaca;
                z-index: 2;
            }
        }
    }

    /deep/.recommend-grid{
        .grid-item {
            .van-grid-item__content {
                flex-direction: row;
                .van-icon-plus {
                    font-size: 28px;
                    margin-right: 6px;
                }
            }
        }
    }
}
</style>