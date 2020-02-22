<template>
  <div class="layout">
      <!-- 路由出口 -->
    <router-view></router-view>
    <!-- 底部导航栏----作为各个频道的父组件 -->
    <!-- 注意：此组件需要开启   路由  router---- 及设置  to -->
    <van-tabbar route>
      <van-tabbar-item to="/home" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item to="/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item icon="tv-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="less">
.layout{
}
</style>
