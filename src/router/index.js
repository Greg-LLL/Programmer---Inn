import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component: () => import('@/views/login')
  },
  {
    path:'/',
    name:'layout',
    component:() => import('@/views/layout'),
    redirect:'home',
    children:[   
      {
        path:'home',  //默认子路由
        name:'home',
        component:() => import('@/views/home')
      },
      {
        path:'qa',
        name:'qa',
        component:() => import('@/views/qa')
      },
      {
        path:'my',
        name:'my',
        component:() => import('@/views/my')
      }
    ]
  },
  {
    path:'/search',
    name:'search',
    component: () => import('@/views/search')
  },
  {
    path:'/article/:articleId',
    name:'article',
    component:() => import('@/views/article'),
    // 开启路由传参,说白了就是把路由参数映射到props组件中
    props:true
  }
]

const router = new VueRouter({
  routes
})

export default router
