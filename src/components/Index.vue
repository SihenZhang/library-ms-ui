<template>
  <div>
    <el-card>
      <h2>项目介绍</h2>
      <p>该项目是一个基于 Spring Boot 框架和 Vue.js 框架搭建的一个极简的、前后端分离的图书馆管理系统。</p>
      <p>该项目的主要目的是为了完成数据库原理的课程设计，因此该项目中所实现的功能并不是很多，很多功能甚至可以说是简陋（例如用户并不是基于 RBAC 模型的）。</p>
      <p>使用 Vue.js 框架的主要原因是想要学习 Vue，因此打算借此机会来学习一下 Vue。与此同时，这也是我对前后端分离项目开发的一次实验和一个验证我学习 Spring Boot 和 Mybatis（Mybatis Plus）成果的机会。</p>
      <h3>前端技术栈</h3>
      <el-tag type="primary">Vue.js 2.x</el-tag>
      <el-tooltip effect="dark" content="组件库，便于快速开发" placement="top">
        <el-tag type="primary">Element UI</el-tag>
      </el-tooltip>
      <el-tooltip effect="dark" content="对 ajax 请求进行封装" placement="top">
        <el-tag type="primary">Axios</el-tag>
      </el-tooltip>
      <h3>后端技术栈</h3>
      <el-tag type="success">Spring Boot 2.x</el-tag>
      <el-tooltip effect="dark" content="数据库连接及 CRUD 操作" placement="top">
        <el-tag type="success">Mybatis Plus</el-tag>
      </el-tooltip>
      <el-tooltip effect="dark" content="生成 token 完成身份验证" placement="top">
        <el-tag type="success">JWT</el-tag>
      </el-tooltip>
      <h3>项目仓库地址</h3>
      <a href="https://github.com/SihenZhang/library-ms-ui" target="_blank">
        <el-button type="primary">前端交互界面工程</el-button>
      </a>
      <a href="https://github.com/SihenZhang/library-ms-interface" target="_blank">
        <el-button type="success">后端接口工程</el-button>
      </a>
      <h2>进度</h2>
      <el-steps :space="300" :active="1" finish-status="success">
        <el-step title="完成登录功能" description="完成于 2020/6/25"></el-step>
        <el-step title="完成用户管理功能" description="2020/6/26 完成导航栏、用户管理界面"></el-step>
        <el-step title="完成图书管理功能" description="TBD"></el-step>
        <el-step title="完成学生管理功能" description="TBD"></el-step>
        <el-step title="完成借阅信息管理功能" description="TBD"></el-step>
      </el-steps>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  a + a {
    margin-left: 15px;
  }
</style>
