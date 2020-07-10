<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/leases' }">借阅信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加借阅信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加借阅信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="借阅学生"></el-step>
        <el-step title="借阅书籍"></el-step>
        <el-step title="借阅日期"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="借阅学生" name="0">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
              <el-col :span="3">
                <el-select v-model="queryStudentInfo.queryType" placeholder="请选择">
                  <el-option v-for="item in queryStudentTypeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-input v-model="queryStudentInfo.query" clearable @clear="getStudentList" placeholder="请输入内容">
                  <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <!-- 学生列表区域 -->
            <el-table :data="studentlist" border stripe highlight-current-row @current-change="selectStudent" class="select-table">
              <el-table-column label="" width="35px">
                <template v-slot="{ row: student }">
                  <el-radio v-model="addForm.stuId" :label="student.stuId"></el-radio>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="学号" prop="stuNum"></el-table-column>
              <el-table-column label="姓名" prop="stuName"></el-table-column>
              <el-table-column label="性别" prop="stuSex"></el-table-column>
              <el-table-column label="年龄" prop="stuAge"></el-table-column>
              <el-table-column label="专业" prop="stuDept"></el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleStudentSizeChange" @current-change="handleStudentCurrentChange" :current-page="queryStudentInfo.current" :page-sizes="[2, 5, 10, 20]" :page-size="queryStudentInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="studentTotal"></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="借阅书籍" name="1">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
              <el-col :span="3">
                <el-select v-model="queryBookInfo.queryType" placeholder="请选择">
                  <el-option
                    v-for="item in queryBookTypeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-input v-model="queryBookInfo.query" clearable @clear="getBookList" placeholder="请输入内容">
                  <el-button slot="append" icon="el-icon-search" @click="getBookList"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <!-- 书籍列表区域 -->
            <el-table ref="bookTable" :data="booklist" border stripe highlight-current-row @current-change="selectBook" class="select-table">
              <el-table-column label="" width="35px">
                <template v-slot="{ row: book }">
                  <el-radio v-model="addForm.bookId" :label="book.bookId" :disabled="book.bookTotal - book.bookLent <= 0"></el-radio>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="书名" prop="bookName"></el-table-column>
              <el-table-column label="作者" prop="bookAuthor"></el-table-column>
              <el-table-column label="分类">
                <template v-slot="{ row: book }">{{ book.catSymbol }} {{ book.catName }}</template>
              </el-table-column>
              <el-table-column label="可借" width="100px">
                <template v-slot="{ row: book }">
                  <el-tag type="danger" size="mini" v-if="book.bookTotal - book.bookLent <= 0">暂无</el-tag>
                  <span v-else>{{ book.bookTotal - book.bookLent }}</span>
                </template>
              </el-table-column>
              <el-table-column label="馆藏" prop="bookTotal" width="100px"></el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleBookSizeChange" @current-change="handleBookCurrentChange" :current-page="queryBookInfo.current" :page-sizes="[2, 5, 10, 20]" :page-size="queryBookInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="bookTotal"></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="借阅日期" name="2">
            <el-form-item label="借阅日期" prop="leaseDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="addForm.leaseDate" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="addLease">添加借阅信息</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加借阅信息的表单数据对象
      addForm: {
        stuId: '',
        bookId: '',
        leaseDate: ''
      },
      // 添加借阅信息表单的验证规则对象
      addFormRules: {
        leaseDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      // 获取学生列表的参数对象
      queryStudentInfo: {
        queryType: 0,
        query: '',
        current: 1,
        size: 5
      },
      // 获取学生列表时的查询条件
      queryStudentTypeList: [
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
          label: '专业'
        }
      ],
      // 查询得到的学生列表
      studentlist: [],
      // 数据库中总共有多少条学生数据
      studentTotal: 0,
      // 获取书籍列表的参数对象
      queryBookInfo: {
        queryType: 0,
        query: '',
        current: 1,
        size: 5
      },
      // 获取书籍列表时的查询条件
      queryBookTypeList: [
        {
          value: 0,
          label: '书名'
        },
        {
          value: 1,
          label: '作者'
        },
        {
          value: 2,
          label: '分类号'
        }
      ],
      // 查询得到的书籍列表
      booklist: [],
      // 数据库中总共有多少条书籍数据
      bookTotal: 0
    }
  },
  created () {
    this.getStudentList()
  },
  computed: {
    nowDate () {
      const now = new Date()
      return now.getFullYear() + '-' + ((now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) + '-' + now.getDate()
    }
  },
  methods: {
    // 获取学生列表
    async getStudentList () {
      const { data: res } = await this.$http.get('students', { params: this.queryStudentInfo })
      if (res.status !== 200) return this.$message.error(res.message)
      this.studentlist = res.data.students
      this.studentTotal = res.data.total
    },
    // 监听学生 pagesize 改变的事件
    handleStudentSizeChange (newSize) {
      this.queryStudentInfo.size = newSize
      this.getStudentList()
    },
    // 监听学生页码值改变的事件
    handleStudentCurrentChange (newCurrent) {
      this.queryStudentInfo.current = newCurrent
      this.getStudentList()
    },
    // 获取书籍列表
    async getBookList () {
      const { data: res } = await this.$http.get('books', { params: this.queryBookInfo })
      if (res.status !== 200) return this.$message.error(res.message)
      this.booklist = res.data.books
      this.bookTotal = res.data.total
    },
    // 监听书籍 pagesize 改变的事件
    handleBookSizeChange (newSize) {
      this.queryBookInfo.size = newSize
      this.getBookList()
    },
    // 监听书籍页码值改变的事件
    handleBookCurrentChange (newCurrent) {
      this.queryBookInfo.current = newCurrent
      this.getBookList()
    },
    // 选择学生
    selectStudent (currentRow) {
      this.addForm.stuId = currentRow.stuId
    },
    // 选择书籍
    selectBook (currentRow) {
      if (currentRow.bookTotal - currentRow.bookLent <= 0) {
        this.$refs.bookTable.setCurrentRow(null)
        this.$message.error('当前书籍暂无库存可借')
      } else {
        this.addForm.bookId = currentRow.bookId
      }
    },
    // 切换 tab 前的钩子
    beforeTabLeave (activeName, oldActiveName) {
      // 如果未选择学生，则阻止切换 tab
      if (oldActiveName === '0' && !this.addForm.stuId) {
        this.$message.error('请先选择借阅学生')
        return false
      }
      if (oldActiveName === '1' && activeName !== '0' && !this.addForm.bookId) {
        this.$message.error('请先选择借阅书籍')
        return false
      }
    },
    // tab 选中时的事件
    tabClicked () {
      // 如果访问的是借阅书籍面板，则获取书籍列表
      if (this.activeIndex === '1') this.getBookList()
      // 如果访问的是借阅时间面板，则设置默认借阅时间
      if (this.activeIndex === '2') this.addForm.leaseDate = this.nowDate
    },
    addLease () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid || !this.addForm.stuId || !this.addForm.bookId) return this.$message.error('请填写借阅信息')
        const { data: res } = await this.$http.post('lease', this.addForm)
        if (res.status !== 201) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 跳转回借阅信息管理页面
        this.$router.push('/leases')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
