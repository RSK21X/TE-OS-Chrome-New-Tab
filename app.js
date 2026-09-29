(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches, pad=n=>String(n).padStart(2,'0');
const store={get(k,d){try{const v=localStorage.getItem('te01.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('te01.'+k,JSON.stringify(v))}catch(e){}},clear(){try{Object.keys(localStorage).filter(x=>x.startsWith('te01.')).forEach(x=>localStorage.removeItem(x))}catch(e){}}};

/* ---------------- i18n ---------------- */
const DICT={
 en:{model:'Dashboard · Model 01',link:'LINK',sys:'SYS',uptime:'UPTIME',pwr:'PWR',setup:'Setup',
  search_tag:'Search',shortcuts_tag:'Shortcuts',weather_tag:'Weather',calendar_tag:'Calendar',
  query_out:'Query out',slots:'slots',sync:'SYNC',edit:'Edit',done:'Done',today:'Today',reset:'Reset',
  stored:'Stored locally',lbl_engine:'Engine',lbl_location:'Location',lbl_units:'Units',lbl_clock:'Clock',
  lbl_theme:'Theme',lbl_callsign:'Call sign',ph_search:'Type to search the web…',ph_loc:'Search any city…',
  ph_name:'Name',geo_hint:'Powered by Open-Meteo geocoding',geo_none:'No matches',geo_err:'Lookup failed',
  hint_focus:'focus search',hint_launch:'launch slot',hint_release:'release',hi:'HI',lo:'LO',wind:'WIND',
  now:'NOW',feels:'feels',upd:'UPD',syncing:'SYNC…',offline:'OFFLINE',nodata:'NO DATA',stale:'CACHE',
  theme_light:'LGT',theme_dark:'DK',theme_bone:'Bone',theme_graphite:'Graphite',new_site:'New site',
  locate:'Find a station',lang_btn:'EN',lang_tip:'Switch to 中文',tip_unit:'Temperature unit',tip_clock:'Clock format',
  greet:{still:'Still up',morning:'Good morning',noon:'Good afternoon',afternoon:'Good day',evening:'Good evening'}},
 zh:{model:'仪表盘 · 型号 01',link:'链路',sys:'系统',uptime:'运行',pwr:'电源',setup:'设置',
  search_tag:'搜索',shortcuts_tag:'快捷方式',weather_tag:'天气',calendar_tag:'日历',
  query_out:'查询发出',slots:'槽位',sync:'同步',edit:'编辑',done:'完成',today:'今天',reset:'重置',
  stored:'本地保存',lbl_engine:'引擎',lbl_location:'位置',lbl_units:'单位',lbl_clock:'制式',
  lbl_theme:'主题',lbl_callsign:'呼号',ph_search:'输入以搜索网页…',ph_loc:'搜索任意城市…',
  ph_name:'名称',geo_hint:'由 Open-Meteo 地理编码提供',geo_none:'无匹配',geo_err:'查询失败',
  hint_focus:'聚焦搜索',hint_launch:'启动槽位',hint_release:'退出',hi:'最高',lo:'最低',wind:'风速',
  now:'现在',feels:'体感',upd:'更新',syncing:'同步…',offline:'离线',nodata:'无数据',stale:'缓存',
  theme_light:'明',theme_dark:'暗',theme_bone:'骨白',theme_graphite:'石墨',new_site:'新站点',
  locate:'查找站点',lang_btn:'中',lang_tip:'Switch to English',tip_unit:'温度单位',tip_clock:'时间制式',
  greet:{still:'还没睡',morning:'早上好',noon:'中午好',afternoon:'下午好',evening:'晚上好'}}
};
const t=k=>DICT[S.lang][k]??k;
const MONTH_FULL_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_FULL_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const WEEK_FULL_ZH=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
/* matrix hardware font stays latin in both languages */
const MON_ABBR=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const WK_ABBR=['SUN','MON','TUE','WED','THU','FRI','SAT'];
const WK_LET=['S','M','T','W','T','F','S'];
const COND={clear:['Clear sky','晴'],partly:['Partly cloudy','局部多云'],cloud:['Overcast','阴'],rain:['Rain','有雨'],drizzle:['Drizzle','毛毛雨'],snow:['Snow','有雪'],fog:['Fog','雾'],storm:['Thunderstorm','雷暴']};
const cLabel=k=>{const c=COND[k]||COND.cloud;return S.lang==='zh'?c[1]:c[0]};

/* ---------------- state ---------------- */
const DEF={engine:'google',theme:'light',unit:'C',clock:'24',lang:'en',cs:'Aiko'};
const PRESETS=[
 {key:'tokyo',name:'Tokyo',ref:'RJTT',lat:35.68,lon:139.69},
 {key:'stockholm',name:'Stockholm',ref:'ESSA',lat:59.33,lon:18.07},
 {key:'berlin',name:'Berlin',ref:'EDDF',lat:52.36,lon:13.40},
 {key:'seoul',name:'Seoul',ref:'RKSI',lat:37.46,lon:126.44},
 {key:'newyork',name:'New York',ref:'KJFK',lat:40.64,lon:-73.78},
 {key:'losangeles',name:'Los Angeles',ref:'KLAX',lat:33.94,lon:-118.4}];
const STATIC={
 tokyo:{cond:'partly',t:24,feels:23,hi:27,lo:19,wind:12,hrs:[24,25,27,26,24,22],ic:['partly','sun','sun','cloud','partly','clear']},
 stockholm:{cond:'rain',t:9,feels:7,hi:11,lo:6,wind:24,hrs:[9,10,10,9,8,7],ic:['rain','rain','cloud','cloud','rain','cloud']},
 berlin:{cond:'cloud',t:14,feels:13,hi:17,lo:9,wind:16,hrs:[14,16,17,16,14,12],ic:['cloud','cloud','partly','cloud','cloud','clear']},
 seoul:{cond:'clear',t:18,feels:18,hi:21,lo:14,wind:9,hrs:[18,20,21,20,18,16],ic:['clear','clear','sun','partly','clear','clear']},
 newyork:{cond:'partly',t:16,feels:15,hi:19,lo:11,wind:21,hrs:[16,18,19,18,16,14],ic:['partly','cloud','sun','partly','clear','cloud']},
 losangeles:{cond:'clear',t:28,feels:29,hi:32,lo:20,wind:8,hrs:[28,30,32,31,28,25],ic:['clear','sun','sun','clear','clear','partly']}};
const DEFAULT_LOC={...PRESETS[0]};
const S={engine:store.get('engine',DEF.engine),theme:store.get('theme',DEF.theme),unit:store.get('unit',DEF.unit),
 clock:store.get('clock',DEF.clock),lang:store.get('lang',DEF.lang),cs:store.get('cs',DEF.cs),
 loc:store.get('loc',null)||{...DEFAULT_LOC},slots:store.get('slots',null)};
const save=k=>store.set(k,S[k]);
if(!Array.isArray(S.slots))S.slots=DEF_SLOTS_INIT();
function DEF_SLOTS_INIT(){return[
 {n:'Gmail',u:'https://mail.google.com'},{n:'YouTube',u:'https://youtube.com'},{n:'GitHub',u:'https://github.com'},
 {n:'Drive',u:'https://drive.google.com'},{n:'Notion',u:'https://notion.so'},{n:'ChatGPT',u:'https://chatgpt.com'},
 {n:'Figma',u:'https://figma.com'},{n:'Maps',u:'https://maps.google.com'},{n:'Wikipedia',u:'https://wikipedia.org'}];}

/* ---------------- shortcuts ---------------- */
const PAL=['#E5432F','#E02F2F','#3B3B3B','#F0A700','#1F1E1C','#12A882','#D64A2B','#2E8B57','#1467E6','#7A4BD1','#B4286A','#0E8FA8'];
const norm=value=>{
 const raw=String(value??'').trim();if(!raw)return'';
 const candidate=/^https?:\/\//i.test(raw)?raw:'https://'+raw;
 try{const parsed=new URL(candidate);return ['http:','https:'].includes(parsed.protocol)&&parsed.hostname?parsed.href:'';}catch(e){return'';}
};
const host=value=>{const safe=norm(value);if(!safe)return String(value??'').trim().replace(/^https?:\/\//i,'');try{return new URL(safe).hostname.replace(/^www\./,'');}catch(e){return'';}};
const favicon=value=>{const safe=norm(value);if(!safe)return'';return`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(new URL(safe).origin)}&sz=64`;};
S.slots=S.slots.slice(0,12).map((s,i)=>({n:String(s?.n??`Site ${i+1}`).slice(0,18),u:norm(s?.u??'')}));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let editing=false;
function renderTiles(){
 const c=$('#tiles');
 if(!editing){
  c.innerHTML=S.slots.map((s,i)=>{
   const url=norm(s.u),name=String(s.n||'').trim()||host(s.u)||t('new_site');
   return `<a class="tile" style="--tint:${PAL[i%PAL.length]}" href="${esc(url||'#')}" aria-disabled="${!url}" target="_blank" rel="noopener" data-i="${i}">
   <span class="idx">${pad(i+1)}</span>
   <span class="ico"><span class="site-mark" aria-hidden="true">${esc(name.slice(0,1).toUpperCase())}</span>${url?`<img class="site-favicon" src="${esc(favicon(url))}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:''}</span>
   <span class="nm">${esc(name)}</span><span class="dm">${esc(host(s.u))}</span></a>`;
  }).join('');
 }else{
  let h=S.slots.map((s,i)=>`<div class="tile ed" data-i="${i}">
   <button class="rm" data-rm="${i}" title="✕" aria-label="Remove ${esc(s.n)}">✕</button>
   <div class="erow">
    <input data-f="n" data-i="${i}" value="${esc(s.n)}" placeholder="${esc(t('ph_name'))}" maxlength="18" aria-label="Shortcut name">
    <input data-f="u" data-i="${i}" value="${esc(s.u)}" placeholder="https://…" spellcheck="false" aria-label="Shortcut address">
    <span class="ehost">${esc(host(s.u))||'—'}</span></div></div>`).join('');
  if(S.slots.length<12)h+=`<button class="tile add" id="addSlot" title="${esc(t('new_site'))}" aria-label="${esc(t('new_site'))}">+</button>`;
  c.innerHTML=h;
 }
 $('#slotCount').textContent=S.slots.length+' '+t('slots');
}
$('#tiles').addEventListener('click',e=>{
 const shortcut=e.target.closest('a.tile[data-i]');if(shortcut&&shortcut.getAttribute('aria-disabled')==='true'){e.preventDefault();return;}
 const rm=e.target.closest('[data-rm]');if(rm){S.slots.splice(+rm.dataset.rm,1);save('slots');renderTiles();return;}
 if(e.target.closest('#addSlot')){S.slots.push({n:t('new_site'),u:''});save('slots');renderTiles();const ins=$$('#tiles input[data-f=n]');ins[ins.length-1]?.select();}
});
$('#tiles').addEventListener('error',e=>{if(e.target.matches('.site-favicon'))e.target.hidden=true;},true);
$('#tiles').addEventListener('input',e=>{const el=e.target;if(!el.dataset.f)return;const i=+el.dataset.i;
 if(el.dataset.f==='n')S.slots[i].n=el.value;else S.slots[i].u=el.value;save('slots');
 const he=el.closest('.ed')?.querySelector('.ehost');if(he)he.textContent=host(S.slots[i].u)||'—';});
$('#tiles').addEventListener('focusout',e=>{if(e.target.dataset.f==='u'){const i=+e.target.dataset.i;S.slots[i].u=norm(e.target.value);e.target.value=S.slots[i].u;save('slots');const he=e.target.closest('.ed')?.querySelector('.ehost');if(he)he.textContent=host(S.slots[i].u)||'—';}});
function updateEditBtn(){$('#editLbl').textContent=editing?t('done'):t('edit');$('#editBtn').classList.toggle('on',editing);}
$('#editBtn').onclick=()=>{editing=!editing;updateEditBtn();renderTiles();};

/* ---------------- weather ---------------- */
let live=null,liveCache={},wxStatus='syncing',wxTime='--:--',tempAnim;
const cv=c=>S.unit==='C'?Math.round(c):Math.round(c*9/5+32);
const locKey=()=>S.loc.lat+','+S.loc.lon;
function wmo(c){if(c===0)return'clear';if(c===1)return'clear';if(c===2)return'partly';if(c===3)return'cloud';
 if(c===45||c===48)return'fog';if(c>=51&&c<=57)return'drizzle';if(c>=61&&c<=67)return'rain';if(c>=71&&c<=77)return'snow';
 if(c>=80&&c<=82)return'rain';if(c===85||c===86)return'snow';if(c>=95)return'storm';return'cloud';}
function getWX(){const L=S.loc,k=locKey();
 if(live&&live.key===k)return{...L,...live};
 if(L.key&&STATIC[L.key])return{...L,...STATIC[L.key]};
 if(liveCache[k])return{...L,...liveCache[k]};
 return{...L,empty:true};}
async function loadWeather(){
 live=null;wxStatus='syncing';$('#wxUpd').textContent=t('syncing');
 const u=`https://api.open-meteo.com/v1/forecast?latitude=${S.loc.lat}&longitude=${S.loc.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
 try{
  const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),8000);
  const r=await fetch(u,{signal:ctrl.signal});clearTimeout(to);if(!r.ok)throw 0;const d=await r.json();
  const c=d.current,kind=wmo(c.weather_code);
  const base=(c.time||'').slice(0,13);let idx=d.hourly.time.findIndex(x=>x.slice(0,13)===base);if(idx<0)idx=new Date().getHours();
  const hs=[],ic=[];for(let i=0;i<6;i++){const j=Math.min(idx+i,d.hourly.time.length-1);hs.push(Math.round(d.hourly.temperature_2m[j]));ic.push(wmo(d.hourly.weather_code[j]));}
  live={key:locKey(),cond:kind,t:Math.round(c.temperature_2m),feels:Math.round(c.apparent_temperature),hi:Math.round(d.daily.temperature_2m_max[0]),lo:Math.round(d.daily.temperature_2m_min[0]),wind:Math.round(c.wind_speed_10m),hrs:hs,ic};
  liveCache[live.key]=live;wxStatus='ok';const n=new Date();wxTime=pad(n.getHours())+':'+pad(n.getMinutes());
 }catch(e){
  if(liveCache[locKey()]){live={...liveCache[locKey()],key:locKey()};wxStatus='stale';}
  else wxStatus=(S.loc.key&&STATIC[S.loc.key])?'offline':'empty';
 }
 renderWX(wxStatus==='ok');
}
function icon(kind,size){
 const ray=(cx,cy,r,n)=>{let s='';for(let i=0;i<n;i++){const a=i*(360/n)*Math.PI/180;s+=`<line x1="${(cx+Math.cos(a)*(r+3)).toFixed(1)}" y1="${(cy+Math.sin(a)*(r+3)).toFixed(1)}" x2="${(cx+Math.cos(a)*(r+8)).toFixed(1)}" y2="${(cy+Math.sin(a)*(r+8)).toFixed(1)}"/>`;}return s;};
 const sun=(cx,cy,r,col)=>`<g stroke="${col}" stroke-width="3.4" stroke-linecap="round">${ray(cx,cy,r,8)}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
 const cloud=(dx,dy,sc,col)=>`<g fill="${col}" transform="translate(${dx} ${dy}) scale(${sc})"><circle cx="22" cy="34" r="11"/><circle cx="38" cy="36" r="9"/><circle cx="30" cy="27" r="11"/><rect x="11" y="35" width="35" height="11" rx="5.5"/></g>`;
 const AC='var(--accent)',CK='var(--ink2)';let body='';
 if(kind==='clear')body=sun(32,32,11,AC);
 else if(kind==='partly')body=sun(42,21,8,AC)+cloud(2,8,.92,CK);
 else if(kind==='cloud')body=cloud(2,4,1.05,CK);
 else if(kind==='rain'||kind==='drizzle')body=cloud(2,-2,1,CK)+`<g stroke="${CK}" stroke-width="3.4" stroke-linecap="round"><line class="drop" x1="22" y1="48" x2="19" y2="56"/><line class="drop" x1="32" y1="48" x2="29" y2="56"/><line class="drop" x1="42" y1="48" x2="39" y2="56"/></g>`;
 else if(kind==='fog')body=cloud(2,-2,1,CK)+`<g stroke="${CK}" stroke-width="3.2" stroke-linecap="round"><line x1="16" y1="50" x2="46" y2="50"/><line x1="20" y1="57" x2="42" y2="57"/></g>`;
 else if(kind==='snow')body=cloud(2,-2,1,CK)+`<g fill="${CK}"><circle class="fl" cx="22" cy="52" r="2.4"/><circle class="fl" cx="32" cy="56" r="2.4"/><circle class="fl" cx="42" cy="52" r="2.4"/></g>`;
 else if(kind==='storm')body=cloud(2,-3,1,CK)+`<path class="bolt" d="M33 44l-8 11h6l-3 9 11-13h-6z" fill="${AC}"/>`;
 else body=cloud(2,4,1.05,CK);
 return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" style="display:block;flex:none">${body}</svg>`;
}
function renderWX(animate=true){
 const w=getWX();
 $('#wxCity').textContent=w.name;
 $('#wxCode').textContent=`${w.ref||'·'} · ${(+w.lat).toFixed(2)} / ${(+w.lon).toFixed(2)}`;
 $('#mCity').textContent=(w.name||'').toUpperCase();
 const el=$('#wxTemp');
 if(w.empty){
  clearInterval(tempAnim);el.innerHTML='--<sup>°</sup>';
  $('#wxIcon').innerHTML=icon('cloud',74);
  $('#wxCond').textContent=t('nodata');
  $('#wxHi').textContent='—';$('#wxLo').textContent='—';$('#wxWind').textContent='—';
  $('#wxHours').innerHTML='';$('#wxUpd').textContent=t('nodata');return;
 }
 $('#wxCond').textContent=`${cLabel(w.cond)} · ${t('feels')} ${cv(w.feels)}°`;
 $('#wxHi').textContent=cv(w.hi)+'°';$('#wxLo').textContent=cv(w.lo)+'°';$('#wxWind').textContent=w.wind+' KM/H';
 $('#wxIcon').innerHTML=icon(w.cond,74);
 const target=cv(w.t),from=parseInt(el.textContent)||target;clearInterval(tempAnim);
 if(!animate||RM)el.innerHTML=target+'<sup>°</sup>';
 else{let i=0;tempAnim=setInterval(()=>{i++;el.innerHTML=Math.round(from+(target-from)*(i/14))+'<sup>°</sup>';if(i>=14)clearInterval(tempAnim)},22);}
 const now=new Date(),mn=Math.min(...w.hrs),mx=Math.max(...w.hrs)||1;
 $('#wxHours').innerHTML=w.hrs.map((tt,idx)=>{const h=(now.getHours()+idx)%24,hgt=8+Math.round(((tt-mn)/((mx-mn)||1))*24);
  return `<div class="hr${idx===0?' now':''}"><span class="ht">${idx===0?t('now'):pad(h)}</span><span class="hi">${icon(w.ic[idx],18)}</span><span class="bar" style="height:${hgt}px"></span><span class="hv dsp">${cv(tt)}°</span></div>`;}).join('');
 const pre=wxStatus==='stale'?t('stale'):wxStatus==='offline'?t('offline'):t('upd');
 $('#wxUpd').textContent=pre+' '+wxTime;
}

/* ---------------- geocoding ---------------- */
let geoAbort=null,geoTimer=null,geoItems=[],geoHL=-1;
function closeGeo(){$('#geoList').classList.remove('show');geoHL=-1;}
function renderGeo(msg){
 const g=$('#geoList');
 if(msg){g.innerHTML=`<div class="geomsg">${esc(msg)}</div>`;g.classList.add('show');return;}
 if(!geoItems.length){g.classList.remove('show');return;}
 g.innerHTML=geoItems.map((r,i)=>`<button class="geoitem${i===geoHL?' hl':''}" data-gi="${i}"><b>${esc(r.name)}</b><span>${esc([r.admin1,r.country].filter(Boolean).join(' · '))||esc(r.country_code||'')} · ${(r.latitude).toFixed(2)}/${(r.longitude).toFixed(2)}</span></button>`).join('');
 g.classList.add('show');
}
async function runGeo(q){
 if(geoAbort)geoAbort.abort();
 const ctrl=new AbortController();geoAbort=ctrl;
 try{
  const u=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=${S.lang==='zh'?'zh':'en'}&format=json`;
  const r=await fetch(u,{signal:ctrl.signal});if(!r.ok)throw 0;const d=await r.json();
  geoItems=(d.results||[]).slice(0,6);geoHL=geoItems.length?0:-1;
  if(!geoItems.length)renderGeo(t('geo_none'));else renderGeo();
 }catch(e){if(e.name==='AbortError')return;geoItems=[];renderGeo(t('geo_err'));}
}
$('#locInput').addEventListener('input',e=>{
 const q=e.target.value.trim();clearTimeout(geoTimer);
 if(q.length<2){closeGeo();geoItems=[];return;}
 geoTimer=setTimeout(()=>runGeo(q),350);
});
$('#locInput').addEventListener('keydown',e=>{
 if(e.key==='ArrowDown'){e.preventDefault();if(geoItems.length){geoHL=(geoHL+1)%geoItems.length;renderGeo();}}
 else if(e.key==='ArrowUp'){e.preventDefault();if(geoItems.length){geoHL=(geoHL-1+geoItems.length)%geoItems.length;renderGeo();}}
 else if(e.key==='Enter'){e.preventDefault();if(geoItems.length){pickGeo(geoHL<0?0:geoHL);}}
 else if(e.key==='Escape'){closeGeo();}
});
$('#geoList').addEventListener('click',e=>{const b=e.target.closest('[data-gi]');if(b)pickGeo(+b.dataset.gi);});
function pickGeo(i){const r=geoItems[i];if(!r)return;
 S.loc={key:null,name:r.name,ref:r.country_code||'',lat:r.latitude,lon:r.longitude};save('loc');
 $('#locInput').value=S.loc.name;closeGeo();applyAll();loadWeather();}
function renderChips(){
 $('#presetChips').innerHTML=PRESETS.map(p=>`<button class="chipbtn${S.loc.key===p.key?' on':''}" data-pk="${p.key}">${esc(p.name)}</button>`).join('');
}
$('#presetChips').addEventListener('click',e=>{const b=e.target.closest('[data-pk]');if(!b)return;
 const p=PRESETS.find(x=>x.key===b.dataset.pk);S.loc={...p};save('loc');$('#locInput').value=p.name;closeGeo();applyAll();loadWeather();});
$('#locateBtn').onclick=()=>{openDrawer();const i=$('#locInput');i.focus();i.select();};

/* ---------------- clock ---------------- */
const t0=Date.now();
const isoWeek=d=>{const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()+3-(x.getDay()+7)%7);const f=new Date(x.getFullYear(),0,4);return 1+Math.round(((x-f)/86400000-3+(f.getDay()+7)%7)/7)};
function tick(){const d=new Date();let h=d.getHours();if(S.clock==='12')h=h%12||12;
 $('#clkH').textContent=S.clock==='12'?String(h):pad(d.getHours());$('#clkM').textContent=pad(d.getMinutes());$('#clkS').textContent=pad(d.getSeconds());
 $('#railClock').textContent=pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
 const W=S.lang==='zh'?['周','一','二','三','四','五','六']:WEEK_FULL_EN.map(x=>x.slice(0,3).toUpperCase());
 const M=S.lang==='zh'?(d.getMonth()+1)+'月':MONTH_FULL_EN[d.getMonth()].slice(0,3).toUpperCase();
 $('#mDate').textContent=S.lang==='zh'?`${d.getFullYear()}年${M}${d.getDate()}日 ${W[d.getDay()]}`:`${W[d.getDay()]} ${d.getDate()} ${M} ${d.getFullYear()}`;
 $('#mWeek').textContent=(S.lang==='zh'?'第':'WEEK ')+pad(isoWeek(d))+(S.lang==='zh'?'周':'');
 $('#sysDate').textContent=d.getFullYear()+'.'+pad(d.getMonth()+1)+'.'+pad(d.getDate());
 const H=d.getHours(),g=DICT[S.lang].get?null:DICT[S.lang].greet;
 const bucket=H<5?'still':H<11?'morning':H<14?'noon':H<19?'afternoon':'evening';
 $('#mGreet').innerHTML=`${g[bucket]}<span>, ${esc(S.cs)}</span><i>.</i>`;
 const up=Math.floor((Date.now()-t0)/1000);$('#uptime').textContent=pad(Math.floor(up/3600))+':'+pad(Math.floor(up/60)%60)+':'+pad(up%60);
}

/* ---------------- dot-matrix LCD (latin hardware font) ---------------- */
const F={'0':'01110 10001 10011 10101 11001 10001 01110','1':'00100 01100 00100 00100 00100 00100 01110','2':'01110 10001 00001 00010 00100 01000 11111','3':'11111 00010 00100 00010 00001 10001 01110','4':'00010 00110 01010 10010 11111 00010 00010','5':'11111 10000 11110 00001 00001 10001 01110','6':'00110 01000 10000 11110 10001 10001 01110','7':'11111 00001 00010 00100 01000 01000 01000','8':'01110 10001 10001 01110 10001 10001 01110','9':'01110 10001 10001 01111 00001 00010 01100',
 'A':'01110 10001 10001 11111 10001 10001 10001','B':'11110 10001 10001 11110 10001 10001 11110','C':'01110 10001 10000 10000 10000 10001 01110','D':'11100 10010 10001 10001 10001 10010 11100','E':'11111 10000 10000 11110 10000 10000 11111','F':'11111 10000 10000 11110 10000 10000 10000','G':'01110 10001 10000 10111 10001 10001 01111','H':'10001 10001 10001 11111 10001 10001 10001','I':'01110 00100 00100 00100 00100 00100 01110','J':'00111 00010 00010 00010 00010 10010 01100','K':'10001 10010 10100 11000 10100 10010 10001','L':'10000 10000 10000 10000 10000 10000 11111','M':'10001 11011 10101 10101 10001 10001 10001','N':'10001 11001 10101 10011 10001 10001 10001','O':'01110 10001 10001 10001 10001 10001 01110','P':'11110 10001 10001 11110 10000 10000 10000','Q':'01110 10001 10001 10001 10101 10010 01101','R':'11110 10001 10001 11110 10100 10010 10001','S':'01111 10000 10000 01110 00001 00001 11110','T':'11111 00100 00100 00100 00100 00100 00100','U':'10001 10001 10001 10001 10001 10001 01110','V':'10001 10001 10001 10001 10001 01010 00100','W':'10001 10001 10001 10101 10101 11011 10001','X':'10001 10001 01010 00100 01010 10001 10001','Y':'10001 10001 01010 00100 00100 00100 00100','Z':'11111 00001 00010 00100 01000 10000 11111',' ':'00000 00000 00000 00000 00000 00000 00000','-':'00000 00000 00000 11111 00000 00000 00000','.':'00000 00000 00000 00000 00000 00000 00100'};
const BONE='rgba(239,238,233,.82)',DIM='rgba(239,238,233,.40)',FAINT='rgba(239,238,233,.16)',OFF='rgba(239,238,233,.05)',WEL='rgba(255,109,40,.55)';
function accent(){return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#FF4D00'}
function setup(c){const dpr=devicePixelRatio||1,W=c.clientWidth,H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);return{x,W,H}}
function dot(x,px,py,r,c){x.beginPath();x.arc(px,py,r,0,7);x.fillStyle=c;x.fill()}
function lattice(x,W,H,p,r){for(let yy=p/2;yy<H;yy+=p)for(let xx=p/2;xx<W;xx+=p)dot(x,xx,yy,r,OFF)}
function glyph(x,ch,ox,oy,p,r,c){const g=F[ch]||F[' '];const rows=g.split(' ');for(let ry=0;ry<7;ry++){const row=rows[ry]||'00000';for(let cx=0;cx<5;cx++)if(row[cx]==='1')dot(x,ox+cx*p,oy+ry*p,r,c)}}
function text(x,str,ox,oy,p,r,c,ls=1){let cx=ox;for(const ch of str.toUpperCase()){glyph(x,ch,cx,oy,p,r,c);cx+=(5+ls)*p}return cx-ox-ls*p}
function strW(str,p,ls=1){return str.length?(str.length*5+(str.length-1)*ls)*p:0}
const TODAY=new Date();TODAY.setHours(0,0,0,0);
let view=new Date(TODAY.getFullYear(),TODAY.getMonth(),1),sel=new Date(TODAY),ML=null;
function drawHero(){const c=$('#heroCal');const{x,W,H}=setup(c);lattice(x,W,H,Math.max(4,W*0.022),1.1);
 const np=Math.max(5,Math.min(9,W*0.021)),nr=np*0.34,day=String(TODAY.getDate());
 text(x,day,W*0.04,(H-7*np)/2,np,nr,BONE);
 const tp=Math.max(2.6,Math.min(4,W*0.0115)),tr=tp*0.36,rx=W*0.04+strW(day,np)+np*2.2;
 text(x,WK_ABBR[TODAY.getDay()],rx,H*0.20,tp,tr,accent());
 text(x,MON_ABBR[TODAY.getMonth()]+' '+TODAY.getFullYear(),rx,H*0.20+7*tp+tp*2.4,tp,tr,DIM);
 c.setAttribute('aria-label',`${WK_ABBR[TODAY.getDay()]} ${TODAY.getDate()} ${MON_ABBR[TODAY.getMonth()]} ${TODAY.getFullYear()}`);
}
function drawMonth(){const c=$('#monthCal');const W=c.clientWidth,padX=4,padTop=4;
 const p=Math.max(2.4,(W-padX*2)/89),r=p*0.36,cellW=11*p,cellH=7*p,gapX=2*p,gapY=2*p,headH=7*p;
 const first=new Date(view.getFullYear(),view.getMonth(),1),start=first.getDay(),dim=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
 const weeks=Math.ceil((start+dim)/7),H=padTop+headH+gapY*2+weeks*(cellH+gapY);
 c.style.height=H+'px';const{x}=setup(c);lattice(x,W,H,p,r);
 ML={p,r,padX,padTop,cellW,cellH,gapX,gapY,headH,start,dim,dates:[]};
 for(let col=0;col<7;col++){const lw=strW(WK_LET[col],p,0),lx=padX+col*(cellW+gapX)+(cellW-lw)/2;text(x,WK_LET[col],lx,padTop,p,r,(col===0||col===6)?WEL:DIM,0)}
 const oy0=padTop+headH+gapY*2;
 for(let i=0;i<weeks*7;i++){const col=i%7,row=(i/7)|0,dn=i-start+1;let dt,out=false;
  if(dn<1){dt=new Date(view.getFullYear(),view.getMonth()-1,dn);out=true}else if(dn>dim){dt=new Date(view.getFullYear(),view.getMonth()+1,dn-dim);out=true}else dt=new Date(view.getFullYear(),view.getMonth(),dn);
  ML.dates[i]=dt;
  const cx=padX+col*(cellW+gapX),cy=oy0+row*(cellH+gapY);
  const isT=dt.toDateString()===TODAY.toDateString(),isS=dt.toDateString()===sel.toDateString();
  const s=String(dn),sw=strW(s,p,1),tx=cx+(cellW-sw)/2;
  const col2=isT?accent():out?FAINT:(dt.getDay()===0||dt.getDay()===6)?'rgba(239,238,233,.55)':BONE;
  text(x,s,tx,cy,p,r,col2);
  if(isT||isS){const rc=isT?accent():'rgba(239,238,233,.7)',x0=cx-p,x1=cx+cellW,y0=cy-p,y1=cy+cellH;
   for(let xx=x0;xx<=x1;xx+=p){dot(x,xx,y0,r*.8,rc);dot(x,xx,y1,r*.8,rc)}
   for(let yy=y0;yy<=y1;yy+=p){dot(x,x0,yy,r*.8,rc);dot(x,x1,yy,r*.8,rc)}}
 }
}
function renderCaption(){const d=TODAY;
 $('#calCaption').textContent=S.lang==='zh'
  ? `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 · ${WEEK_FULL_ZH[d.getDay()]}`
  : `${WEEK_FULL_EN[d.getDay()]}, ${MONTH_FULL_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function drawLCD(){drawHero();drawMonth()}
$('#monthCal').addEventListener('click',e=>{if(!ML)return;const rc=e.currentTarget.getBoundingClientRect();
 const col=Math.floor((e.clientX-rc.left-ML.padX)/(ML.cellW+ML.gapX)),row=Math.floor((e.clientY-rc.top-(ML.padTop+ML.headH+ML.gapY*2))/(ML.cellH+ML.gapY));
 if(col<0||col>6||row<0)return;const i=row*7+col;if(i<0||i>=ML.dates.length)return;const d=ML.dates[i];sel=new Date(d);
 if(d.getMonth()!==view.getMonth()||d.getFullYear()!==view.getFullYear())view=new Date(d.getFullYear(),d.getMonth(),1);drawMonth();});
$('#prevM').onclick=()=>{view.setMonth(view.getMonth()-1);drawMonth()};
$('#nextM').onclick=()=>{view.setMonth(view.getMonth()+1);drawMonth()};
$('#todayBtn').onclick=()=>{view=new Date(TODAY.getFullYear(),TODAY.getMonth(),1);sel=new Date(TODAY);drawMonth()};

/* ---------------- segmented + apply ---------------- */
function placeInd(seg){const on=seg.querySelector('button.on');if(!on)return;const ind=seg.querySelector('.ind');ind.style.width=on.offsetWidth+'px';ind.style.transform=`translateX(${on.offsetLeft-3}px)`}
function syncSegs(){$$('[data-group]').forEach(seg=>{const g=seg.dataset.group;$$('button',seg).forEach(b=>b.classList.toggle('on',b.dataset.val===String(S[g])));placeInd(seg)})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-group] button');if(!b)return;const g=b.parentElement.dataset.group;S[g]=b.dataset.val;save(g);applyAll();});
const ENG={google:{c:'#FF4D00',d:'#C93B00',r:'rgba(255,77,0,.15)',n:'GOOGLE',u:'https://www.google.com/search?q='},bing:{c:'#1467E6',d:'#0B4AA8',r:'rgba(20,103,230,.16)',n:'BING',u:'https://www.bing.com/search?q='}};
function applyLang(){const d=DICT[S.lang];document.documentElement.lang=S.lang==='zh'?'zh-CN':'en';
 $$('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(d[k]!=null)e.textContent=d[k];});
 $$('[data-i18n-ph]').forEach(e=>{const k=e.dataset.i18nPh;if(d[k]!=null)e.placeholder=d[k];});
 $$('[data-i18n-title]').forEach(e=>{const k=e.dataset.i18nTitle;if(d[k]!=null)e.title=d[k];});
 $('#langBtn').lastElementChild.textContent=d.lang_btn;
 if(document.activeElement!==$('#locInput'))$('#locInput').value=S.loc.name;
 renderChips();renderTiles();updateEditBtn();renderWX(false);drawLCD();renderCaption();tick();
}
function applyAll(){document.documentElement.dataset.theme=S.theme;const e=ENG[S.engine],rs=document.documentElement.style;
 rs.setProperty('--eng',e.c);rs.setProperty('--eng-d',e.d);rs.setProperty('--eng-ring',e.r);$('#goBtn').textContent=e.n;
 $('#unitBtn').firstElementChild.textContent='°'+S.unit;$('#fmtBtn').firstElementChild.textContent=S.clock+'H';
 $('#csInput').value=S.cs;syncSegs();applyLang();}

/* ---------------- search ---------------- */
const qEl=$('#q');qEl.addEventListener('input',()=>{$('#cnt').textContent=pad(qEl.value.length).slice(-2)+' CH'});
$('#searchForm').addEventListener('submit',ev=>{ev.preventDefault();const v=qEl.value.trim();if(!v){shake();return}window.open(ENG[S.engine].u+encodeURIComponent(v),'_blank','noopener')});
function shake(){if(RM)return;$('.sbx').animate([{transform:'translateX(0)'},{transform:'translateX(-7px)'},{transform:'translateX(6px)'},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],{duration:320,easing:'ease-out'});qEl.focus()}

/* ---------------- controls ---------------- */
$('#langBtn').onclick=()=>{S.lang=S.lang==='en'?'zh':'en';save('lang');applyAll();};
$('#themeBtn').onclick=()=>{S.theme=S.theme==='light'?'dark':'light';save('theme');applyAll()};
$('#unitBtn').onclick=()=>{S.unit=S.unit==='C'?'F':'C';save('unit');applyAll()};
$('#fmtBtn').onclick=()=>{S.clock=S.clock==='24'?'12':'24';save('clock');applyAll()};
$('#csInput').oninput=e=>{S.cs=e.target.value.trim()||'friend';save('cs');tick()};
$('#resetBtn').onclick=()=>{store.clear();Object.assign(S,DEF);S.loc={...DEFAULT_LOC};S.slots=DEF_SLOTS_INIT();editing=false;live=null;applyAll();loadWeather();};
const drawer=$('#drawer');
function openDrawer(){drawer.classList.add('open');$('#setBtn').setAttribute('aria-expanded',true);$('#setBtn').classList.add('on')}
$('#setBtn').onclick=e=>{e.stopPropagation();const o=drawer.classList.toggle('open');$('#setBtn').setAttribute('aria-expanded',o);$('#setBtn').classList.toggle('on',o)};
document.addEventListener('click',e=>{if(drawer.classList.contains('open')&&!drawer.contains(e.target)&&!e.target.closest('#setBtn')&&!e.target.closest('#locateBtn')){drawer.classList.remove('open');$('#setBtn').classList.remove('on');closeGeo()}});
document.addEventListener('keydown',e=>{const ty=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
 if(e.key==='/'&&!ty){e.preventDefault();qEl.focus();qEl.select()}
 if(e.key==='Escape'){drawer.classList.remove('open');$('#setBtn').classList.remove('on');closeGeo();qEl.blur()}
 if(!ty&&!editing&&/^[1-9]$/.test(e.key)){const s=S.slots[+e.key-1],url=s&&norm(s.u);if(s&&url){const tt=$(`.tile[data-i="${+e.key-1}"]`);if(tt){tt.style.transform='translateY(1px) scale(.97)';setTimeout(()=>tt.style.transform='',130)}window.open(url,'_blank','noopener')}}});
addEventListener('resize',()=>{$$('[data-group]').forEach(placeInd);drawLCD()});

/* ---------------- life ---------------- */
const meter=$('#meter');meter.innerHTML=Array.from({length:14},()=>'<i></i>').join('');const bars=$$('i',meter);
if(!RM){setInterval(()=>{let l=Math.random();bars.forEach((b,i)=>{l=l*.72+Math.random()*.28+(i<4?.06:0);b.style.height=(3+l*21).toFixed(0)+'px';b.classList.toggle('hot',l>.72)})},150);
 let sg=0;setInterval(()=>{sg=(sg+1)%5;$('#railSig').textContent='▮'.repeat(3+(sg%3))+'▯'.repeat(2-(sg%3<2?sg%3:0))||'▮▮'},3200);
 let raf=null;addEventListener('pointermove',e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=null;document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth*100).toFixed(1)+'%');document.documentElement.style.setProperty('--my',(e.clientY/innerHeight*100).toFixed(1)+'%')})},{passive:true})}
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.06,rootMargin:'0px 0px -40px'});
$$('[data-reveal]').forEach(el=>io.observe(el));

/* ---------------- boot ---------------- */
applyAll();tick();setInterval(tick,1000);loadWeather();
setTimeout(()=>$$('[data-group]').forEach(placeInd),120);
document.fonts&&document.fonts.ready.then(()=>{$$('[data-group]').forEach(placeInd);drawLCD()});
})();
