(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();let o=[];const I=document.querySelector("#app");I.innerHTML=`
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
`;const r=document.getElementById("uploadArea"),g=document.getElementById("fileInput"),y=document.getElementById("previewSection"),u=document.getElementById("imageList"),E=document.getElementById("statsBar"),h=document.getElementById("progressBar"),B=document.getElementById("progressFill"),$=document.getElementById("progressText"),c=document.getElementById("downloadAllBtn"),U=document.getElementById("resetBtn");r.addEventListener("click",()=>g.click());r.addEventListener("dragover",n=>{n.preventDefault(),r.classList.add("dragover")});r.addEventListener("dragleave",()=>{r.classList.remove("dragover")});r.addEventListener("drop",n=>{var t;n.preventDefault(),r.classList.remove("dragover");const e=(t=n.dataTransfer)==null?void 0:t.files;e&&e.length>0&&b(Array.from(e))});g.addEventListener("change",n=>{const e=n.target.files;e&&e.length>0&&b(Array.from(e))});c.addEventListener("click",R);U.addEventListener("click",T);async function b(n){const e=n.filter(t=>t.type.startsWith("image/"));if(e.length===0){alert("请上传图片文件！");return}o=[],r.style.display="none",y.style.display="block",h.style.display="flex",u.innerHTML="";for(let t=0;t<e.length;t++){const a=(t+1)/e.length*100;B.style.width=`${a}%`,$.textContent=`处理中 ${t+1}/${e.length}`;const s=await x(e[t]);s&&(o.push(s),H(s,t))}h.style.display="none",O()}async function x(n){return new Promise(e=>{const t=new FileReader;t.onload=async a=>{var l;const s=(l=a.target)==null?void 0:l.result,i=new Image;i.onload=async()=>{const v=i.width,m=i.height,f=v>m?"horizontal":"vertical";let d,p;f==="horizontal"?(d=1200,p=600):(d=1080,p=1920);const w=await A(i,{file:n,originalWidth:v,originalHeight:m,orientation:f,targetWidth:d,targetHeight:p,dataUrl:s});e(w)},i.onerror=()=>e(null),i.src=s},t.onerror=()=>e(null),t.readAsDataURL(n)})}async function A(n,e){const t=document.createElement("canvas");t.width=e.targetWidth,t.height=e.targetHeight,t.getContext("2d").drawImage(n,0,0,e.targetWidth,e.targetHeight);const s=await new Promise(i=>{t.toBlob(l=>i(l),"image/png")});return{originalInfo:e,processedDataUrl:t.toDataURL("image/png"),blob:s}}function H(n,e){const t=n.originalInfo,a=document.createElement("div");a.className=`image-card ${t.orientation}`,a.innerHTML=`
    <div class="card-header">
      <span class="orientation-tag ${t.orientation}">
        ${t.orientation==="horizontal"?"↔️ 横版":"↕️ 竖版"}
      </span>
      <span class="file-name">${t.file.name}</span>
    </div>
    <div class="card-body">
      <div class="image-preview original">
        <img src="${t.dataUrl}" alt="原图" />
        <div class="label">原图</div>
        <div class="size">${t.originalWidth} × ${t.originalHeight}</div>
      </div>
      <div class="arrow-icon">→</div>
      <div class="image-preview processed">
        <img src="${n.processedDataUrl}" alt="处理后" />
        <div class="label">处理后</div>
        <div class="size">${t.targetWidth} × ${t.targetHeight}</div>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn-small" onclick="downloadSingle(${e})">下载此图</button>
    </div>
  `,u.appendChild(a)}function O(){const n=o.length,e=o.filter(a=>a.originalInfo.orientation==="horizontal").length,t=n-e;E.innerHTML=`
    <div class="stat-item">
      <span class="stat-value">${n}</span>
      <span class="stat-label">总计</span>
    </div>
    <div class="stat-item horizontal">
      <span class="stat-value">${e}</span>
      <span class="stat-label">横版</span>
    </div>
    <div class="stat-item vertical">
      <span class="stat-value">${t}</span>
      <span class="stat-label">竖版</span>
    </div>
  `}function L(n){return`${n.name.replace(/\.[^/.]+$/,"")}.png`}window.downloadSingle=n=>{const e=o[n];if(!e)return;const t=URL.createObjectURL(e.blob),a=document.createElement("a");a.href=t,a.download=L(e.originalInfo.file),a.click(),URL.revokeObjectURL(t)};function R(){if(o.length===0)return;c.disabled=!0,c.textContent="下载中...";let n=0;o.forEach((e,t)=>{setTimeout(()=>{const a=URL.createObjectURL(e.blob),s=document.createElement("a");s.href=a,s.download=L(e.originalInfo.file),s.click(),URL.revokeObjectURL(a),t===o.length-1&&setTimeout(()=>{c.disabled=!1,c.textContent="下载全部图片"},500)},n),n+=200})}function T(){o=[],g.value="",r.style.display="block",y.style.display="none",u.innerHTML=""}
