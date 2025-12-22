(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,155912,e=>{"use strict";function t(e,o={}){let{qrSize:a=280,showCloseButton:r=!0,closeButtonText:i="×",theme:s="light",container:d=document.body,onCancel:c}=o,l=document.createElement("div");l.style.cssText=`
    position: fixed;
    inset: 0;
    background-color: ${"dark"===s?"rgba(0, 0, 0, 0.8)":"rgba(0, 0, 0, 0.5)"};
    backdrop-filter: blur(10px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 300ms ease-out;
  `,o.overlayStyles&&Object.assign(l.style,o.overlayStyles);let p=document.createElement("div");if(p.style.cssText=`
    background: ${"dark"===s?"#1f1f1f":"#ffffff"};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
    animation: scaleIn 300ms ease-out;
  `,o.modalStyles&&Object.assign(p.style,o.modalStyles),r){let e=document.createElement("button");e.textContent=i,e.style.cssText=`
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: ${"dark"===s?"#ffffff":"#000000"};
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background-color 0.2s;
    `,e.addEventListener("mouseenter",()=>{e.style.backgroundColor="dark"===s?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)"}),e.addEventListener("mouseleave",()=>{e.style.backgroundColor="transparent"}),e.addEventListener("click",()=>{b(!0)}),p.appendChild(e)}let f=document.createElement("div");f.style.cssText=`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  `;let m=document.createElement("h3");m.textContent="Scan to Connect",m.style.cssText=`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${"dark"===s?"#ffffff":"#000000"};
    text-align: center;
  `;let u=document.createElement("canvas");u.width=a,u.height=a,u.style.cssText=`
    border: 1px solid ${"dark"===s?"#333333":"#e5e5e5"};
    border-radius: 12px;
  `,n(e,u,a).catch(console.error);let y=document.createElement("button");y.textContent="Copy URI",y.style.cssText=`
    background: ${"dark"===s?"#333333":"#f5f5f5"};
    border: 1px solid ${"dark"===s?"#444444":"#e5e5e5"};
    color: ${"dark"===s?"#ffffff":"#000000"};
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  `,y.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e);let t=y.textContent;y.textContent="Copied!",setTimeout(()=>{y.textContent=t},2e3)}catch(e){console.error("Failed to copy URI:",e)}}),f.appendChild(m),f.appendChild(u),f.appendChild(y),p.appendChild(f),l.appendChild(p);let x=document.createElement("style");x.textContent=`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes scaleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.9); opacity: 0; }
    }
  `,document.head.appendChild(x);let g=e=>{"Escape"===e.key&&b(!0)},h=e=>{e.target===l&&b(!0)};function b(e=!1){document.removeEventListener("keydown",g),l.removeEventListener("click",h),e&&c&&c(),l.style.animation="fadeOut 200ms ease-in",p.style.animation="scaleOut 200ms ease-in";let t=()=>{l.parentNode&&l.parentNode.removeChild(l),x.parentNode&&x.parentNode.removeChild(x)};l.addEventListener("animationend",t,{once:!0}),setTimeout(t,250)}return document.addEventListener("keydown",g),l.addEventListener("click",h),d.appendChild(l),{destroy:()=>b(!1),hide:function(){l.style.display="none"},show:function(){l.style.display="flex"}}}async function n(t,n,o){if(!n.getContext("2d"))return;let{toCanvas:a}=await e.A(673378);await a(n,t,{width:o,margin:2,color:{dark:"#000000",light:"#ffffff"}})}e.s(["createQROverlay",()=>t])},673378,e=>{e.v(t=>Promise.all(["static/chunks/4051eb90cc6d1e2d.js"].map(t=>e.l(t))).then(()=>t(973134)))}]);