<template>
    <div class="quill-container">
      <QuillEditor
        ref="quillRef"
        theme="snow"
        v-model:content="content"
        :options="editorOptions"
        contentType="html"
        style="min-height: 300px"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { QuillEditor } from '@vueup/vue-quill'
  import { ref, watch, nextTick } from 'vue'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  
  const props = defineProps({
    content: {
      type: String,
      default: ''
    },

    minHeight: {
      type: String,
      default: '400px'
    },
  })
  
  const emit = defineEmits(['update:content']);
  
  // 编辑器实例引用
  const quillRef = ref<InstanceType<typeof QuillEditor> | null>(null)
  
  // 编辑器配置
  const editorOptions = ref({
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: () => handleImageUpload()
        }
      }
    },
    placeholder: '请输入内容...'
  })
  
  // 处理图片上传
  const handleImageUpload = () => {
    // 创建临时文件输入
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.style.display = 'none'
    
    // 事件处理
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement)?.files?.[0]
      if (!file) return
  
      try {
        const quill = quillRef.value?.getQuill() as any;
        const range = quill?.getSelection()
        if (!range) return
  
        // 插入占位符
        quill.insertEmbed(range.index, 'image', 'loading.gif')
        
        // 上传逻辑（替换为实际API）
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('/api/upload', { method: 'POST', body: formData })
        const { url } = await response.json()
  
        // 替换真实图片
        quill.deleteText(range.index, 1)
        quill.insertEmbed(range.index, 'image', url)
        quill.setSelection(range.index + 1)
      } catch (err) {
        console.error('上传失败:', err)
      } finally {
        input.remove()
      }
    }
  
    // 添加到对话框内容区域
    const dialogBody = document.querySelector('.el-dialog__body')
    if (dialogBody) {
      dialogBody.appendChild(input)
      input.click()
    } else {
      document.body.appendChild(input)
      input.click()
      setTimeout(() => input.remove(), 1000)
    }
  }
  
  // 内容双向绑定
  const content = ref(props.content)
  watch(content, (val) => {
    emit('update:content', val)
  })
  </script>
  <style scoped>
  .quill-container {
      :deep(.ql-container) {
          min-height: v-bind("props.minHeight");
          border-radius: 0 0 8px 8px;
          font-family: inherit;
      }
  
      :deep(.ql-toolbar) {
          border-radius: 8px 8px 0 0;
          background-color: #f8f9fa;
      }
  
      :deep(.ql-editor) {
          min-height: v-bind("props.minHeight");
          line-height: 1.6;
          font-size: 16px;
  
          img {
              max-width: 100%;
              height: auto;
              vertical-align: middle;
          }
      }
  }
  </style>