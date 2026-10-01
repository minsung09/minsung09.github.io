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
let routeToken = 0, activeProject = null;
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
