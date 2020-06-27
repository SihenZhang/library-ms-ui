<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/library.png" alt="">
        <h1>图书馆管理系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
      </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#f4f4f5" :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <template v-for="item in menulist">
            <!-- 若二级菜单不为空，则使用 submenu 渲染一级菜单 -->
            <el-submenu :index="item.path" v-if="item.children.length !== 0" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
                <i class="el-icon-menu"></i>
                <span>{{subItem.name}}</span>
              </el-menu-item>
            </el-submenu>
            <!-- 否则，若二级菜单为空，则使用 menu-item 渲染一级菜单 -->
            <el-menu-item :index="item.path" v-else :key="item.id" @click="saveNavState(item.path)">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 菜单数据
      menulist: [
        {
          id: 101,
          name: '图书管理',
          path: 'null',
          children: [
            {
              id: 102,
              name: '书籍管理',
              path: '/books',
              children: []
            },
            {
              id: 104,
              name: '分类管理',
              path: '/categorys',
              children: []
            }
          ]
        },
        {
          id: 111,
          name: '学生管理',
          path: '/students',
          children: []
        },
        {
          id: 121,
          name: '借阅信息管理',
          path: '/leases',
          children: []
        },
        {
          id: 131,
          name: '用户管理',
          path: '/users',
          children: []
        }
      ],
      // 一级菜单对应的图标类
      iconsObj: {
        101: 'el-icon-s-management',
        111: 'iconfont icon-student',
        121: 'el-icon-s-order',
        131: 'el-icon-user-solid'
      },
      // 菜单是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击退出按钮，完成退出登录操作
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮切换菜单的折叠状态
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    color: #fff;
    div {
      display: flex;
      align-items: center;
    }
    img {
      width: 40px;
      height: 40px;
      margin-right: 20px;
    }
  }

  .el-aside {
    background-color: #f4f4f5;
    .toggle-button {
      cursor: pointer;
      font-size: 10px;
      color: #fff;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.2em;
      background-color: #ccc;
    }
    .el-menu {
      border: 0;
    }
  }

  .el-main {
    background-color: #fff;
  }
</style>
