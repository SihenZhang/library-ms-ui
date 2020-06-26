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
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
