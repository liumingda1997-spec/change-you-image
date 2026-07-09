# 图片批量尺寸转换工具

纯前端图片批量尺寸转换工具，所有处理在浏览器本地完成，无需后端服务器。

## 功能特性

- 📤 支持拖拽 / 点击上传，图片数量无限制
- 📐 四种预设尺寸（可多选）：
  - 竖图 640 × 1140
  - 横图 1140 × 640
  - 竖版 800 × 1200
  - 横版 1280 × 720
- 💾 自动重命名：`原图名_宽度x高度.扩展名`
- 📦 一键打包 ZIP 批量下载
- 🔒 纯前端处理，图片不上传服务器，隐私安全

## 部署到 GitHub Pages

### 方式一：直接部署（推荐，最简单）

1. 将本文件夹所有文件上传到 GitHub 仓库
2. 进入仓库 Settings → Pages
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main` / `root`，点击 Save
5. 等待几分钟后即可通过 `https://你的用户名.github.io/仓库名/` 访问

> 默认通过 CDN 加载 JSZip，GitHub Pages 环境下完全可用。

### 方式二：完全离线部署（无外部依赖）

如需完全不依赖外部 CDN，可按以下步骤操作：

1. 下载 JSZip 库文件：
   ```
   https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
   ```
2. 将 `jszip.min.js` 放到与 `index.html` 同一目录
3. 修改 `index.html` 第 7 行，将：
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
   ```
   改为：
   ```html
   <script src="./jszip.min.js"></script>
   ```
4. 一起上传到 GitHub 仓库即可

## 本地预览

直接双击 `index.html` 在浏览器中打开即可使用。

## 文件结构

```
image-resizer-site/
├── index.html    # 主页面
└── README.md     # 说明文档
```
