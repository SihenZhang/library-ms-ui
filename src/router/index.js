import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Index from '../components/Index.vue'
import User from '../components/user/User.vue'
import Category from '../components/book/Category.vue'
import Book from '../components/book/Book.vue'
import Student from '../components/student/Student.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录页',
    component: Login
  },
  {
    path: '/home',
    name: '主页',
    component: Home,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: '首页',
        component: Index
      },
      {
        path: '/users',
        name: '用户管理页',
        component: User
      },
      {
        path: '/categories',
        name: '分类管理页',
        component: Category
      },
      {
        path: '/books',
        name: '书籍管理页',
        component: Book
      },
      {
        path: '/students',
        name: '学生管理页',
        component: Student
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
