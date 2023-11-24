<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import channelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article.js'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const articleList = ref([]) //文章列表
const total = ref(0) //总条数
//请求参数对象
const params = ref({
  pagenum: 1, //当前页
  pagesize: 5, //当前生效的每页条数
  cate_id: '',
  state: ''
})

//基于params参数，获取文章列表
const getArticleList = async () => {
  const res = await artGetListService(params.value)
  // console.log(res)
  articleList.value = res.data.data
  total.value = res.data.total
}
//直接调用
getArticleList()

//处理分页的逻辑
const onSizeChange = (size) => {
  // console.log(size)
  //每页条数变化，从第一页开始重新渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  //基于最新的size进行渲染
  getArticleList()
}
const onCurrentChange = (page) => {
  console.log(page)
  //当前页变化时，基于当前页进行渲染
  params.value.pagenum = page
  getArticleList()
}

//搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1 //重置页面
  getArticleList()
}
//重置逻辑 => 将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1 //重置页面
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()
//通过调用子组件向外暴露的方法实现
//添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
//编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

//删除逻辑
const onDelArticle = async (row) => {
  // console.log(row)
  //提示用户是否要删除
  await ElMessageBox.confirm('此操作将永久删除该文章，是否继续？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  //重新渲染列表
  getArticleList()
}

//添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    //如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  //如果是编辑，直接渲染当前页
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form :inline="true" style="width: 100%">
      <el-form-item label="文章分类：">
        <!-- vue2 => v-model:value 和 @input 的简写 -->
        <!-- vue3 => v-model:modeValue 和 @update:modelValue的简写 -->
        <channel-select v-model:modelValue="params.cate_id"></channel-select>

        <!-- vue3 => v-model:cid  :cid 和 @update:cid 的简写 -->
        <!-- <channel-select v-model:cid="params.cate_id"></channel-select> -->
      </el-form-item>
      <el-form-item label="发布状态：">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布/草稿 -->
        <el-select placeholder="请选择" v-model="params.state">
          <!-- label展示给用户看， value收集起来提交给后台 -->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList">
      <template #empty>
        <el-empty description="无数据" />
      </template>
      <el-table-column label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"> </el-table-column>
      <el-table-column label="发表日期" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"> </el-table-column>
      <el-table-column label="操作">
        <!-- 利用作用域插槽 row 可以获取当前点击的数据 => v-for 遍历 item -->
        <template #default="{ row }">
          <el-button
            @click="onEditArticle(row)"
            circle
            plain
            type="primary"
            :icon="Edit"
          ></el-button>
          <el-button
            @click="onDelArticle(row)"
            circle
            plain
            type="danger"
            :icon="Delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next "
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加文章-抽屉 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
