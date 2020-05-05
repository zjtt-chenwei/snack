import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../views/login.vue'], resolve)
    },
    {
      path: '/regist',
      name: 'regist',
      component: resolve => require(['../views/regist.vue'], resolve)
    },
    {
      path: '/main',
      name: 'main',
      component: resolve => require(['../views/main.vue'], resolve),
      children: [
        {
          path: '/users',
          name: 'users',
          component: resolve => require(['../views/admin/users.vue'], resolve)
        },
        {
          path: '/userReview',
          name: 'userReview',
          component: resolve => require(['../views/admin/userReview.vue'], resolve)
        },
        {
          path: '/examineSet',
          name: 'examineSet',
          component: resolve => require(['../views/admin/examineSet.vue'], resolve)
        },
        {
          path: '/shopReview',
          name: 'shopReview',
          component: resolve => require(['../views/admin/shopReview.vue'], resolve)
        },
        {
          path: '/shopManage',
          name: 'shopManage',
          component: resolve => require(['../views/business/shopManage.vue'], resolve)
        },
        {
          path: '/orderReview',
          name: 'orderReview',
          component: resolve => require(['../views/admin/orderReview.vue'], resolve)
        },
        {
          path: '/orderManage',
          name: 'orderManage',
          component: resolve => require(['../views/business/orderManage.vue'], resolve)
        }
      ]
    }
  ]
})
