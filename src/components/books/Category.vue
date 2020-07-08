<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类区域 -->
      <el-row>
        <el-col>
          <el-button type="success" icon="el-icon-plus" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <el-table :data="catelist" row-key="catId" :tree-props="treeTableProps" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="分类号" prop="catSymbol" width="150px"></el-table-column>
        <el-table-column label="分类名称" prop="catName"></el-table-column>
        <el-table-column label="分类等级" width="150px">
          <template v-slot="{ row: category }">
            <el-tag type="primary" size="mini" v-if="category.catLevel === 0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="category.catLevel === 1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
            <template v-slot="{ row: category }">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(category.catId)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(category.catId)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.current" :page-sizes="[2, 5, 10, 20]" :page-size="queryInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      <!-- 添加分类的对话框 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 添加分类的表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="分类号" prop="catSymbol">
            <el-input v-model="addForm.catSymbol"></el-input>
          </el-form-item>
          <el-form-item label="分类名称" prop="catName">
            <el-input v-model="addForm.catName"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类的对话框 -->
      <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 添加分类的表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="分类号" prop="catSymbol">
            <el-input v-model="editForm.catSymbol"></el-input>
          </el-form-item>
          <el-form-item label="分类名称" prop="catName">
            <el-input v-model="editForm.catName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCategory">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取图书分类列表的参数对象
      queryInfo: {
        level: 3,
        // 当前的页数
        current: 1,
        // 当前每页显示多少条数据
        size: 5
      },
      // 查询得到的图书分类列表
      catelist: [],
      // 数据库中总共有多少条数据
      total: 0,
      // 指定树形表格的配置对象
      treeTableProps: { children: 'children' },
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      // 添加分类的表单数据
      addForm: {
        catSymbol: '',
        catName: '',
        // 父级分类 id，默认为空表示一级分类
        catPid: null,
        // 分类等级，默认为 0 表示一级分类
        catLevel: 0
      },
      // 添加表单的验证规则对象
      addFormRules: {
        catSymbol: [
          { required: true, message: '请输入分类号', trigger: 'blur' }
        ],
        catName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 查询得到的父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        // 允许选择任意一级的选项
        checkStrictly: true,
        value: 'catId',
        label: 'label',
        children: 'children'
      },
      // 选中的父级分类的 id 数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑分类的表单数据
      editForm: {},
      // 编辑表单的验证规则对象
      editFormRules: {
        catSymbol: [
          { required: true, message: '请输入分类号', trigger: 'blur' }
        ],
        catName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取图书分类
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error(res.message)
      this.catelist = res.data.categories
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.getCateList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newCurrent) {
      this.queryInfo.current = newCurrent
      this.getCateList()
    },
    // 显示添加分类的对话框
    showAddDialog () {
      // 在显示添加分类的对话框之前需要先获取父级分类的数据列表
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { level: 2 } })
      if (res.status !== 200) return this.$message.error(res.message)
      this.parentCateList = res.data.categories
      // 为父级分类列表新增 label 属性用于显示
      this.parentCateList.forEach(item => {
        item.label = item.catSymbol + ' ' + item.catName
        if (item.children) {
          item.children.forEach(childItem => {
            childItem.label = childItem.catSymbol + ' ' + childItem.catName
          })
        }
      })
    },
    // 选择项变化时触发的函数
    parentCateChange () {
      // 如果 selectedKeys 数组的 length 大于 0，证明选中了父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的 id 为数组中的最后一项
        this.addForm.catPid = this.selectedKeys[this.selectedKeys.length - 1]
        // 分类的等级与 selectedKeys 的长度一致
        this.addForm.catLevel = this.selectedKeys.length
      } else {
        this.addForm.catPid = null
        this.addForm.catLevel = 0
      }
    },
    // 点击按钮，添加新分类
    addCategory () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('category', this.addForm)
        if (res.status !== 201) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 隐藏添加分类的对话框
        this.addDialogVisible = false
        // 重新获取分类列表数据
        this.getCateList()
      })
    },
    // 监听添加分类对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.selectedKeys = []
      this.addForm.catPid = null
      this.addForm.catLevel = 0
    },
    // 显示编辑分类的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`category/${id}`)
      if (res.status !== 200) return this.$message.error(res.message)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听编辑分类对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，编辑分类
    editCategory () {
      this.$refs.editFormRef.validate(async valid => {
        // 如果表单不合法，则拒绝提交
        if (!valid) return
        // 发送编辑分类的请求
        const { data: res } = await this.$http.put(`category/${this.editForm.catId}`, {
          catSymbol: this.editForm.catSymbol,
          catName: this.editForm.catName
        })
        if (res.status !== 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 隐藏编辑分类的对话框
        this.editDialogVisible = false
        // 重新获取分类列表数据
        this.getCateList()
      })
    },
    // 根据 id 删除对应的分类
    async removeCateById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`category/${id}`)
      if (res.status !== 200) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新获取分类列表数据
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
