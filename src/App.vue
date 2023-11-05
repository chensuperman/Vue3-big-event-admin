<script setup>
//在Vue3 CompositionAPI中
//1.获取路由对象 router usePouter
//  const router=useRouter()
//2.获取路由参数 route useRouter
//  const router =useRoute()
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const goList = () => {
  router.push('/list')
  console.log(route)
}
</script>

<template>
  <div>我是App</div>
  <el-button @click="$router.push('/home')">跳首页</el-button>
  <el-button @click="goList">跳列表页</el-button>

  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
</template>

<style scoped></style>
