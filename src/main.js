import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入自定义字体图标
import './assets/fonts/iconfont.css'

// 全局配置 axios，在组件内使用 this.$http 即可直接使用 axios
Vue.prototype.$http = axios
// 设置 axios 请求默认根路径
axios.defaults.baseURL = 'http://localhost:8090/api'
// axios 请求拦截器，在请求头中挂载 token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// axios 响应拦截器，判断 token 是否过期
axios.interceptors.response.use(response => {
  // 如果响应结果状态码为 401，代表 token 已过期
  if (response.data.status === 401) {
    // 清空 sessionStorage
    window.sessionStorage.clear()
    // 跳转至登录页面
    router.replace('login')
  }
  return response
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
