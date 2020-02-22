import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入子组件
import login from '../views/login/login.vue'
import home from '../views/home/Home.vue'
import my from '../views/my/my.vue'
import layout from '../views/layout/layout.vue'
// --------------若文件下只有index.vue 文件可只写文件夹名，会自动匹配index文件
import search from '../views/search/search.vue'
import searchResult from '../views/searchresult/searchResult.vue'
import artdetail from '../detail/artdetail.vue'
// const my = () => { '../views/my/my.vue' }
// const layout = () => { '../views/layout/layout.vue' }

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 登录
    {
      path: '/login',
      component: login
    },
    // 登录验证
    {
      path: '/checkLogin',
      component: login
    },
    {
      path: '/',
      // 重定向
      redirect: '/home'
    },
    {
      path: '/layout',
      component: layout,
      // 嵌套路由
      children: [
        {
          path: '/home',
          component: home
        },
        {
          path: '/my',
          component: my
        },
        {
          // 搜索路由
          path: '/search',
          component: search
        }
      ]
    },
    // 搜索结果
    {
      // 动态路由参数  ： 绑定
      path: '/searchResult/:key',
      component: searchResult
    },
    // 文章详情----跳转携带文章ID
    {
      path: '/detail/:artKey',
      component: artdetail
    }
  ]
})

export default router
