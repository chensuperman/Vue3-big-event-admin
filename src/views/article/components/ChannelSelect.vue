<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
</script>
<template>
  <el-select
    :style="{ width }"
    placeholder="请选择"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <!-- label展示给用户看， value收集起来提交给后台 -->
    <el-option
      v-for="channel in channelList"
      :label="channel.cate_name"
      :value="channel.id"
      :key="channel.id"
    ></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
