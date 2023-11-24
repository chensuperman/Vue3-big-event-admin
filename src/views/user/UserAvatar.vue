<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

//基于store的数据初始化imgUrl的初始值
const imageUrl = ref('')
const {
  user: { user_pic },
  getUser
} = useUserStore()
imageUrl.value = user_pic

const uploadRef = ref()

//实现前端的图片预览
const onSelectFile = (uploadFile) => {
  //1.基于FileReader 读取图片预览（该方法下的数据是base64格式字符串）
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imageUrl.value = reader.result
  }

  //2.基于URL,实现前端预览图片
  //创建URL
  //imageUrl.value = URL.createObjectURL(uploadFile.raw)
  //立刻将图片对象，存入formModel中
}

//更新头像逻辑
const onUpdateAvatar = async () => {
  //发送请求更新头像
  await userUpdateAvatarService(imageUrl.value)
  //userStore重新渲染
  await getUser()

  //提示用户
  ElMessage.success('头像更新成功')
}
</script>
<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">请选择图像</el-icon>
    </el-upload>
    <br />
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图像</el-button
    >
    <el-button
      @click="onUpdateAvatar"
      type="primary"
      :icon="Upload"
      size="large"
      >上传图像</el-button
    >
  </page-container>
</template>
<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font: caption;
      font-size: 28px;
      color: #d5d5d5;
      width: 278px;
      height: 278px;
      text-align: center;
      background-color: #efefef;
    }
    .el-icon.avatar-uploader-icon:hover {
      background-color: #f8f8f8;
      color: #757474;
    }
  }
}
</style>
