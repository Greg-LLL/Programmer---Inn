import Vue from 'vue'
import Vuex from 'vuex'
import {setItem,getItem} from '@/utils/storage.js'
Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息(token等数据)
    user:getItem(TOKEN_KEY)
    // user:JSON.parse(window.localStorage.getItem(TOKEN_KEY))
  },
  mutations: {
    setUser (state,data){
      state.user = data;
      setItem(TOKEN_KEY,state.user)
      // window.localStorage.setItem(TOKEN_KEY,JSON.stringify(state.user))
    }
  },
  actions: {
  },
  modules: {
  }
})
