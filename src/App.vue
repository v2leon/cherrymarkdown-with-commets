<template>
  <div class="main-container">
    <!-- 头部菜单 -->
    <header class="header">
      <h1 style="flex: 1; font-size: 20px; color: #333;">Cherry Markdown Viewer</h1>
      <button class="menu-button" @click="showUrlModal = true">从URL导入</button>
      <button class="menu-button" @click="openLocalFile">打开本地文件</button>
      <input
        ref="fileInput"
        type="file"
        accept=".md,.markdown"
        class="file-input"
        @change="handleFileSelect"
      />
    </header>

    <!-- 主内容区域 -->
    <div class="content">
      <!-- Markdown预览区域 -->
      <div class="markdown-container">
        <div v-if="loading" class="loading">
          正在加载文档...
        </div>
        <div v-else-if="error" class="error">
          {{ error }}
        </div>
        <div v-else-if="!markdownContent" class="loading">
          请选择一个Markdown文件进行预览
        </div>
        <div v-else ref="cherryContainer" style="height: 100%;"></div>
      </div>

      <!-- 评论面板 -->
      <div class="comments-panel" v-if="comments.length > 0">
        <h3 style="margin-bottom: 16px; color: #333;">文档评论</h3>
        <div
          v-for="(comment, index) in comments"
          :key="index"
          class="comment-item"
        >
          <div class="comment-index">评论 #{{ index + 1 }}</div>
          <div class="comment-content">{{ comment }}</div>
        </div>
      </div>
    </div>

    <!-- URL导入模态框 -->
    <div v-if="showUrlModal" class="modal-overlay" @click="closeUrlModal">
      <div class="modal" @click.stop>
        <div class="modal-title">从URL导入Markdown文件</div>
        <input
          v-model="urlInput"
          type="text"
          placeholder="请输入Markdown文件的URL地址"
          class="modal-input"
          @keyup.enter="loadFromUrl"
        />
        <div class="modal-buttons">
          <button class="modal-button" @click="closeUrlModal">取消</button>
          <button class="modal-button primary" @click="loadFromUrl">导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import Cherry from 'cherry-markdown/dist/cherry-markdown.core'
import 'cherry-markdown/dist/cherry-markdown.css'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const markdownContent = ref('')
    const comments = ref([])
    const loading = ref(false)
    const error = ref('')
    const showUrlModal = ref(false)
    const urlInput = ref('')
    const fileInput = ref(null)
    const cherryContainer = ref(null)
    let cherryInstance = null

    // 解析评论
    const parseComments = (content) => {
      const commentRegex = /<!--\s*\[COMMENT\]\s*(.*?)\s*-->/g
      const foundComments = []
      let match

      while ((match = commentRegex.exec(content)) !== null) {
        foundComments.push(match[1].trim())
      }

      return foundComments
    }

    // 移除评论标记，返回纯净的markdown内容
    const removeComments = (content) => {
      return content.replace(/<!--\s*\[COMMENT\]\s*.*?\s*-->/g, '')
    }

    // 初始化Cherry编辑器
    const initCherry = async () => {
      if (!cherryContainer.value || !markdownContent.value) return

      // 销毁之前的实例
      if (cherryInstance) {
        cherryInstance.destroy()
      }

      await nextTick()

      try {
        cherryInstance = new Cherry({
          id: cherryContainer.value,
          value: removeComments(markdownContent.value),
          engine: {
            global: {
              urlProcessor(url, srcType) {
                return url
              }
            }
          },
          editor: {
            defaultModel: 'previewOnly'
          },
          previewer: {
            dom: false,
            className: 'cherry-markdown',
            enablePreviewerBubble: false
          },
          keydown: [],
          toolbar: {
            theme: 'light'
          }
        })
      } catch (err) {
        console.error('Cherry初始化失败:', err)
        error.value = 'Markdown渲染失败: ' + err.message
      }
    }

    // 处理markdown内容
    const processMarkdown = async (content) => {
      markdownContent.value = content
      comments.value = parseComments(content)
      await nextTick()
      await initCherry()
    }

    // 从URL加载文件
    const loadFromUrl = async () => {
      if (!urlInput.value.trim()) {
        alert('请输入有效的URL地址')
        return
      }

      loading.value = true
      error.value = ''
      showUrlModal.value = false

      try {
        const response = await axios.get(urlInput.value, {
          timeout: 10000,
          headers: {
            'Accept': 'text/plain, text/markdown, */*'
          }
        })

        await processMarkdown(response.data)
      } catch (err) {
        console.error('加载URL失败:', err)
        if (err.code === 'ECONNABORTED') {
          error.value = '请求超时，请检查网络连接或URL是否正确'
        } else if (err.response) {
          error.value = `加载失败: ${err.response.status} ${err.response.statusText}`
        } else {
          error.value = '加载失败: ' + err.message
        }
      } finally {
        loading.value = false
      }
    }

    // 打开本地文件
    const openLocalFile = () => {
      fileInput.value.click()
    }

    // 处理文件选择
    const handleFileSelect = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      if (!file.name.match(/\.(md|markdown)$/i)) {
        alert('请选择Markdown文件 (.md 或 .markdown)')
        return
      }

      loading.value = true
      error.value = ''

      try {
        const content = await readFileAsText(file)
        await processMarkdown(content)
      } catch (err) {
        console.error('读取文件失败:', err)
        error.value = '读取文件失败: ' + err.message
      } finally {
        loading.value = false
      }

      // 清空文件输入
      event.target.value = ''
    }

    // 读取文件内容
    const readFileAsText = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(new Error('文件读取失败'))
        reader.readAsText(file, 'UTF-8')
      })
    }

    // 关闭URL模态框
    const closeUrlModal = () => {
      showUrlModal.value = false
      urlInput.value = ''
    }

    // 组件挂载时加载默认文件
    onMounted(async () => {
      // 尝试加载欢迎文档
      try {
        const response = await fetch('./markdown_demo/welcome.md')
        if (response.ok) {
          const content = await response.text()
          await processMarkdown(content)
        }
      } catch (err) {
        console.log('未找到默认欢迎文档，等待用户选择文件')
      }
    })

    return {
      markdownContent,
      comments,
      loading,
      error,
      showUrlModal,
      urlInput,
      fileInput,
      cherryContainer,
      loadFromUrl,
      openLocalFile,
      handleFileSelect,
      closeUrlModal
    }
  }
}
</script> 