<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书管理</el-breadcrumb-item>
      <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
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
            <el-input v-model="queryInfo.query" clearable @clear="getBookList" placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search" @click="getBookList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="success" icon="el-icon-plus" @click="showAddDialog">添加书籍</el-button>
          </el-col>
        </el-row>
        <!-- 书籍列表区域 -->
        <el-table :data="booklist" border stripe>
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
          <el-table-column label="操作" width="150px">
            <template v-slot="{ row : book }">
              <!-- 编辑按钮 -->
                <el-tooltip effect="dark" content="编辑书籍" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(book.bookId)"></el-button>
                </el-tooltip>
              <!-- 删除按钮 -->
                <el-tooltip effect="dark" content="删除书籍" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBookById(book.bookId)"></el-button>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.current" :page-sizes="[2, 5, 10, 20]" :page-size="queryInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        <!-- 添加书籍的对话框 -->
        <el-dialog title="添加书籍" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 添加书籍的表单 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="书名" prop="bookName">
              <el-input v-model="addForm.bookName"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="bookAuthor">
              <el-input v-model="addForm.bookAuthor"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-cascader v-model="selectedKey" :options="catelist" :show-all-levels="false" :props="cascaderProps" @change="addCateChange" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="馆藏" prop="bookTotal">
              <el-input-number v-model="addForm.bookTotal" :min="0" label="馆藏"></el-input-number>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addBook">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑书籍的对话框 -->
        <el-dialog title="编辑书籍" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <!-- 编辑书籍的表单 -->
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="书名" prop="bookName">
              <el-input v-model="editForm.bookName"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="bookAuthor">
              <el-input v-model="editForm.bookAuthor"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-cascader v-model="selectedKey" :options="catelist" :show-all-levels="false" :props="cascaderProps" @change="editCateChange" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="馆藏" prop="bookTotal">
              <el-input-number v-model="editForm.bookTotal" :min="editForm.bookLent" label="馆藏"></el-input-number>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editBook">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取书籍列表的参数对象
      queryInfo: {
        queryType: 0,
        query: '',
        current: 1,
        size: 5
      },
      // 获取书籍列表时的查询条件
      queryTypeList: [
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
      // 数据库中总共有多少条数据
      total: 0,
      // 控制添加书籍对话框的显示与隐藏
      addDialogVisible: false,
      // 添加书籍的表单数据
      addForm: {
        bookName: '',
        bookAuthor: '',
        catId: null,
        bookTotal: 0
      },
      // 添加表单的验证规则对象
      addFormRules: {
        bookName: [
          { required: true, message: '请输入书名', trigger: 'blur' }
        ],
        bookAuthor: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        bookTotal: [
          { required: true }
        ]
      },
      // 查询得到的分类列表
      catelist: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        // 为了修改书籍时可以直接使用分类 id 而不用查询其父级分类，设为 false 使选中的值不再是数组
        emitPath: false,
        value: 'catId',
        label: 'label',
        children: 'children'
      },
      // 选中的分类的 id
      selectedKey: null,
      // 控制编辑书籍对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑书籍的表单数据
      editForm: {},
      // 编辑表单的验证规则对象
      editFormRules: {
        bookName: [
          { required: true, message: '请输入书名', trigger: 'blur' }
        ],
        bookAuthor: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        bookTotal: [
          { required: true }
        ]
      }
    }
  },
  created () {
    this.getBookList()
  },
  methods: {
    // 获取书籍列表
    async getBookList () {
      const { data: res } = await this.$http.get('books', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error(res.message)
      this.booklist = res.data.books
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.getBookList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newCurrent) {
      this.queryInfo.current = newCurrent
      this.getBookList()
    },
    // 获取分类的数据列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.status !== 200) return this.$message.error(res.message)
      this.catelist = res.data.categories
      // 为分类列表新增 label 属性用于显示
      this.addLabelForCateList(this.catelist)
    },
    // 为分类列表新增 label 属性用于显示
    addLabelForCateList (catelist) {
      catelist.forEach(item => {
        item.label = item.catSymbol + ' ' + item.catName
        if (item.children) this.addLabelForCateList(item.children)
      })
    },
    // 显示添加书籍的对话框
    showAddDialog () {
      // 在显示添加书籍的对话框之前需要先获取分类的数据列表
      this.getCateList()
      this.addDialogVisible = true
    },
    // 选择项变化时触发的函数
    addCateChange () {
      if (this.selectedKey) this.addForm.catId = this.selectedKey
      else this.addForm.catId = null
    },
    // 点击按钮，添加新书籍
    addBook () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('book', this.addForm)
        if (res.status !== 201) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 隐藏添加书籍的对话框
        this.addDialogVisible = false
        // 重新获取书籍列表数据
        this.getBookList()
      })
    },
    // 监听添加书籍对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.selectedKey = null
      this.addForm.catId = null
    },
    // 显示编辑书籍的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`book/${id}`)
      if (res.status !== 200) return this.$message.error(res.message)
      this.editForm = res.data
      this.getCateList()
      this.selectedKey = this.editForm.catId
      this.editDialogVisible = true
    },
    // 选择项变化时触发的函数
    editCateChange () {
      if (this.selectedKey) this.editForm.catId = this.selectedKey
      else this.editForm.catId = null
    },
    // 点击按钮，编辑书籍
    editBook () {
      this.$refs.editFormRef.validate(async valid => {
        // 如果表单不合法，则拒绝提交
        if (!valid) return
        // 发送编辑书籍的请求
        const { data: res } = await this.$http.put(`book/${this.editForm.bookId}`, {
          bookName: this.editForm.bookName,
          bookAuthor: this.editForm.bookAuthor,
          catId: this.editForm.catId,
          bookTotal: this.editForm.bookTotal
        })
        if (res.status !== 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 隐藏编辑书籍的对话框
        this.editDialogVisible = false
        // 重新获取书籍列表数据
        this.getBookList()
      })
    },
    // 监听编辑书籍对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.selectedKey = null
    },
    // 根据 id 删除对应的书籍
    async removeBookById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该书籍, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`book/${id}`)
      if (res.status !== 200) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新获取书籍列表数据
      this.getBookList()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
