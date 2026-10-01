'use strict';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = document.querySelector('#theme-toggle');
let theme = localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
function applyTheme(){
 document.documentElement.dataset.theme = theme;
 document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f7f7f5' : '#050505';
 themeButton.setAttribute('aria-pressed', String(theme === 'light'));
 themeButton.setAttribute('aria-label', theme === 'light' ? '다크 모드 켜기' : '화이트 모드 켜기');
 themeButton.firstElementChild.textContent = theme === 'light' ? '☾' : '☼';
}
themeButton.addEventListener('click',()=>{theme=theme==='light'?'dark':'light';localStorage.setItem('portfolio-theme',theme);applyTheme();});
applyTheme();

const gallery = document.querySelector('#projects-view');
const dialog = document.querySelector('#project-dialog');
const section = (n,title,body) => `<section><div class="case-section-heading"><span>${n}</span><h2>${title}</h2></div>${body}</section>`;
const projects = {
 tongchoo: {name:'TongChoo',index:'01',category:'DATABASE DESIGN / TEAM PROJECT',subtitle:'상황과 상대, 말투에 맞는 답변부터 후속 대화까지. 대화의 흐름을 관계형 데이터로 설계했습니다.',role:'DB 설계 · ERD',type:'팀 프로젝트',links:[['Backend GitHub','https://github.com/TongChoo/TongChoo-BE'],['ERD 보기','https://dbdiagram.io/d/6a53b73e36d348d120c4f0f7']],body:
 section('01','프로젝트 개요','<p>TongChoo는 상황·상대·말투에 맞는 답변을 만들고 후속 대화까지 관리하는 서비스입니다. 사용자와 답변, 여러 답변 후보가 일관된 관계를 유지하도록 데이터 구조를 설계했습니다.</p>')+
 section('02','담당 역할','<ul><li>사용자와 답변을 1:N 관계로 구성하고 ERD와 테이블 관계를 설계했습니다.</li><li>위험도, 기억 정보, 후속 상황, 답변 후보를 별도 테이블로 분리했습니다.</li><li>이메일·닉네임의 UNIQUE 제약, 조회 조건에 맞는 복합 인덱스, 외래 키와 삭제 정책을 정의했습니다.</li><li>CUSTOM 상대 설명의 길이 검증과 후속 대화 연결 구조를 정리했습니다.</li></ul>')+
 section('03','하나의 답변에서, 이어지는 대화로','<h3>문제</h3><p>답변을 한 문장으로만 저장하는 구조에서는 여러 후보의 순서와 선택 상태를 함께 보존하기 어려웠습니다. 후속 대화가 추가될수록 이전 답변과의 연결도 명확해야 했습니다.</p><div class="case-callout"><p>답변 후보와 대화의 연결을 독립적으로 표현해야, 기능이 늘어나도 같은 테이블에 열을 반복해서 추가하지 않을 수 있었습니다.</p></div><h3>설계와 해결</h3><p><code>excuse_reply_options</code>를 분리하고 <code>sort_order</code>와 <code>selected</code>로 후보의 순서와 선택 여부를 관리했습니다. 후속 대화는 <code>reply_to_excuse_id</code> 자기 참조로 이전 답변에 연결했습니다.</p><div class="schema-overview"><div class="schema-box"><h4>users</h4><span>id · PK</span><span>email · UNIQUE</span><span>nickname · UNIQUE</span></div><div class="schema-box"><h4>excuses</h4><span>user_id · FK</span><span>reply_to_excuse_id</span><span>↳ self reference</span></div><div class="schema-box"><h4>excuse_reply_options</h4><span>excuse_id · FK</span><span>sort_order</span><span>selected</span></div><div class="schema-caption">RELATION OVERVIEW — users → excuses → reply options<br>핵심 관계를 설명하기 위한 요약 구조입니다.</div></div><p><code>(excuse_id, sort_order)</code>에 UNIQUE 제약을 두어 같은 답변의 후보 순서가 중복되지 않도록 했습니다. <code>ON DELETE CASCADE</code>로 연관 데이터의 정리 기준을 정의하고, 기존 답변은 선택된 기본 후보로 옮기는 마이그레이션을 구성했습니다.</p>')+
 section('04','결과와 배운 점','<div class="case-result"><p>여러 답변 후보와 선택 상태, 후속 대화를 각각의 관계로 표현할 수 있게 되었습니다.</p></div><p>기능을 저장할 자리를 만드는 것에서 더 나아가, 데이터가 어떤 순서로 생성되고 연결되며 삭제되는지까지 설계해야 한다는 점을 배웠습니다. 관계와 제약 조건을 통해 서비스의 규칙을 데이터 구조에 담았습니다.</p>')},
 gotion: {name:'Gotion',index:'02',category:'FRONTEND / TEAM WEB PROJECT',subtitle:'기획부터 화면 구현, 최종 발표까지. 팀과 함께 하나의 웹 프로젝트를 완성한 경험입니다.',role:'프론트엔드',type:'학교 캡스톤',links:[['Project GitHub','https://github.com/soshinbalun/gotion']],body:
 section('01','프로젝트 개요','<p>Gotion은 2026년 학교 캡스톤으로 진행한 팀 웹 프로젝트입니다. 프론트엔드를 담당하며 요구사항을 화면과 사용자 흐름으로 구체화하고, 팀과 함께 개발 및 최종 발표를 마쳤습니다.</p>')+
 section('02','담당 역할','<ul><li>서비스의 화면과 사용자 흐름을 구성하고 프론트엔드를 개발했습니다.</li><li>팀원들과 요구사항을 조율하며 기획 내용을 구현으로 연결했습니다.</li><li>개발 결과를 정리하고 최종 발표 과정에 참여했습니다.</li></ul>')+
 section('03','진행 과정','<div class="case-phase-list"><div><span>01 / PLAN</span><h4>기획과 조율</h4><p>팀이 만들 서비스의 요구사항과 화면 흐름을 함께 정리했습니다.</p></div><div><span>02 / BUILD</span><h4>프론트엔드 구현</h4><p>사용자가 접하는 화면을 만들고 프로젝트의 흐름을 연결했습니다.</p></div><div><span>03 / SHARE</span><h4>정리와 발표</h4><p>구현 결과를 공유하고 최종 발표까지 프로젝트를 마무리했습니다.</p></div></div>')+
 section('04','프로젝트를 통해 얻은 경험','<div class="case-result"><p>화면을 만드는 경험과 함께, 팀의 요구사항을 하나의 결과물로 연결하는 과정을 경험했습니다.</p></div><p>기획·개발·발표의 전체 과정에 참여하며 화면 구현이 서비스의 다른 영역과 어떻게 맞물리는지 배웠습니다. 이 경험을 바탕으로 백엔드와 데이터 설계까지 학습 범위를 넓혀 가고 있습니다.</p>')}
};
let routeToken = 0, activeProject = null;
function renderCase(id) {
 const p = projects[id];
 document.querySelector('#case-index').textContent = `PROJECT / ${p.index}`;
 document.querySelector('#case-content').innerHTML = `<div class="case-hero"><div class="case-eyebrow">${p.category}</div><h1 id="case-title" tabindex="-1">${p.name}</h1><p class="case-subtitle">${p.subtitle}</p><dl class="case-facts"><div><dt>ROLE</dt><dd>${p.role}</dd></div><div><dt>PROJECT</dt><dd>${p.type}</dd></div><div><dt>YEAR</dt><dd>2026</dd></div></dl></div><div class="case-layout"><aside class="case-sidebar"><p>PROJECT LINKS</p>${p.links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('')}</aside><article class="case-main">${p.body}</article></div>`;
}
function route() {
 const token = ++routeToken;
 const hash = location.hash.slice(1);
 if(hash === 'main') { document.querySelector('section:not([hidden]) h1')?.focus(); return; }
 const projectId = hash.startsWith('project/') ? hash.split('/')[1] : null;
 const isDetail = !!projects[projectId];
 const view = isDetail ? 'projects' : ['home','about','projects','contact'].includes(hash) ? hash : 'home';
 const wasGallery = !gallery.hidden;
 const previous = activeProject;
 if(dialog.open) dialog.close();
 document.body.style.overflow = '';
 activeProject = isDetail ? projectId : null;
 document.body.dataset.view = isDetail ? 'detail' : view;
 for(const name of ['home','about','projects','contact']) document.querySelector(`#${name}-view`).hidden = false;
 document.querySelectorAll('[data-nav]').forEach(a=>a.dataset.nav === view ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
 gallery.classList.remove('is-opening');
 document.querySelectorAll('.work-object').forEach(b=>b.classList.toggle('is-selected',isDetail && b.dataset.project === projectId));
 if(!wasGallery) gallery.classList.remove('is-ready');
 requestAnimationFrame(()=>requestAnimationFrame(()=>{if(token===routeToken) gallery.classList.add('is-ready');}));
 document.title = `${isDetail ? projects[projectId].name : view==='projects' ? 'Selected Works' : view==='about' ? 'About' : view==='contact' ? 'Contact' : '김민성'} — Backend Developer`;
 document.querySelector('#view-announcement').textContent = isDetail ? `${projects[projectId].name} 프로젝트 상세` : `${view} 화면`;
 if(isDetail) {
   if(gallery.getBoundingClientRect().top > innerHeight || gallery.getBoundingClientRect().bottom < 0) gallery.scrollIntoView({behavior:'instant',block:'start'});
   const open = ()=> {if(token!==routeToken)return;renderCase(projectId);dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';document.querySelector('#case-title').focus({preventScroll:true});};
   if(wasGallery && !reduced.matches) {gallery.classList.add('is-opening');setTimeout(open,650);} else open();
 } else {
   if(previous && view==='projects') document.querySelector(`.work-object[data-project="${previous}"]`).focus({preventScroll:true});
   else {document.querySelector(`#${view}-view`).scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});}
 }
}
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{location.hash=`project/${b.dataset.project}`;}));
document.querySelector('#case-close').addEventListener('click',()=>{location.hash='projects';});
dialog.addEventListener('cancel',e=>{e.preventDefault();location.hash='projects';});
window.addEventListener('hashchange',route);
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(a.getAttribute('href')===location.hash)route();}));
route();
let scrollFrame=0;
function updateScrollSection(){
 scrollFrame=0;
 if(activeProject)return;
 let current='home';
 for(const name of ['home','about','projects','contact']) {
   if(document.querySelector(`#${name}-view`).getBoundingClientRect().top < innerHeight*.45)current=name;
 }
 document.body.dataset.view=current;
 document.querySelectorAll('[data-nav]').forEach(a=>a.dataset.nav===current?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
 window.dispatchEvent(new Event('scenechange'));
}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollSection);},{passive:true});

let pointerX=0,pointerY=0;
const world=document.querySelector('#gallery-world');
window.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch'||reduced.matches)return;
 pointerX=e.clientX/innerWidth*2-1;pointerY=e.clientY/innerHeight*2-1;
 world.style.setProperty('--world-rx',`${-pointerY*3}deg`);
 world.style.setProperty('--world-ry',`${pointerX*5}deg`);
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{pointerX=pointerY=0;world.style.setProperty('--world-rx','0deg');world.style.setProperty('--world-ry','0deg');});
(function particleScene(){
 const canvas=document.querySelector('#particles'), toggle=document.querySelector('#motion-toggle');
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
 if(!gl){toggle.hidden=true;return;}
 const vs=`attribute vec2 a;uniform float time,mode,aspect,dpr;uniform vec2 pointer;varying float alpha;
 void main(){float u=a.x;float v=a.y;float t=time*.13;
 float angle=u*6.2831853;
 float wave=sin(u*6.5+v*4.8+t)*1.0+cos(v*8.0-u*2.0+t)*.35;
 vec3 sheet=vec3((u-.5)*10.8+2.2,(v-.5)*9.5,wave*1.7);
 sheet.x+=sin(v*5.5+t)*1.15;sheet.y+=sin(u*4.0+t)*.55;
 float phi=v*6.2831853;float radius=1.65+.5*cos(phi*3.0+angle*2.0+t);
 vec3 orb=vec3(radius*cos(angle)*sin(phi),radius*cos(phi),radius*sin(angle)*sin(phi));
 float c=cos(t*.6),s=sin(t*.6);orb.xz=mat2(c,-s,s,c)*orb.xz;
 vec3 p=mix(sheet,orb,mode);p.x+=pointer.x*.14;p.y-=pointer.y*.12;
 float depth=7.0-p.z;gl_Position=vec4(p.x/(aspect*depth*.49),p.y/(depth*.49),0.,1.);
 gl_PointSize=clamp((11.0/depth)*dpr,0.7,3.0*dpr);
 alpha=mix(.23,.88,clamp((p.z+2.0)/4.0,0.,1.));alpha*=mix(1.,.85,mode);
 }`;
 const fs=`precision mediump float;varying float alpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.92,.92,.92,alpha*smoothstep(.5,.18,d));}`;
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 let program;
 try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Particle shader link failed');}catch(e){canvas.hidden=true;toggle.hidden=true;return;}
 gl.useProgram(program);
 const cols=180,rows=125,points=new Float32Array(cols*rows*2);let k=0;
 for(let x=0;x<cols;x++)for(let y=0;y<rows;y++){points[k++]=x/(cols-1);points[k++]=y/(rows-1);}
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);
 const attr=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
 const uniforms=Object.fromEntries(['time','mode','aspect','dpr','pointer'].map(n=>[n,gl.getUniformLocation(program,n)]));
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
 let paused=reduced.matches,time=0,last=0,mode=0,frame=0;
 function updateToggle(){toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'배경 움직임 재생':'배경 움직임 멈추기');toggle.firstElementChild.textContent=paused?'▷':'Ⅱ';}
 function draw(now){frame=0;const delta=Math.min((now-last)/1000,.04);last=now;if(!paused)time+=delta;
 const target=['projects','detail'].includes(document.body.dataset.view)?1:0;
 mode=reduced.matches?target:mode+(target-mode)*.065;
 gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.mode,mode);gl.uniform1f(uniforms.aspect,canvas.width/canvas.height);gl.uniform1f(uniforms.dpr,Math.min(devicePixelRatio,1.5));gl.uniform2f(uniforms.pointer,paused?0:pointerX,paused?0:pointerY);gl.drawArrays(gl.POINTS,0,cols*rows);
 if(!document.hidden&&(!paused||Math.abs(target-mode)>.001))frame=requestAnimationFrame(draw);
 }
 function start(){if(!frame&&!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}}
 function resize(){const d=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(innerWidth*d);canvas.height=Math.round(innerHeight*d);gl.viewport(0,0,canvas.width,canvas.height);start();}
 toggle.addEventListener('click',()=>{paused=!paused;updateToggle();start();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;updateToggle();start();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
 window.addEventListener('hashchange',start);window.addEventListener('scenechange',start);window.addEventListener('resize',resize,{passive:true});
 updateToggle();resize();
})();
