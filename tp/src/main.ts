import './style.css'

// 图片处理状态
interface ImageInfo {
  file: File
  originalWidth: number
  originalHeight: number
  orientation: 'horizontal' | 'vertical'
  targetWidth: number
  targetHeight: number
  dataUrl: string
}

// 处理后的图片信息
interface ProcessedImage {
  originalInfo: ImageInfo
  processedDataUrl: string
  blob: Blob
}

let processedImages: ProcessedImage[] = []

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="container">
    <h1>图片方向识别与缩放工具</h1>
    <p class="description">自动识别图片方向并进行强制缩放（不等比）</p>
    
    <div class="rules">
      <div class="rule horizontal">
        <span class="icon">↔️</span>
        <div class="rule-content">
          <strong>横版图片</strong>
          <p>宽度 > 高度 → 缩放至 1200×600</p>
        </div>
      </div>
      <div class="rule vertical">
        <span class="icon">↕️</span>
        <div class="rule-content">
          <strong>竖版图片</strong>
          <p>高度 ≥ 宽度 → 缩放至 1080×1920</p>
        </div>
      </div>
    </div>

    <div class="preview-section" id="previewSection" style="display: none;">
      <div class="actions-top">
        <button class="btn btn-primary" id="downloadAllBtn">下载全部图片</button>
        <button class="btn btn-secondary" id="resetBtn">重新上传</button>
      </div>
      <div class="stats-bar" id="statsBar"></div>
      <div class="progress-bar" id="progressBar" style="display: none;">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
      </div>
      <div class="image-list" id="imageList"></div>
    </div>

    <div class="upload-area" id="uploadArea">
      <input type="file" id="fileInput" accept="image/*" multiple hidden />
      <div class="upload-content">
        <span class="upload-icon">📁</span>
        <p>点击或拖拽图片到此处上传</p>
        <p class="hint">支持 JPG、PNG、WebP 等格式</p>
      </div>
    </div>
  </div>
`

// 获取DOM元素
const uploadArea = document.getElementById('uploadArea')!
const fileInput = document.getElementById('fileInput') as HTMLInputElement
const previewSection = document.getElementById('previewSection')!
const imageList = document.getElementById('imageList')!
const statsBar = document.getElementById('statsBar')!
const progressBar = document.getElementById('progressBar')!
const progressFill = document.getElementById('progressFill')!
const progressText = document.getElementById('progressText')!
const downloadAllBtn = document.getElementById('downloadAllBtn') as HTMLButtonElement
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement

// 事件监听
uploadArea.addEventListener('click', () => fileInput.click())
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault()
  uploadArea.classList.add('dragover')
})
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover')
})
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault()
  uploadArea.classList.remove('dragover')
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFiles(Array.from(files))
  }
})
fileInput.addEventListener('change', (e) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    handleFiles(Array.from(files))
  }
})

downloadAllBtn.addEventListener('click', downloadAll)
resetBtn.addEventListener('click', reset)

// 处理多个文件
async function handleFiles(files: File[]): Promise<void> {
  // 过滤图片文件
  const imageFiles = files.filter(f => f.type.startsWith('image/'))
  
  if (imageFiles.length === 0) {
    alert('请上传图片文件！')
    return
  }

  processedImages = []
  uploadArea.style.display = 'none'
  previewSection.style.display = 'block'
  progressBar.style.display = 'flex'
  imageList.innerHTML = ''
  
  // 逐个处理图片
  for (let i = 0; i < imageFiles.length; i++) {
    const progress = ((i + 1) / imageFiles.length) * 100
    progressFill.style.width = `${progress}%`
    progressText.textContent = `处理中 ${i + 1}/${imageFiles.length}`
    
    const processed = await processFile(imageFiles[i])
    if (processed) {
      processedImages.push(processed)
      addImageCard(processed, i)
    }
  }

  progressBar.style.display = 'none'
  updateStats()
}

// 处理单个文件
async function processFile(file: File): Promise<ProcessedImage | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      
      const img = new Image()
      img.onload = async () => {
        const width = img.width
        const height = img.height
        
        const orientation: 'horizontal' | 'vertical' = width > height ? 'horizontal' : 'vertical'
        
        let targetWidth: number, targetHeight: number
        if (orientation === 'horizontal') {
          targetWidth = 1200
          targetHeight = 600
        } else {
          targetWidth = 1080
          targetHeight = 1920
        }

        const imageInfo: ImageInfo = {
          file,
          originalWidth: width,
          originalHeight: height,
          orientation,
          targetWidth,
          targetHeight,
          dataUrl
        }

        // 处理图片
        const processed = await resizeImage(img, imageInfo)
        resolve(processed)
      }
      img.onerror = () => resolve(null)
      img.src = dataUrl
    }
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

// 缩放图片
async function resizeImage(img: HTMLImageElement, info: ImageInfo): Promise<ProcessedImage> {
  const canvas = document.createElement('canvas')
  canvas.width = info.targetWidth
  canvas.height = info.targetHeight
  
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, info.targetWidth, info.targetHeight)

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png')
  })

  return {
    originalInfo: info,
    processedDataUrl: canvas.toDataURL('image/png'),
    blob
  }
}

// 添加图片卡片
function addImageCard(processed: ProcessedImage, index: number): void {
  const info = processed.originalInfo
  const card = document.createElement('div')
  card.className = `image-card ${info.orientation}`
  card.innerHTML = `
    <div class="card-header">
      <span class="orientation-tag ${info.orientation}">
        ${info.orientation === 'horizontal' ? '↔️ 横版' : '↕️ 竖版'}
      </span>
      <span class="file-name">${info.file.name}</span>
    </div>
    <div class="card-body">
      <div class="image-preview original">
        <img src="${info.dataUrl}" alt="原图" />
        <div class="label">原图</div>
        <div class="size">${info.originalWidth} × ${info.originalHeight}</div>
      </div>
      <div class="arrow-icon">→</div>
      <div class="image-preview processed">
        <img src="${processed.processedDataUrl}" alt="处理后" />
        <div class="label">处理后</div>
        <div class="size">${info.targetWidth} × ${info.targetHeight}</div>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn-small" onclick="downloadSingle(${index})">下载此图</button>
    </div>
  `
  imageList.appendChild(card)
}

// 更新统计信息
function updateStats(): void {
  const total = processedImages.length
  const horizontal = processedImages.filter(p => p.originalInfo.orientation === 'horizontal').length
  const vertical = total - horizontal
  
  statsBar.innerHTML = `
    <div class="stat-item">
      <span class="stat-value">${total}</span>
      <span class="stat-label">总计</span>
    </div>
    <div class="stat-item horizontal">
      <span class="stat-value">${horizontal}</span>
      <span class="stat-label">横版</span>
    </div>
    <div class="stat-item vertical">
      <span class="stat-value">${vertical}</span>
      <span class="stat-label">竖版</span>
    </div>
  `
}

// 获取原文件名（只替换后缀为 .png）
function getOriginalFileName(file: File): string {
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
  return `${nameWithoutExt}.png`
}

// 下载单张图片
(window as any).downloadSingle = (index: number): void => {
  const processed = processedImages[index]
  if (!processed) return
  
  const url = URL.createObjectURL(processed.blob)
  const link = document.createElement('a')
  link.href = url
  link.download = getOriginalFileName(processed.originalInfo.file)
  link.click()
  URL.revokeObjectURL(url)
}

// 批量下载全部（浏览器原生多文件下载）
function downloadAll(): void {
  if (processedImages.length === 0) return
  
  downloadAllBtn.disabled = true
  downloadAllBtn.textContent = '下载中...'
  
  // 浏览器原生批量下载：逐个触发下载
  let delay = 0
  processedImages.forEach((processed, index) => {
    setTimeout(() => {
      const url = URL.createObjectURL(processed.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = getOriginalFileName(processed.originalInfo.file)
      link.click()
      URL.revokeObjectURL(url)
      
      // 最后一个完成后恢复按钮
      if (index === processedImages.length - 1) {
        setTimeout(() => {
          downloadAllBtn.disabled = false
          downloadAllBtn.textContent = '下载全部图片'
        }, 500)
      }
    }, delay)
    delay += 200 // 每隔200ms下载一个，避免浏览器拦截
  })
}

// 重置
function reset(): void {
  processedImages = []
  fileInput.value = ''
  uploadArea.style.display = 'block'
  previewSection.style.display = 'none'
  imageList.innerHTML = ''
}
