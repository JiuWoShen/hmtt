<template>
  <div>
    <van-dialog :value='value' :showConfirmButton="false">
      <van-cell-group v-if="isReport===false">
        <van-cell>
          <template>
            <van-icon @click="$emit('input',false)"  name="cross" />
          </template>
        </van-cell>
        <!-- 点击隐藏面板    删除文章 -->
        <van-cell icon='failure' @click="dislike" title="不感兴趣"></van-cell>
        <van-cell @click="isReport=true" icon='warning-o' title="反馈垃圾内容" is-link></van-cell>
        <van-cell icon='delete' title="拉黑作者"></van-cell>
      </van-cell-group>
      <van-cell-group v-if="isReport===true">
        <van-cell @click="isReport=false" icon='arrow-left'></van-cell>
        <!-- 遍历出的举报类型id -->
        <van-cell @click="report(item.id)" v-for="(item,index) in reportList" :key="index" :title="item.name"></van-cell>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { dislikeArt, reportArt } from '../../../api/articels.js'
export default {
  props: ['value', 'artId'],
  data () {
    return {
      reportList: [
        { id: 0, name: '其他问题' },
        { id: 1, name: '标题夸张' },
        { id: 2, name: '低俗色情' },
        { id: 3, name: '错别字多' },
        { id: 4, name: '旧闻重复' },
        { id: 5, name: '广告软文' },
        { id: 6, name: '内容不实' },
        { id: 7, name: '涉嫌违法犯罪' },
        { id: 8, name: '侵权' }
      ],
      // 是否显示拉黑内容
      isReport: false
    }
  },
  methods: {
    async dislike () {
      // 1.关闭面板
      this.$emit('input', false)
      // 2.删除文章------数据在父组件中，需要让父组件删除
      this.$emit('deleteArt')
      // 发送请求值服务器
      let res = await dislikeArt(this.artId)
      window.console.log(res)
    },
    async report (type) {
      try {
        await reportArt({
          // 请求名应该与api值参数相同
          id: this.artId,
          index: type
        })
        this.$toast.success('您的举报信息我们已经收集，将会在三个工作日内处理完毕')
      } catch {
        this.$toast.fail('已经举报过了')
      }
      // 关闭面板
      this.$emit('input', false)
      // 切换回三个基本操作面板
      this.isReport = false
    }
  }
}
</script>

<style>

</style>
