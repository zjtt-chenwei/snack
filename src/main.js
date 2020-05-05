// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import storage from '@/common/storage'
import localStorage from './common/localStorage'
import beginUser from './beginData/users.js'
import beginShop from './beginData/shops'
import beginOrder from './beginData/orders'
// import style
import 'view-design/dist/styles/iview.css'

Vue.use(ViewUI);
Vue.use(Vuex);
Vue.config.productionTip = false
Vue.prototype.$session = storage
Vue.prototype.$local = localStorage

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  created() {
    let users = localStorage.getStore("users")
    let shops = localStorage.getStore("shops")
    let orders = localStorage.getStore("orders")
    if (!users) {
      localStorage.setStore("users", JSON.stringify(beginUser))
    }
    if (!shops) {
      localStorage.setStore("shops", JSON.stringify(beginShop))
    } else {
      // 将shop中过期的商品改为审核不通过
      let shopList = JSON.parse(shops)
      shopList.forEach(item => {
        if (new Date().getTime() >= (item.productTime + item.storeTime * 24 * 60 * 60 * 1000)) {
          item.isSafe = false
          item.onlineState = 3
        }
      })
      localStorage.setStore("shops", JSON.stringify(shopList))
    }
    if (!orders) {
      localStorage.setStore("orders", JSON.stringify(beginOrder))
    }
    let resourcesAdmin = [
      {
        id: "0",
        title: "用户管理",
        name: "userManage",
        children: [
          {id: "0", name: "users", title: "用户管理"},
        ]
      },
      {
        id: "1",
        title: "商品管理",
        name: "shopManage",
        children: [
          {id: "0", name: "shopReview", title: "商品审核"},
        ]
      },
      {
        id: "2",
        title: "订单管理",
        name: "orderManage",
        children: [
          {id: "0", name: "orderReview", title: "订单审核"},
        ]
      }
    ]
    let resourcesCustom = [
      {
        id: "1",
        title: "卖家工作台",
        name: "businessWork",
        children: [
          {id: "0", name:'shopManage', title: "商品管理"},
          {id: "1", name:'orderManage', title: "订单管理"},
          // {id: "2", name: "个人设置"}
        ]
      }
    ]
    localStorage.setStore("resourcesAdmin", JSON.stringify(resourcesAdmin))
    localStorage.setStore("resourcesCustom", JSON.stringify(resourcesCustom))
  },
  template: '<App/>'
})
