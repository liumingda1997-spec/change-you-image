(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const h=3*1024*1024;let l=[];const I=document.querySelector("#app");I.innerHTML=`
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
`;const r=document.getElementById("uploadArea"),v=document.getElementById("fileInput"),b=document.getElementById("previewSection"),f=document.getElementById("imageList"),B=document.getElementById("statsBar"),y=document.getElementById("progressBar"),$=document.getElementById("progressFill"),x=document.getElementById("progressText"),p=document.getElementById("downloadAllBtn"),U=document.getElementById("resetBtn");r.addEventListener("click",()=>v.click());r.addEventListener("dragover",n=>{n.preventDefault(),r.classList.add("dragover")});r.addEventListener("dragleave",()=>{r.classList.remove("dragover")});r.addEventListener("drop",n=>{var t;n.preventDefault(),r.classList.remove("dragover");const e=(t=n.dataTransfer)==null?void 0:t.files;e&&e.length>0&&L(Array.from(e))});v.addEventListener("change",n=>{const e=n.target.files;e&&e.length>0&&L(Array.from(e))});p.addEventListener("click",H);U.addEventListener("click",O);async function L(n){const e=n.filter(t=>t.type.startsWith("image/"));if(e.length===0){alert("请上传图片文件！");return}l=[],r.style.display="none",b.style.display="block",y.style.display="flex",f.innerHTML="";for(let t=0;t<e.length;t++){const i=(t+1)/e.length*100;$.style.width=`${i}%`,x.textContent=`处理中 ${t+1}/${e.length}`;const s=await R(e[t]);s&&(l.push(s),A(s,t))}y.style.display="none",j()}async function R(n){return new Promise(e=>{const t=new FileReader;t.onload=async i=>{var c;const s=(c=i.target)==null?void 0:c.result,a=new Image;a.onload=async()=>{const o=a.width,d=a.height,g=o>d?"horizontal":"vertical";let u,m;g==="horizontal"?(u=1200,m=600):(u=1080,m=1920);const E=await z(a,{file:n,originalWidth:o,originalHeight:d,orientation:g,targetWidth:u,targetHeight:m,dataUrl:s});e(E)},a.onerror=()=>e(null),a.src=s},t.onerror=()=>e(null),t.readAsDataURL(n)})}async function z(n,e){const t=document.createElement("canvas");t.width=e.targetWidth,t.height=e.targetHeight,t.getContext("2d").drawImage(n,0,0,e.targetWidth,e.targetHeight);const s=await new Promise(o=>{t.toBlob(d=>o(d),"image/png")});if(s.size<=h)return{originalInfo:e,processedDataUrl:t.toDataURL("image/png"),blob:s,outputExt:"png"};let a=.92;for(;a>=.1;){const o=await new Promise(d=>{t.toBlob(g=>d(g),"image/jpeg",a)});if(o.size<=h)return{originalInfo:e,processedDataUrl:t.toDataURL("image/jpeg",a),blob:o,outputExt:"jpg"};a-=.05}const c=await new Promise(o=>{t.toBlob(d=>o(d),"image/jpeg",.1)});return{originalInfo:e,processedDataUrl:t.toDataURL("image/jpeg",.1),blob:c,outputExt:"jpg"}}function A(n,e){const t=n.originalInfo,i=document.createElement("div");i.className=`image-card ${t.orientation}`,i.innerHTML=`
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
  `,f.appendChild(i)}function j(){const n=l.length,e=l.filter(i=>i.originalInfo.orientation==="horizontal").length,t=n-e;B.innerHTML=`
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
  `}function w(n,e){return`${n.name.replace(/\.[^/.]+$/,"")}.${e}`}window.downloadSingle=n=>{const e=l[n];if(!e)return;const t=URL.createObjectURL(e.blob),i=document.createElement("a");i.href=t,i.download=w(e.originalInfo.file,e.outputExt),i.click(),URL.revokeObjectURL(t)};function H(){if(l.length===0)return;p.disabled=!0,p.textContent="下载中...";let n=0;l.forEach((e,t)=>{setTimeout(()=>{const i=URL.createObjectURL(e.blob),s=document.createElement("a");s.href=i,s.download=w(e.originalInfo.file,e.outputExt),s.click(),URL.revokeObjectURL(i),t===l.length-1&&setTimeout(()=>{p.disabled=!1,p.textContent="下载全部图片"},500)},n),n+=200})}function O(){l=[],v.value="",r.style.display="block",b.style.display="none",f.innerHTML=""}
