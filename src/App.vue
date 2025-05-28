<template>
  <div class="main-container">
    <!-- 侧边栏收起时的展开按钮 -->
    <button 
      v-if="!showSidebar" 
      class="sidebar-collapsed-toggle show" 
      @click="showSidebar = true"
      title="显示侧边栏"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
      </svg>
    </button>

    <!-- 评论展开按钮 (当评论面板关闭且有评论时显示) -->
    <button 
      v-if="comments.length > 0 && !showComments" 
      class="comments-toggle-button" 
      @click="showComments = true"
      title="显示评论"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/>
      </svg>
      <span class="comment-count">{{ comments.length }}</span>
    </button>

    <!-- 主内容区域 -->
    <div class="content-wrapper">
      <!-- 左侧边栏 -->
      <div class="sidebar" :class="{ collapsed: !showSidebar, show: showSidebar }">
        <!-- 侧边栏头部 - 菜单区域 -->
        <div class="sidebar-header">
          <div class="sidebar-title">
            <!-- 主菜单按钮 -->
            <div class="main-menu" @mouseenter="showMenuDropdown = true" @mouseleave="handleMenuLeave">
              <button class="main-menu-button" title="主菜单">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
                </svg>
              </button>
              
              <!-- 菜单浮层 -->
              <div v-if="showMenuDropdown" class="menu-dropdown" @mouseenter="clearMenuHideTimer" @mouseleave="showMenuDropdown = false">
                <!-- 主要功能菜单 -->
                <div class="menu-section">
                  <button class="menu-item" @click="showUrlModal = true; showMenuDropdown = false">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                    </svg>
                    从URL导入
                  </button>
                  
                  <button class="menu-item" @click="handleOpenLocalFile">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    打开本地文件
                  </button>
                  
                  <button class="menu-item" @click="showTestDocModal = true; showMenuDropdown = false">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    打开测试文档
                  </button>
                  
                  <button v-if="comments.length > 0" class="menu-item" @click="toggleComments; showMenuDropdown = false">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/>
                    </svg>
                    {{ showComments ? '隐藏评论' : '显示评论' }}
                  </button>
                </div>

                <!-- 最近文件区域 -->
                <div v-if="recentFiles.length > 0" class="recent-files-section">
                  <div class="recent-files-header">
                    <span class="recent-files-title">最近文件</span>
                    <button class="clear-recent-btn" @click="clearRecentFiles" title="清除记录">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="recent-files-list">
                    <div
                      v-for="(file, index) in recentFiles"
                      :key="index"
                      class="recent-file-item"
                      @click="loadRecentFile(file)"
                    >
                      <div class="recent-file-icon">
                        <svg v-if="file.type === 'url'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </svg>
                        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                      </div>
                      <div class="recent-file-info">
                        <div class="recent-file-name">{{ file.title }}</div>
                        <div class="recent-file-meta">
                          <span v-if="file.type === 'local' && file.size" class="file-size">{{ formatFileSize(file.size) }}</span>
                          <span class="file-time">{{ formatTime(file.accessTime) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button class="sidebar-toggle" @click="showSidebar = false" title="收起侧边栏">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 大纲区域 -->
        <div v-if="outline.length > 0" class="outline-section">
          <div class="outline-header">
            <h3>文档大纲</h3>
          </div>
          <div class="outline-content">
            <div
              v-for="(item, index) in outline"
              :key="index"
              class="outline-item"
              :class="[`level-${item.level}`, { active: activeOutlineIndex === index }]"
              @click="scrollToHeading(item, index)"
            >
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Markdown预览区域 -->
      <div class="markdown-container" :class="{ 'with-comments': showComments && comments.length > 0 }">
        <div class="markdown-content-wrapper">
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>正在加载文档...</p>
          </div>
          <div v-else-if="error" class="error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
            </svg>
            <p>{{ error }}</p>
          </div>
          <div v-else-if="!markdownContent" class="welcome">
            <div class="welcome-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <h2>欢迎使用 Cherry Markdown Viewer</h2>
              <p>请使用左侧菜单选择一个Markdown文件进行预览</p>
            </div>
          </div>
          <div v-else>
            <div ref="cherryContainer" id="cherry-container" class="cherry-wrapper"></div>
          </div>
        </div>
      </div>

      <!-- 评论面板 -->
      <div 
        v-if="comments.length > 0" 
        class="comments-panel" 
        :class="{ 'show': showComments }"
      >
        <div class="comments-header">
          <h3>文档评论</h3>
          <button class="close-comments" @click="showComments = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="comments-content">
          <div
            v-for="(comment, index) in comments"
            :key="index"
            class="comment-item"
            :class="{ active: activeCommentIndex === index }"
            @click="scrollToComment(index)"
          >
            <div class="comment-index">评论 #{{ index + 1 }}</div>
            <div class="comment-content">{{ comment.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- URL导入模态框 -->
    <div v-if="showUrlModal" class="modal-overlay" @click="closeUrlModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>从URL导入Markdown文件</h3>
          <button class="modal-close" @click="closeUrlModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <input
            v-model="urlInput"
            type="text"
            placeholder="请输入Markdown文件的URL地址"
            class="modal-input"
            @keyup.enter="loadFromUrl"
          />
          <div class="url-examples">
            <p class="modal-hint"><strong>支持的URL类型：</strong></p>
            <ul class="url-example-list">
              <li>GitHub Raw: <code>https://raw.githubusercontent.com/user/repo/main/file.md</code></li>
              <li>GitLab Raw: <code>https://gitlab.com/user/repo/-/raw/main/file.md</code></li>
              <li>公开的云存储链接（需支持CORS）</li>
            </ul>
            <p class="cors-notice">
              <strong>注意：</strong>如果遇到CORS跨域问题，系统会自动尝试使用代理服务。
              如果仍然失败，建议下载文件后使用"打开本地文件"功能。
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="closeUrlModal">取消</button>
          <button class="modal-button primary" @click="loadFromUrl">导入</button>
        </div>
      </div>
    </div>

    <!-- 测试文档选择模态框 -->
    <div v-if="showTestDocModal" class="modal-overlay" @click="closeTestDocModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>选择测试文档</h3>
          <button class="modal-close" @click="closeTestDocModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="test-doc-list">
            <div
              v-for="doc in testDocuments"
              :key="doc.name"
              class="test-doc-item"
              @click="loadTestDocument(doc.name)"
            >
              <div class="test-doc-title">{{ doc.title }}</div>
              <div class="test-doc-description">{{ doc.description }}</div>
              <div class="test-doc-filename">{{ doc.name }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="closeTestDocModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".md,.markdown"
      class="file-input"
      @change="handleFileSelect"
    />

    <!-- 文件上传浮层 -->
    <div v-if="showFileUploadModal" class="modal-overlay" @click="closeFileUploadModal">
      <div class="modal file-upload-modal" @click.stop>
        <div class="modal-header">
          <h3>上传Markdown文件</h3>
          <button class="modal-close" @click="closeFileUploadModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div 
            class="file-drop-zone"
            :class="{ 'drag-over': isDragOver }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            @click="triggerFileSelect"
          >
            <div class="drop-zone-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" class="upload-icon">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <h4>拖拽文件到此处</h4>
              <p>或点击选择Markdown文件</p>
              <div class="file-types">
                <span class="file-type">.md</span>
                <span class="file-type">.markdown</span>
              </div>
            </div>
          </div>
          <p class="upload-hint">支持的文件格式：Markdown (.md, .markdown)</p>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="closeFileUploadModal">取消</button>
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
    const showSidebar = ref(true)
    const showComments = ref(true)
    const showMenuDropdown = ref(false)
    const urlInput = ref('')
    const fileInput = ref(null)
    const cherryContainer = ref(null)
    const outline = ref([])
    const activeOutlineIndex = ref(null)
    const activeCommentIndex = ref(null)
    let cherryInstance = null
    let menuHideTimer = null

    // 测试文档列表
    const testDocuments = ref([
      { name: 'welcome.md', title: '欢迎文档', description: '应用介绍和基本功能说明' },
      { name: 'comment_test.md', title: '评论测试文档', description: '测试评论定位和高亮功能' },
      { name: 'scroll_test.md', title: '滚动测试文档', description: '测试大纲滚动和定位功能' }
    ])
    const showTestDocModal = ref(false)
    const showFileUploadModal = ref(false)
    const isDragOver = ref(false)
    const recentFiles = ref([])

    // 本地存储键名
    const RECENT_FILES_KEY = 'cherry-markdown-recent-files'

    // 加载最近文件记录
    const loadRecentFiles = () => {
      try {
        const stored = localStorage.getItem(RECENT_FILES_KEY)
        if (stored) {
          recentFiles.value = JSON.parse(stored)
          console.log('加载最近文件记录:', recentFiles.value.length, '个文件')
        }
      } catch (err) {
        console.warn('加载最近文件记录失败:', err)
        recentFiles.value = []
      }
    }

    // 保存最近文件记录
    const saveRecentFiles = () => {
      try {
        localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(recentFiles.value))
        console.log('保存最近文件记录:', recentFiles.value.length, '个文件')
      } catch (err) {
        console.warn('保存最近文件记录失败:', err)
      }
    }

    // 添加文件到最近记录
    const addToRecentFiles = (file) => {
      const now = new Date().toISOString()
      const newFile = {
        ...file,
        accessTime: now
      }

      // 移除重复项（基于URL或文件名）
      recentFiles.value = recentFiles.value.filter(item => {
        if (file.type === 'url' && item.type === 'url') {
          return item.url !== file.url
        } else if (file.type === 'local' && item.type === 'local') {
          return item.name !== file.name
        }
        return true
      })

      // 添加到开头
      recentFiles.value.unshift(newFile)

      // 保持最多5个
      if (recentFiles.value.length > 5) {
        recentFiles.value = recentFiles.value.slice(0, 5)
      }

      saveRecentFiles()
      console.log('添加到最近文件:', file)
    }

    // 解析评论
    const parseComments = (content) => {
      const commentRegex = /<!--\s*\[COMMENT\]\s*(.*?)\s*-->/g
      const foundComments = []
      let match

      while ((match = commentRegex.exec(content)) !== null) {
        const commentStart = match.index
        const commentEnd = match.index + match[0].length
        
        // 计算评论在原始内容中的行号
        const beforeContent = content.substring(0, commentStart)
        const lineNumber = beforeContent.split('\n').length
        
        // 获取评论所在行的内容
        const lines = content.split('\n')
        const commentLine = lines[lineNumber - 1] || ''
        
        // 判断评论是否独立成行（行内只有评论和空白字符）
        const isCommentOnlyLine = commentLine.trim() === match[0].trim()
        
        // 获取评论前后的文本内容（用于精确匹配）
        const beforeText = beforeContent.replace(/<!--\s*\[COMMENT\]\s*.*?\s*-->/g, '').trim()
        const afterText = content.substring(commentEnd).replace(/<!--\s*\[COMMENT\]\s*.*?\s*-->/g, '').trim()
        
        // 提取评论前后最近的文本段落
        const beforeParagraphs = beforeText.split(/\n\s*\n/).filter(p => p.trim())
        const afterParagraphs = afterText.split(/\n\s*\n/).filter(p => p.trim())
        
        const nearestBeforeText = beforeParagraphs.length > 0 ? beforeParagraphs[beforeParagraphs.length - 1].trim() : ''
        const nearestAfterText = afterParagraphs.length > 0 ? afterParagraphs[0].trim() : ''
        
        foundComments.push({ 
          text: match[1].trim(),
          position: commentStart,
          originalText: match[0],
          lineNumber: lineNumber,
          isCommentOnlyLine: isCommentOnlyLine,
          nearestBeforeText: nearestBeforeText,
          nearestAfterText: nearestAfterText,
          // 提取关键词用于匹配
          beforeKeywords: nearestBeforeText.match(/\w+/g) || [],
          afterKeywords: nearestAfterText.match(/\w+/g) || []
        })
      }

      return foundComments
    }

    // 解析大纲
    const parseOutline = (content) => {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm
      const foundHeadings = []
      let match

      while ((match = headingRegex.exec(content)) !== null) {
        foundHeadings.push({
          level: match[1].length,
          text: match[2].trim(),
          id: generateHeadingId(match[2].trim()),
          position: match.index
        })
      }

      return foundHeadings
    }

    // 生成标题ID
    const generateHeadingId = (text) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    // 移除评论标记，返回纯净的markdown内容
    const removeComments = (content) => {
      return content.replace(/<!--\s*\[COMMENT\]\s*.*?\s*-->/g, '')
    }

    // 初始化Cherry编辑器
    const initCherry = async () => {
      if (!cherryContainer.value || !markdownContent.value) {
        console.warn('Cherry初始化条件不满足:', {
          hasContainer: !!cherryContainer.value,
          hasContent: !!markdownContent.value
        })
        return
      }

      console.log('开始初始化Cherry编辑器...')

      // 销毁之前的实例
      if (cherryInstance) {
        try {
          cherryInstance.destroy()
          console.log('已销毁之前的Cherry实例')
        } catch (err) {
          console.warn('销毁Cherry实例时出错:', err)
        }
        cherryInstance = null
      }

      // 清空容器内容
      cherryContainer.value.innerHTML = ''

      await nextTick()

      try {
        const cleanContent = removeComments(markdownContent.value)
        console.log('准备渲染的内容长度:', cleanContent.length)

        cherryInstance = new Cherry({
          id: 'cherry-container',
          value: cleanContent,
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
          toolbars: {
            theme: 'light',
            showToolbar: false
          },
          // 确保是预览模式
          isPreviewOnly: true
        })

        console.log('Cherry实例创建成功')
        console.log('Cherry实例详情:', {
          hasInstance: !!cherryInstance,
          hasContainer: !!cherryContainer.value,
          containerContent: cherryContainer.value.innerHTML.length,
          instanceMethods: Object.keys(cherryInstance).slice(0, 10),
          containerElement: cherryContainer.value
        })

        // 检查 Cherry 是否正确绑定到容器
        await nextTick()
        console.log('Cherry 绑定检查:', {
          containerAfterInit: cherryContainer.value.innerHTML.length,
          containerChildren: cherryContainer.value.children.length,
          containerOuterHTML: cherryContainer.value.outerHTML.substring(0, 200)
        })

        // 等待Cherry完全渲染完成后添加标题ID
        setTimeout(() => {
          console.log('检查渲染结果:', {
            containerHTML: cherryContainer.value.innerHTML.length,
            hasContent: cherryContainer.value.innerHTML.length > 0,
            containerText: cherryContainer.value.textContent.substring(0, 100)
          })
          addHeadingIds()
        }, 300)
      } catch (err) {
        console.error('Cherry初始化失败:', err)
        error.value = 'Markdown渲染失败: ' + err.message
      }
    }

    // 为标题添加ID
    const addHeadingIds = (retryCount = 0) => {
      if (!cherryContainer.value) {
        console.warn('Cherry容器未找到，无法添加标题ID')
        return
      }

      const headings = cherryContainer.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
      console.log(`找到 ${headings.length} 个标题，大纲中有 ${outline.value.length} 项`)
      
      if (headings.length === 0 && outline.value.length > 0) {
        console.warn('未找到任何标题元素，可能Cherry还未完全渲染')
        
        // 增加重试机制，最多重试5次
        if (retryCount < 5) {
          const delay = Math.min(500 * (retryCount + 1), 2000) // 递增延迟，最大2秒
          console.log(`第 ${retryCount + 1} 次重试，延迟 ${delay}ms...`)
          setTimeout(() => {
            addHeadingIds(retryCount + 1)
          }, delay)
          return
        } else {
          console.warn('重试5次后仍未找到标题元素，可能文档没有标题或渲染失败')
          return
        }
      }
      
      // 如果没有大纲项，直接返回
      if (outline.value.length === 0) {
        console.log('文档没有标题，跳过ID设置')
        return
      }
      
      // 清除所有现有的标题ID
      headings.forEach(heading => {
        heading.removeAttribute('id')
        heading.removeAttribute('data-outline-index')
      })
      
      // 重新分配ID，确保一一对应
      let successCount = 0
      outline.value.forEach((item, index) => {
        if (headings[index]) {
          const heading = headings[index]
          const id = item.id
          heading.id = id
          heading.setAttribute('data-outline-index', index)
          heading.setAttribute('data-original-text', item.text)
          console.log(`标题 #${index + 1}: "${item.text}" -> ID: ${id}`, heading)
          successCount++
        } else {
          console.warn(`大纲项 #${index + 1} "${item.text}" 没有对应的标题元素`)
        }
      })
      
      // 验证ID是否正确设置
      setTimeout(() => {
        let verifiedCount = 0
        outline.value.forEach((item, index) => {
          const element = document.getElementById(item.id)
          if (element) {
            verifiedCount++
          } else {
            console.warn(`标题ID "${item.id}" 对应的元素未找到`)
          }
        })
        console.log(`标题ID设置完成: ${verifiedCount}/${outline.value.length} 成功`)
        
        // 只有在有大纲项但完全没有设置成功时才报错
        if (verifiedCount === 0 && outline.value.length > 0 && headings.length > 0) {
          console.error('所有标题ID设置失败，可能存在严重问题')
        } else if (verifiedCount < outline.value.length) {
          console.warn(`部分标题ID设置失败: ${verifiedCount}/${outline.value.length} 成功`)
        }
      }, 100)
    }

    // 处理markdown内容
    const processMarkdown = async (content) => {
      console.log('=== 开始处理Markdown内容 ===')
      console.log(`内容长度: ${content.length} 字符`)
      
      markdownContent.value = content
      comments.value = parseComments(content)
      outline.value = parseOutline(content)
      
      console.log(`解析完成: ${comments.value.length} 个评论, ${outline.value.length} 个标题`)
      
      // 如果有评论，自动显示评论面板
      if (comments.value.length > 0) {
        showComments.value = true
        console.log('自动显示评论面板')
      }
      
      await nextTick()
      
      // 如果 Cherry 实例已存在，使用官方 API 更新内容
      if (cherryInstance) {
        console.log('使用 Cherry API 更新现有实例内容...')
        try {
          const cleanContent = removeComments(content)
          console.log('准备更新的内容长度:', cleanContent.length)
          console.log('准备更新的内容预览:', cleanContent.substring(0, 100) + '...')
          
          // 根据官方文档，使用 setMarkdown 或 setValue 方法
          cherryInstance.setMarkdown(cleanContent, false)
          console.log('setMarkdown 调用成功')
          
          // 根据官方文档，调用 refreshPreviewer() 强制重新渲染预览区域
          cherryInstance.refreshPreviewer()
          console.log('refreshPreviewer 调用成功')
          
          // 检查渲染是否成功，如果失败则使用备用方案
          await nextTick()
          setTimeout(() => {
            if (cherryContainer.value.innerHTML.length === 0) {
              console.warn('Cherry 实例渲染失败，使用备用方案...')
              // 备用方案：使用 Cherry Engine 直接渲染 HTML
              try {
                const htmlContent = cherryInstance.engine.makeHtml(cleanContent)
                cherryContainer.value.innerHTML = htmlContent
                console.log('备用方案渲染成功，内容长度:', htmlContent.length)
              } catch (engineErr) {
                console.error('备用方案也失败:', engineErr)
              }
            }
          }, 200)
          
          // 等待渲染完成后添加标题ID
          setTimeout(() => {
            console.log('检查更新后的容器内容:', {
              containerHTML: cherryContainer.value?.innerHTML?.length || 0,
              hasContent: (cherryContainer.value?.innerHTML?.length || 0) > 0
            })
            // 给Cherry更多时间渲染，特别是对于本地文件
            setTimeout(() => {
              addHeadingIds()
            }, 300)
          }, 800)
        } catch (err) {
          console.error('Cherry API 更新失败:', err)
          // 如果 API 更新失败，重新创建实例
          console.log('API 更新失败，重新创建实例...')
          await initCherry()
        }
      } else {
        // 如果 Cherry 实例不存在，初始化新实例
        console.log('初始化新的Cherry实例...')
        await initCherry()
      }
      
      console.log('=== Markdown内容处理完成 ===')
    }

    // 获取正确的滚动容器
    const getScrollContainer = () => {
      return document.querySelector('.markdown-container')
    }

    // 添加大纲滚动高亮效果
    const addOutlineHighlight = (element, isInView = false) => {
      if (!element) return
      
      // 移除所有现有的大纲高亮
      const existingHighlights = document.querySelectorAll('.scroll-highlight')
      existingHighlights.forEach(el => {
        el.classList.remove('scroll-highlight', 'in-view')
      })
      
      // 添加高亮类
      element.classList.add('scroll-highlight')
      if (isInView) {
        element.classList.add('in-view')
      }
      
      // 3秒后移除高亮
      setTimeout(() => {
        element.classList.remove('scroll-highlight', 'in-view')
      }, 3000)
    }

    // 滚动到标题
    const scrollToHeading = (item, index) => {
      console.log(`点击大纲项 #${index + 1}: "${item.text}", ID: ${item.id}`)
      activeOutlineIndex.value = index
      
      // 等待一小段时间确保DOM已更新
      setTimeout(() => {
      const element = document.getElementById(item.id)
        console.log(`查找标题元素 ID: ${item.id}`, element)
        
      if (element) {
          const scrollContainer = getScrollContainer()
          console.log('滚动容器:', scrollContainer)
          
          if (scrollContainer) {
            // 获取容器和元素的位置信息
            const containerRect = scrollContainer.getBoundingClientRect()
            const elementRect = element.getBoundingClientRect()
            const currentScrollTop = scrollContainer.scrollTop
            const containerHeight = containerRect.height
            const scrollHeight = scrollContainer.scrollHeight
            
            // 计算元素相对于容器顶部的绝对位置
            const elementOffsetTop = currentScrollTop + elementRect.top - containerRect.top
            
            // 检查元素是否已经在视窗内
            const elementTop = elementRect.top - containerRect.top
            const elementBottom = elementRect.bottom - containerRect.top
            const isElementVisible = elementTop >= 0 && elementBottom <= containerHeight
            
            console.log(`元素位置信息:`, {
              elementTop,
              elementBottom,
              containerHeight,
              isElementVisible,
              elementOffsetTop,
              currentScrollTop,
              scrollHeight
            })
            
            // 添加高亮效果（无论是否滚动都要高亮）
            addOutlineHighlight(element, isElementVisible)
            
            if (isElementVisible) {
              // 元素已经在视窗内，尝试滚动到中央位置
              const targetScrollTop = elementOffsetTop - (containerHeight / 2) + (elementRect.height / 2)
              const maxScrollTop = scrollHeight - containerHeight
              const minScrollTop = 0
              
              // 检查是否可以滚动到目标位置
              if (targetScrollTop >= minScrollTop && targetScrollTop <= maxScrollTop) {
                // 计算滚动距离，如果距离很小就不滚动
                const scrollDistance = Math.abs(targetScrollTop - currentScrollTop)
                if (scrollDistance > 50) { // 只有滚动距离大于50px才执行滚动
                  console.log(`元素已可见，滚动到中央位置: ${targetScrollTop}`)
                  scrollContainer.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                  })
                } else {
                  console.log(`元素已在理想位置附近，仅高亮显示`)
                }
              } else {
                console.log(`无法滚动到中央位置（边界限制），仅高亮显示`)
              }
            } else {
              // 元素不在视窗内，执行正常滚动
              let targetScrollTop
              
              if (elementTop < 0) {
                // 元素在视窗上方，滚动到视窗上方1/4处
                targetScrollTop = elementOffsetTop - (containerHeight * 0.15)
              } else {
                // 元素在视窗下方，滚动到视窗上方1/4处
                targetScrollTop = elementOffsetTop - (containerHeight * 0.15)
              }
              
              // 确保不超出边界
              const maxScrollTop = scrollHeight - containerHeight
              targetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop))
              
              console.log(`滚动到新位置: 当前=${currentScrollTop}, 目标=${targetScrollTop}, 元素在视窗${elementTop < 0 ? '上方' : '下方'}`)
              
              // 特殊处理：如果是文档底部的元素，先滚动到最大位置
              if (elementTop > 0 && targetScrollTop === maxScrollTop) {
                console.log('文档底部元素，先滚动到最大位置')
                scrollContainer.scrollTo({
                  top: maxScrollTop,
                  behavior: 'smooth'
                })
                
                // 滚动完成后，再按"已在视窗"的逻辑处理
                setTimeout(() => {
                  const newElementRect = element.getBoundingClientRect()
                  const newElementOffsetTop = maxScrollTop + newElementRect.top - containerRect.top
                  const centerTargetScrollTop = newElementOffsetTop - (containerHeight / 2) + (newElementRect.height / 2)
                  const finalTargetScrollTop = Math.max(0, Math.min(centerTargetScrollTop, maxScrollTop))
                  
                  console.log(`底部元素二次定位: 居中目标=${centerTargetScrollTop}, 最终目标=${finalTargetScrollTop}`)
                  
                  if (Math.abs(finalTargetScrollTop - maxScrollTop) > 10) {
                    scrollContainer.scrollTo({
                      top: finalTargetScrollTop,
                      behavior: 'smooth'
                    })
                  }
                }, 500) // 等待第一次滚动完成
              } else {
                // 正常滚动
                scrollContainer.scrollTo({
                  top: targetScrollTop,
                  behavior: 'smooth'
                })
              }
            }
          } else {
            console.warn('未找到滚动容器，使用备用方案')
            addOutlineHighlight(element)
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        } else {
          console.error(`未找到标题元素: ${item.id}`)
          // 尝试通过文本内容查找
          const allHeadings = cherryContainer.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
          const foundHeading = Array.from(allHeadings).find(h => 
            h.textContent.trim() === item.text.trim()
          )
          if (foundHeading) {
            console.log('通过文本内容找到标题:', foundHeading)
            foundHeading.id = item.id // 重新设置ID
            addOutlineHighlight(foundHeading)
            foundHeading.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
        }
      }, 100) // 增加延迟确保DOM完全更新
    }

    // 滚动到评论位置
    const scrollToComment = (index) => {
      console.log(`=== 点击评论 #${index + 1} ===`)
      
      // 清除之前的高亮
      clearCommentHighlight()

      if (activeCommentIndex.value === index) {
        // 如果点击的是当前激活的评论，则取消激活
        console.log('取消激活当前评论')
        activeCommentIndex.value = null
        return
      }

      activeCommentIndex.value = index
      const comment = comments.value[index]
      console.log(`评论内容: "${comment.text}"`)
      console.log(`评论信息:`, {
        lineNumber: comment.lineNumber,
        isCommentOnlyLine: comment.isCommentOnlyLine,
        nearestBeforeText: comment.nearestBeforeText.substring(0, 50) + '...',
        nearestAfterText: comment.nearestAfterText.substring(0, 50) + '...'
      })
      
      if (!cherryContainer.value) {
        console.error('Cherry容器不存在')
        return
      }

      // 获取所有可能的文本元素
      const allElements = Array.from(cherryContainer.value.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, div'))
        .filter(el => {
          const text = el.textContent?.trim()
          return text && text.length > 3 && !el.querySelector('p, h1, h2, h3, h4, h5, h6, li') // 排除包含其他元素的容器
        })
      
      console.log(`找到 ${allElements.length} 个可用元素`)
      
      if (allElements.length === 0) {
        console.error('没有找到任何可用元素')
        return
    }

      // 寻找最匹配的元素
      let targetElement = null
      let bestScore = 0
      
      // 方法1: 通过前后文本精确匹配
      if (comment.nearestBeforeText || comment.nearestAfterText) {
        console.log('尝试通过前后文本匹配...')
        
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i]
          const elementText = element.textContent.trim()
          let score = 0
          
          // 检查是否匹配前面的文本
          if (comment.nearestBeforeText) {
            const beforeWords = comment.beforeKeywords
            const elementWords = elementText.match(/\w+/g) || []
            const matchingWords = beforeWords.filter(word => elementWords.includes(word))
            score += matchingWords.length * 2
            
            // 检查文本相似度
            if (elementText.includes(comment.nearestBeforeText.substring(0, 30))) {
              score += 10
            }
          }
          
          // 检查是否匹配后面的文本
          if (comment.nearestAfterText) {
            const afterWords = comment.afterKeywords
            const elementWords = elementText.match(/\w+/g) || []
            const matchingWords = afterWords.filter(word => elementWords.includes(word))
            score += matchingWords.length * 2
            
            // 检查文本相似度
            if (elementText.includes(comment.nearestAfterText.substring(0, 30))) {
              score += 10
            }
          }
          
          if (score > bestScore) {
            bestScore = score
            targetElement = element
            console.log(`找到更好的匹配元素 (得分: ${score}): ${elementText.substring(0, 50)}...`)
          }
        }
      }
      
      // 方法2: 如果没有找到好的匹配，使用位置估算
      if (!targetElement || bestScore < 3) {
        console.log('使用位置估算方法...')
        const estimatedIndex = Math.floor((index / comments.value.length) * allElements.length)
        const safeIndex = Math.max(0, Math.min(estimatedIndex, allElements.length - 1))
        targetElement = allElements[safeIndex]
        console.log(`位置估算: 评论 ${index}/${comments.value.length} -> 元素 ${safeIndex}/${allElements.length}`)
      }
      
      if (!targetElement) {
        console.error('无法找到目标元素')
        return
      }
      
      console.log(`最终选择的目标元素: ${targetElement.tagName} - "${targetElement.textContent.substring(0, 50)}..."`)
      
      // 确定要高亮的元素
      const elementsToHighlight = []
      const targetIndex = allElements.indexOf(targetElement)
      
      if (comment.isCommentOnlyLine) {
        // 评论独立成行，选中前后行
        console.log('评论独立成行，选中前后行')
        if (targetIndex > 0) {
          elementsToHighlight.push(allElements[targetIndex - 1])
        }
        elementsToHighlight.push(targetElement)
        if (targetIndex < allElements.length - 1) {
          elementsToHighlight.push(allElements[targetIndex + 1])
        }
      } else {
        // 评论在行内，只选中当前行
        console.log('评论在行内，只选中当前行')
        elementsToHighlight.push(targetElement)
      }
      
      console.log(`将高亮 ${elementsToHighlight.length} 个元素`)
      
      // 应用高亮样式
      elementsToHighlight.forEach((element, i) => {
        console.log(`高亮元素 ${i + 1}: ${element.tagName} - "${element.textContent.substring(0, 50)}..."`)
        
        // 添加基础高亮类
        element.classList.add('comment-line-highlight')
        
        // 区分评论所在行和前后行
        if (element === targetElement) {
          // 评论所在行 - 主要高亮
          element.classList.add('comment-main-target')
          element.setAttribute('data-comment-index', index + 1)
          console.log(`主要目标行: ${element.tagName}`)
        } else {
          // 前后行 - 次要高亮
          element.classList.add('comment-context-line')
          console.log(`上下文行: ${element.tagName}`)
        }
        
        console.log(`元素 ${i + 1} 样式已应用`)
      })
      
      // 滚动到目标元素
      console.log(`滚动到目标元素: ${targetElement.tagName}`)
      
      const scrollContainer = getScrollContainer()
      if (scrollContainer) {
        // 使用精确的滚动定位
        const containerRect = scrollContainer.getBoundingClientRect()
        const elementRect = targetElement.getBoundingClientRect()
        const currentScrollTop = scrollContainer.scrollTop
        
        // 计算元素相对于容器顶部的绝对位置
        const elementOffsetTop = currentScrollTop + elementRect.top - containerRect.top
        
        // 滚动到元素位置，留出一些上边距
        const targetScrollTop = elementOffsetTop - 100
        const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight
        const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop))
        
        console.log(`滚动信息: 当前=${currentScrollTop}, 目标=${finalScrollTop}`)
        
        scrollContainer.scrollTo({
          top: finalScrollTop,
          behavior: 'smooth'
        })
      } else {
        // 备用方案
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }
      
      console.log(`评论 #${index + 1} 定位完成`)
    }

    // 清除评论高亮
    const clearCommentHighlight = () => {
      if (!cherryContainer.value) return
      
      const highlighted = cherryContainer.value.querySelectorAll('.comment-line-highlight')
      console.log(`清除 ${highlighted.length} 个评论高亮`)
      
      highlighted.forEach(el => {
        el.classList.remove('comment-line-highlight')
        el.classList.remove('comment-main-target')
        el.classList.remove('comment-context-line')
        el.removeAttribute('data-comment-index')
        // 清除内联样式（如果有的话）
        el.style.backgroundColor = ''
        el.style.borderLeft = ''
        el.style.paddingLeft = ''
        el.style.marginLeft = ''
        el.style.borderRadius = ''
        el.style.transition = ''
      })
    }

    // 切换评论面板
    const toggleComments = () => {
      showComments.value = !showComments.value
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
        console.log('开始从URL加载:', urlInput.value)
        
        // 尝试直接请求
        let response
        try {
          response = await axios.get(urlInput.value, {
            timeout: 15000,
            headers: {
              'Accept': 'text/plain, text/markdown, */*'
            }
          })
          console.log('直接请求成功')
        } catch (directError) {
          console.log('直接请求失败，尝试使用CORS代理:', directError.message)
          
          // 如果是CORS错误，尝试使用CORS代理
          if (directError.message.includes('Network Error') || 
              directError.code === 'ERR_NETWORK' ||
              directError.message.includes('CORS')) {
            
            console.log('检测到CORS问题，使用代理服务...')
            
            // 尝试多个CORS代理服务
            const corsProxies = [
              'https://api.allorigins.win/raw?url=',
              'https://cors-anywhere.herokuapp.com/',
              'https://api.codetabs.com/v1/proxy?quest='
            ]
            
            let proxySuccess = false
            for (const proxy of corsProxies) {
              try {
                console.log(`尝试代理: ${proxy}`)
                const proxyUrl = proxy + encodeURIComponent(urlInput.value)
                response = await axios.get(proxyUrl, {
                  timeout: 20000,
                  headers: {
                    'Accept': 'text/plain, text/markdown, */*'
                  }
                })
                console.log(`代理 ${proxy} 请求成功`)
                proxySuccess = true
                break
              } catch (proxyError) {
                console.log(`代理 ${proxy} 失败:`, proxyError.message)
                continue
              }
            }
            
            if (!proxySuccess) {
              throw new Error('所有代理服务都无法访问该URL，可能是网络问题或URL无效')
            }
          } else {
            throw directError
          }
        }

        // 检查响应内容
        if (!response.data) {
          throw new Error('URL返回的内容为空')
        }

        // 检查是否是Markdown内容
        const content = response.data
        if (typeof content !== 'string') {
          throw new Error('URL返回的不是文本内容，请确认URL指向Markdown文件')
        }

        console.log(`成功获取内容，长度: ${content.length} 字符`)
        await processMarkdown(content)
        
        // 添加到最近文件记录
        addToRecentFiles({
          type: 'url',
          url: urlInput.value,
          name: urlInput.value.split('/').pop() || 'Unknown File',
          title: urlInput.value.split('/').pop()?.replace(/\.(md|markdown)$/i, '') || 'Unknown File'
        })
        
        console.log('URL导入成功')
      } catch (err) {
        console.error('加载URL失败:', err)
        
        // 提供更友好的错误信息
        let errorMessage = '加载失败: '
        
        if (err.message.includes('timeout') || err.code === 'ECONNABORTED') {
          errorMessage += '请求超时，请检查网络连接或URL是否正确'
        } else if (err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
          errorMessage += 'CORS跨域问题，建议:\n1. 使用支持CORS的URL\n2. 下载文件后使用"打开本地文件"功能\n3. 使用GitHub Raw链接等公开URL'
        } else if (err.response) {
          if (err.response.status === 404) {
            errorMessage += 'URL不存在 (404)，请检查URL是否正确'
          } else if (err.response.status === 403) {
            errorMessage += 'URL访问被拒绝 (403)，可能需要权限或URL不公开'
          } else {
            errorMessage += `HTTP ${err.response.status}: ${err.response.statusText}`
          }
        } else {
          errorMessage += err.message
        }
        
        error.value = errorMessage
      } finally {
        loading.value = false
      }
    }

    // 处理打开本地文件菜单项点击
    const handleOpenLocalFile = () => {
      console.log('=== handleOpenLocalFile 被调用 ===')
      console.log('showFileUploadModal 当前值:', showFileUploadModal.value)
      console.log('showMenuDropdown 当前值:', showMenuDropdown.value)
      
      // 关闭菜单
      showMenuDropdown.value = false
      console.log('菜单已关闭')
      
      // 显示文件上传浮层
      showFileUploadModal.value = true
      console.log('showFileUploadModal 设置后值:', showFileUploadModal.value)
      
      console.log('=== handleOpenLocalFile 执行完成 ===')
    }

    // 关闭文件上传浮层
    const closeFileUploadModal = () => {
      showFileUploadModal.value = false
      isDragOver.value = false
    }

    // 触发文件选择器
    const triggerFileSelect = () => {
      fileInput.value.click()
    }

    // 处理文件选择
    const handleFileSelect = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      await processUploadedFile(file)

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

    // 加载测试文档
    const loadTestDocument = async (filename) => {
      console.log(`=== 开始加载测试文档: ${filename} ===`)
      loading.value = true
      error.value = ''
      showTestDocModal.value = false

      try {
        console.log(`请求文件: ./markdown_demo/${filename}`)
        const response = await fetch(`./markdown_demo/${filename}`)
        console.log(`响应状态: ${response.status} ${response.statusText}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const content = await response.text()
        console.log(`文件内容长度: ${content.length} 字符`)
        console.log(`文件内容预览: ${content.substring(0, 100)}...`)
        
        await processMarkdown(content)
        console.log(`测试文档 ${filename} 加载成功`)
        console.log(`解析结果: ${comments.value.length} 个评论, ${outline.value.length} 个标题`)
      } catch (err) {
        console.error('加载测试文档失败:', err)
        error.value = `加载测试文档失败: ${err.message}`
      } finally {
        loading.value = false
        console.log(`=== 测试文档 ${filename} 加载完成 ===`)
      }
    }

    // 关闭测试文档模态框
    const closeTestDocModal = () => {
      showTestDocModal.value = false
    }

    // 点击外部关闭侧边栏 (仅在移动端)
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && showSidebar.value && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-collapsed-toggle')) {
        showSidebar.value = false
      }
      // 点击外部关闭菜单浮层
      if (showMenuDropdown.value && !event.target.closest('.main-menu')) {
        showMenuDropdown.value = false
      }
    }

    // 处理菜单离开事件
    const handleMenuLeave = () => {
      // 设置一个短暂的延迟，给用户时间移动到浮层
      menuHideTimer = setTimeout(() => {
        showMenuDropdown.value = false
      }, 100)
    }

    // 清除菜单隐藏定时器
    const clearMenuHideTimer = () => {
      if (menuHideTimer) {
        clearTimeout(menuHideTimer)
        menuHideTimer = null
      }
    }

    // 拖拽事件处理
    const handleDragOver = (event) => {
      event.preventDefault()
      isDragOver.value = true
    }

    const handleDragLeave = (event) => {
      event.preventDefault()
      // 只有当离开整个拖拽区域时才设置为false
      if (!event.currentTarget.contains(event.relatedTarget)) {
        isDragOver.value = false
      }
    }

    const handleDrop = async (event) => {
      event.preventDefault()
      isDragOver.value = false
      
      const files = event.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        await processUploadedFile(file)
      }
    }

    // 处理上传的文件（统一处理函数）
    const processUploadedFile = async (file) => {
      if (!file.name.match(/\.(md|markdown)$/i)) {
        alert('请选择Markdown文件 (.md 或 .markdown)')
        return
      }

      loading.value = true
      error.value = ''
      showFileUploadModal.value = false

      try {
        const content = await readFileAsText(file)
        await processMarkdown(content)
        
        // 添加到最近文件记录
        addToRecentFiles({
          type: 'local',
          name: file.name,
          title: file.name.replace(/\.(md|markdown)$/i, ''),
          size: file.size,
          lastModified: file.lastModified
        })
      } catch (err) {
        console.error('读取文件失败:', err)
        error.value = '读取文件失败: ' + err.message
      } finally {
        loading.value = false
      }
    }

    // 重新加载最近文件
    const loadRecentFile = async (recentFile) => {
      console.log('重新加载最近文件:', recentFile)
      showMenuDropdown.value = false
      
      if (recentFile.type === 'url') {
        // 重新加载URL文件
        urlInput.value = recentFile.url
        await loadFromUrl()
      } else if (recentFile.type === 'local') {
        // 本地文件无法直接重新加载，提示用户
        alert(`无法直接重新加载本地文件 "${recentFile.name}"，请使用"打开本地文件"功能重新选择。`)
      }
    }

    // 清除最近文件记录
    const clearRecentFiles = () => {
      if (confirm('确定要清除所有最近文件记录吗？')) {
        recentFiles.value = []
        saveRecentFiles()
        console.log('已清除最近文件记录')
      }
    }

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (!bytes) return ''
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
      if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
      if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
      
      return date.toLocaleDateString()
    }

    // 组件挂载时加载默认文件
    onMounted(async () => {
      // 添加全局点击事件监听
      document.addEventListener('click', handleClickOutside)
      
      // 加载最近文件记录
      loadRecentFiles()
      
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
      showSidebar,
      showComments,
      showMenuDropdown,
      urlInput,
      fileInput,
      cherryContainer,
      outline,
      activeOutlineIndex,
      activeCommentIndex,
      toggleComments,
      scrollToHeading,
      scrollToComment,
      loadFromUrl,
      handleOpenLocalFile,
      handleFileSelect,
      closeUrlModal,
      handleMenuLeave,
      clearMenuHideTimer,
      loadTestDocument,
      closeTestDocModal,
      testDocuments,
      showTestDocModal,
      showFileUploadModal,
      isDragOver,
      recentFiles,
      closeFileUploadModal,
      triggerFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      loadRecentFile,
      clearRecentFiles,
      formatFileSize,
      formatTime
    }
  }
}
</script> 