<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
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
            <el-input v-model="queryInfo.query" clearable @clear="getStudentList" placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="success" icon="el-icon-plus" @click="addDialogVisible = true">添加学生</el-button>
          </el-col>
        </el-row>
        <!-- 学生列表区域 -->
        <el-table :data="studentlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="学号" prop="stuNum"></el-table-column>
          <el-table-column label="姓名" prop="stuName"></el-table-column>
          <el-table-column label="性别" prop="stuSex"></el-table-column>
          <el-table-column label="年龄" prop="stuAge"></el-table-column>
          <el-table-column label="专业" prop="stuDept"></el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="{ row: student }">
              <!-- 编辑按钮 -->
                <el-tooltip effect="dark" content="编辑学生" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(student.stuId)"></el-button>
                </el-tooltip>
              <!-- 删除按钮 -->
                <el-tooltip effect="dark" content="删除学生" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeStudentById(student.stuId)"></el-button>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.current" :page-sizes="[2, 5, 10, 20]" :page-size="queryInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        <!-- 添加学生的对话框 -->
        <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="学号" prop="stuNum">
              <el-input v-model="addForm.stuNum"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="stuName">
              <el-input v-model="addForm.stuName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="stuSex">
              <el-radio-group v-model="addForm.stuSex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" prop="stuAge">
              <el-input v-model.number="addForm.stuAge"></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="stuDept">
              <el-input v-model="addForm.stuDept"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addStudent">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑学生的对话框 -->
        <el-dialog title="编辑学生" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="学号" prop="stuNum">
              <el-input v-model="editForm.stuNum"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="stuName">
              <el-input v-model="editForm.stuName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="stuSex">
              <el-radio-group v-model="editForm.stuSex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" prop="stuAge">
              <el-input v-model.number="editForm.stuAge"></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="stuDept">
              <el-input v-model="editForm.stuDept"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editStudent">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 验证学号的规则
    const checkStuNum = (rule, value, callback) => {
      if (!value || value === '') return callback()
      // 验证学号的正则表达式
      const regStuNum = /^[1-9][0-9]{11}$/
      // 合法的学号
      if (regStuNum.test(value)) return callback()
      callback(new Error('请输入12位有效数字学号'))
    }
    // 验证年龄的规则
    const checkAge = (rule, value, callback) => {
      if (!value) return callback()
      if (Number.isInteger(value)) return callback()
      callback(new Error('请输入合法的年龄'))
    }
    return {
      // 获取学生列表的参数对象
      queryInfo: {
        queryType: 0,
        query: '',
        current: 1,
        size: 5
      },
      // 获取学生列表时的查询条件
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
          label: '专业'
        }
      ],
      // 查询得到的学生列表
      studentlist: [],
      // 数据库中总共有多少条数据
      total: 0,
      // 控制添加书籍对话框的显示与隐藏
      addDialogVisible: false,
      // 添加书籍的表单数据
      addForm: {
        stuNum: '',
        stuName: '',
        stuSex: '',
        stuAge: '',
        stuDept: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        stuNum: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { validator: checkStuNum, trigger: 'blur' }
        ],
        stuName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        stuSex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        stuAge: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ],
        stuDept: [
          { required: true, message: '请输入专业', trigger: 'blur' }
        ]
      },
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 编辑表单的验证规则对象
      editFormRules: {
        stuNum: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { validator: checkStuNum, trigger: 'blur' }
        ],
        stuName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        stuSex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        stuAge: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ],
        stuDept: [
          { required: true, message: '请输入专业', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getStudentList()
  },
  methods: {
    // 获取学生列表
    async getStudentList () {
      const { data: res } = await this.$http.get('students', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error(res.message)
      this.studentlist = res.data.students
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.getStudentList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newCurrent) {
      this.queryInfo.current = newCurrent
      this.getStudentList()
    },
    // 点击按钮，添加新学生
    addStudent () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('student', this.addForm)
        if (res.status !== 201) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 隐藏添加学生的对话框
        this.addDialogVisible = false
        // 重新获取学生列表数据
        this.getStudentList()
      })
    },
    // 监听添加学生对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 显示编辑学生的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`student/${id}`)
      if (res.status !== 200) return this.$message.error(res.message)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击按钮，编辑学生
    editStudent () {
      this.$refs.editFormRef.validate(async valid => {
        // 如果表单不合法，则拒绝提交
        if (!valid) return
        // 发送编辑学生的请求
        const { data: res } = await this.$http.put(`student/${this.editForm.stuId}`, {
          stuNum: this.editForm.stuNum,
          stuName: this.editForm.stuName,
          stuSex: this.editForm.stuSex,
          stuAge: this.editForm.stuAge,
          stuDept: this.editForm.stuDept
        })
        if (res.status !== 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 隐藏编辑学生的对话框
        this.editDialogVisible = false
        // 重新获取学生列表数据
        this.getStudentList()
      })
    },
    // 监听编辑学生对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 根据 id 删除对应的学生
    async removeStudentById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该学生, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`student/${id}`)
      if (res.status !== 200) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新获取用户列表数据
      this.getStudentList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
