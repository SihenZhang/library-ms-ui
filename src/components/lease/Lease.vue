<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>借阅信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="3">
            <el-select v-model="queryInfo.queryType" placeholder="请选择">
              <el-option
                v-for="item in queryTypeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <el-input v-model="queryInfo.query" clearable @clear="getLeaseList" placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search" @click="getLeaseList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="success" icon="el-icon-plus" @click="goAddPage">添加借阅信息</el-button>
          </el-col>
        </el-row>
        <!-- 借阅信息列表区域 -->
        <el-table :data="leaselist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="学号" prop="stuNum"></el-table-column>
          <el-table-column label="姓名" prop="stuName"></el-table-column>
          <el-table-column label="书名" prop="bookName"></el-table-column>
          <el-table-column label="状态">
            <template v-slot="{ row: lease }">
              <el-tag type="primary" v-if="!lease.returnDate">未归还</el-tag>
              <el-tag type="success" v-else-if="lease.returnDate">已归还</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="借阅日期" prop="leaseDate"></el-table-column>
          <el-table-column label="归还日期" prop="returnDate"></el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="{ row: lease }">
              <!-- 归还按钮 -->
                <el-tooltip effect="dark" content="确认归还书籍" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-check" size="mini" @click="showReturnBookDialog(lease.leaseId)"></el-button>
                </el-tooltip>
              <!-- 删除按钮 -->
                <el-tooltip effect="dark" content="删除借阅信息" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeLeaseById(lease.leaseId)"></el-button>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.current" :page-sizes="[2, 5, 10, 20]" :page-size="queryInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        <!-- 归还书籍的对话框 -->
        <el-dialog title="归还书籍" :visible.sync="returnBookDialogVisible" width="50%" @close="returnBookDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="returnBookForm" :rules="returnBookFormRules" ref="returnBookFormRef" label-width="80px">
            <el-form-item label="归还日期" prop="returnDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="returnBookForm.returnDate" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer">
            <el-button @click="returnBookDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="returnBook">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取借阅信息列表的参数对象
      queryInfo: {
        queryType: 0,
        query: '',
        current: 1,
        size: 5
      },
      // 获取借阅信息列表时的查询条件
      queryTypeList: [
        {
          value: 0,
          label: '学号'
        },
        {
          value: 1,
          label: '姓名'
        },
        {
          value: 2,
          label: '书名'
        }
      ],
      // 查询得到的借阅信息列表
      leaselist: [],
      // 数据库中总共有多少条数据
      total: 0,
      // 控制归还书籍对话框的显示与隐藏
      returnBookDialogVisible: false,
      // 归还书籍的信息
      returnBookForm: {
        leaseId: '',
        returnDate: ''
      },
      // 归还书籍表单的验证规则对象
      returnBookFormRules: {
        returnDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getLeaseList()
    this.returnBookForm.returnDate = this.nowDate
  },
  computed: {
    nowDate () {
      const now = new Date()
      return now.getFullYear() + '-' + ((now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) + '-' + now.getDate()
    }
  },
  methods: {
    async getLeaseList () {
      const { data: res } = await this.$http.get('leases', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error(res.message)
      this.leaselist = res.data.leases
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.getLeaseList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newCurrent) {
      this.queryInfo.current = newCurrent
      this.getLeaseList()
    },
    // 显示归还书籍的对话框
    showReturnBookDialog (id) {
      this.returnBookForm.leaseId = id
      this.returnBookDialogVisible = true
    },
    // 点击按钮，归还书籍
    returnBook () {
      this.$refs.returnBookFormRef.validate(async valid => {
        // 如果表单不合法，则拒绝提交
        if (!valid) return
        // 发送编辑学生的请求
        const { data: res } = await this.$http.put(`lease/${this.returnBookForm.leaseId}`, {
          returnDate: this.returnBookForm.returnDate
        })
        if (res.status !== 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 隐藏归还书籍的对话框
        this.returnBookDialogVisible = false
        // 重新获取借阅信息列表数据
        this.getLeaseList()
      })
    },
    // 监听归还书籍对话框的关闭事件
    returnBookDialogClosed () {
      this.$refs.returnBookFormRef.resetFields()
    },
    // 根据 id 删除对应的借阅信息
    async removeLeaseById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该借阅信息, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`lease/${id}`)
      if (res.status !== 200) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新获取借阅信息列表数据
      this.getLeaseList()
    },
    // 前往添加借阅信息的页面
    goAddPage () {
      this.$router.push('/leases/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
