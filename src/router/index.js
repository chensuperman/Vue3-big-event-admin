import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
//  createRouter 创建路由实例
//  配置history的模式
//  1.history模式：createWebHistory   地址栏不带"#"
//  2.hash模式：createHashHistory     地址栏带"#"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

//登录访问拦截器 => 默认直接放行
//根据返回值决定是否拦截
router.beforeEach((to) => {
  //如果没有token，且访问的是非登录页，就拦截到登录页,其他正常放行
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})

export default router
