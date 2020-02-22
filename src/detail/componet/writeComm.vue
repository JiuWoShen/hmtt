<template>
  <div class="write">
    <van-search v-model="value" background='#ccc' placeholder="请输入搜索关键词" action-text='发送' show-action @search="onSearch">
      <template slot="left-icon">
        <van-icon name="edit" />
      </template>
    </van-search>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onSearch () {
    }
  }
}
</script>

<style lang='less' scoped>
.write{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  //  发送背景色
  .van-search__action:active{
    background-color: #ccc;
    color: #cc5;
  }
}
</style>
