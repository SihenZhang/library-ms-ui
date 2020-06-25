<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
        <el-form-item>
          <h2 class="form-title">欢迎使用图书馆管理系统</h2>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock" placeholder="密码"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击登录按钮，先对表单进行预验证，
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // 如果表单不合法，则拒绝提交
        if (!valid) return
        // 发送post请求提交表单
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 如果状态码不等于 200，表示登录失败，输出错误信息
        if (res.code !== 200) return this.$message.error(res.message)
        // 将登录成功之后的 token 保存到客户端的 localStorage 中
        window.localStorage.setItem('token', res.data.token)
        // 输出登录成功的消息
        this.$message.success('登录成功')
        // 通过编程式导航跳转到后台主页
        this.$router.push('/home')
      })
    },
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #337ecc;
  }

  .login-box {
    position: relative;
    width: 90%;
    max-width: 450px;
    height: 330px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
  }

  .avatar-box {
    position: absolute;
    left: 50%;
    height: 120px;
    width: 120px;
    border: 1px solid #eee;
    padding: 10px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(221, 221, 221, .6);
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #f5f5f5;
    }
  }

  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .form-title {
    margin: 0;
    font-size: 24px;
    color: #505458;
    text-align: center;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
