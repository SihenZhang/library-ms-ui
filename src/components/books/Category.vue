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
          <el-button type="success" icon="el-icon-plus">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <el-table :data="catelist" row-key="catId" border stripe :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="分类编号" prop="catSymbol" width="150px"></el-table-column>
        <el-table-column label="分类名称" prop="catName"></el-table-column>
        <el-table-column label="排序" width="150px">
          <template v-slot="{ row: category }">
            <el-tag type="primary" size="mini" v-if="category.catLevel === 0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="category.catLevel === 1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
            <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.current" :page-sizes="[2, 5, 10, 20]" :page-size="queryInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取图书分类列表的参数对象
      queryInfo: {
        type: 3,
        // 当前的页数
        current: 1,
        // 当前每页显示多少条数据
        size: 5
      },
      // 查询得到的图书分类列表
      catelist: [],
      // 数据库中总共有多少条数据
      total: 0
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
