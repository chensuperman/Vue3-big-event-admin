<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <!-- 只需要留一个路由接口即可 -->
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped></style>
