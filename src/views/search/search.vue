<template>
  <div class="search">
    <!-- -----------------------------------------------与data中的value值双向绑定 -->
    <van-search background='rgb(49, 148, 255)' @input="search" v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch">
      <template slot="action">
        <!-- 将取消事件绑定至取消的点击事件 -->
        <div class="cancel" @click="onCancel">取消</div>
      </template>
    </van-search>
    <!-- 搜索联想区域 -->
    <van-cell-group v-if="thinkList.length > 0">
      <!-- 联想的每一项也应有点击事件------作为参数传递的以源数据传递无需样式 -->
      <van-cell @click="onSearch(item.olditem)" icon="search" v-for="(item,index) in thinkList" :key="index">
        <template slot="title">
          <!-- 解析拼接关键字高亮的标签---v-html -->
          <div v-html="item.newItem"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template slot="default">
          <van-icon name="delete" @click="clearHis"/>
        </template>
      </van-cell>
      <van-cell @click="onSearch(item)" icon="search" v-for="(item, index) in historyList" :key="index" :title="item">
        <template slot="right-icon">
          <!-- 注意应该阻止事件冒泡至父组件的点击事件 -->
          <van-icon name="cross" @click.stop="deletHis(item)"/>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { thinkSearch } from '../../api/search.js'
import { setLocal, getLocal } from '../../utils/mylocal.js'
export default {
  data () {
    return {
      // 搜索输入框的内容
      value: '',
      // 联想搜索的结果数组
      thinkList: [],
      // 搜索历史
      historyList: [],
      // 定义一个空的定时器
      timer: null
    }
  },
  methods: {
    onSearch (key) {
      // 为空则不执行
      if (key.trim().length <= 0) {
        return
      }
      // 搜索事件---将搜索记录保存至本地-----最近搜索数据保存到最前面---------去重-----保存至本地
      // window.console.log(typeof this.historyList)
      this.historyList.unshift(key)
      this.historyList = [...new Set(this.historyList)]
      setLocal('history', this.historyList)
      // 联想的每项的点击事件以及搜索输入完成后点击回车触发的事件----跳转到搜索结果页面
      this.$router.push(`/searchResult/${key}`)
    },
    onCancel () {
      // 清空搜索框与联想
      this.value = ''
      this.thinkList = []
    },
    // 搜索联想输入发送请求
    search () {
      clearTimeout(this.timer)
      // 判断搜索内容是否为空-----清空联想数组---------节流解决持续发送请求至服务器的问题
      this.timer = setTimeout(async () => {
        if (this.value.length <= 0) {
          this.thinkList = []
          return
        }
        // -----------将搜索输入的关键字作为参数发送请求
        let res = await thinkSearch(this.value)
        window.console.log(res)
        // 关键字高亮
        this.thinkList = res.data.data.options.map(item => {
          return {
            // 传递参数以原数据传递
            olditem: item,
            // ------------------------------通过关键字切割，改变样式后在进行拼接
            newItem: item.split(this.value).join(`<span style="color: red">${this.value}</span>`)
          }
        })
        window.console.log(this.thinkList)
      }, 500)
    },
    // 删除历史数据
    deletHis (item) {
      // 从历史数据中将点击的项删除---传参遍历
      this.historyList.forEach((hitem, index) => {
        if (item === hitem) {
          this.historyList.splice(index, 1)
        }
      })
      // 将操作保存至本地
      setLocal('history', this.historyList)
    },
    // 清空历史数据
    clearHis () {
      // 询问用户是否清空
      this.$dialog.confirm({
        title: '警告',
        message: '确认清空历史数据吗？'
      }).then(() => {
        // 用户确认删除
        this.historyList = []
        // 保存清空操作
        setLocal('history', this.historyList)
      }).catch(() => {
        // 用户取消删除
        window.console.log('取消清空')
      })
    }
  },
  async created () {
    // 一进页面就渲染搜索历史记录-----不能在这里设置本地数据
    // let res = await getHistory()
    // // window.console.log(res)
    // setLocal('history', res.data.data.keywords)

    // ------短路运算符
    this.historyList = getLocal('history') || []
    // window.console.log(typeof this.historyList)
  }
}
</script>

<style lang='less'>
.search{
  .cancel{
    color: white;
  }
  .cancel:active{
    color: #ccc;
  }
  .van-search__action:active{
    background-color: rgb(49, 148, 255);
  }
}
</style>
