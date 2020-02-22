<template>
  <div class="result">
    <!-- 头部 -->
    <van-nav-bar left-arrow @click-left="back" class="headerBar" fixed>
      <template slot="title">
        <div class="title">搜索结果</div>
      </template>
    </van-nav-bar>
    <!-- 文章主体部分渲染------下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 上拉加载更多 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
        <van-cell v-for="(item,index) in searchResult" :key='index'>
          <template slot="title">
            <h3 @click="detail(item.art_id)">{{item.title}}</h3>
            <!-- 图片 -->
            <van-grid v-if="item.cover.type > 0" :border="false" :column-num="3">
              <van-grid-item v-for="(imgItem,imgIndex) in item.cover.images" :key="imgIndex">
                <van-image :src="imgItem" />
              </van-grid-item>
            </van-grid>
            <div class="authorMess">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <!-- 全局时间过滤器处理时间 -->
              <span>{{item.pubdate | timefilter}}</span>
            </div>
            <van-grid :column-num="3">
              <van-grid-item @click="comment" icon="comment-o" text="评论" />
              <van-grid-item @click="zan" icon="like-o" text="点赞" />
              <van-grid-item @click="share" icon="share" text="分享" />
            </van-grid>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getSearchResult } from '../../api/search.js'
export default {
  data () {
    return {
      // 下拉刷新状态
      isLoading: false,
      // 上拉加载状态
      loading: false,
      finished: false,
      // 加载的数据源
      list: [],
      // 动态路由传递的参数
      key: '',
      // 搜索结果页面
      // 默认显示点击页
      page: 0,
      // 每页显示几条
      perpage: 10,
      searchResult: []
    }
  },
  methods: {
    // 点击返回上一级
    back () {
      this.$router.back()
    },
    // 下拉刷新
    onRefresh () {
    },
    async onLoad () {
      this.page = this.page + 1
      // 请求搜索详情
      let res = await getSearchResult({
        page: this.page,
        perpage: this.perpage,
        q: this.key
      })
      window.console.log(res)
      // 数据进行拼接--------原有数据应新数据之前拼接
      this.searchResult = [...this.searchResult, ...res.data.data.results]
      // 没有数据停止加载状态
      if (res.data.data.results.length <= 0) {
        this.finished = true
      }
      this.loading = false
    },
    // 评论进行登录判断
    comment () {
      // 判断用户是否登录-----未登录进行跳转，登录进行评论
      if (!this.$store.state.user.token) {
        this.$router.push('/login')
        return
      }
      window.console.log('进行了评论')
    },
    // 点赞-----在main.js中封装  登录验证  的全局方法-------这样会破坏main.js的独立性
    zan () {
      // 登录验证----使用全局登录验证方法
      if (this.$login() === false) {
        return
      }
      window.console.log('点赞')
    },
    // 分享
    share () {
      // 登录验证封装为一个插件
      if (this.$login() === false) {
        return
      }
      window.console.log('分享')
    },
    // 点击进入文章详情页-----携带文章ID
    detail (artId) {
      this.$router.push(`/detail/${artId}`)
    }
  },
  created () {
    // 接收动态路由传过来的关键字
    this.key = this.$route.params.key
    window.console.log(this.key)
  }
}
</script>

<style lang='less'>
.result{
  margin-top: 46px;
  // 头部导航栏
  .headerBar{
    background-color:  rgb(25, 137, 250);
    .title{
      color: white;
    }
  }
  // 左侧箭头颜色
  .van-nav-bar .van-icon{
    color: white;
  }
  .authorMess{
    span{
      margin-right: 10px;
    }
  }
  .van-grid-item__content{
    flex-direction: row;
  }
  .van-grid-item__icon{
    font-size: 16px;
  }
  .van-grid-item__icon + .van-grid-item__text{
    margin-top: 0;
    margin-left: 6px;
  }
}

</style>
