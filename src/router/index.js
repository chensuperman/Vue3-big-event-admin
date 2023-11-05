import { createRouter, createWebHistory } from 'vue-router'

//  createRouter 创建路由实例
//  配置history的模式
//  1.history模式：createWebHistory   地址栏不带"#"
//  2.hash模式：createHashHistory     地址栏带"#"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
