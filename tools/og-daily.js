// Draws today's share card (og-card.jpg) to match the living sky on the site:
// the year's colours, tonight's moon, the zodiac season and the holiday wax on the seal.
// Run: node tools/og-daily.js [YYYY-MM-DD]
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const ROOT=path.join(__dirname,'..');const seal=require('./seal.js');const rose=fs.readFileSync(path.join(__dirname,'rose.svgfrag'),'utf8');
const pad=n=>String(n).padStart(2,'0');const t=new Date();
const date=process.argv[2]||`${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),toHex=c=>'#'+c.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,k)=>{const A=hex(a),B=hex(b);return toHex(A.map((v,i)=>v+(B[i]-v)*k))};
const waxSeal=(svg,[o,i,m])=>{const map={'#d4504c':mix(o,'#ffffff',.22),'#a3222a':o,'#5e0d12':mix(o,'#000000',.45),'#c33a38':mix(i,'#ffffff',.08),'#8f1a20':mix(i,'#000000',.22),
  '#7a1520':mix(o,'#000000',.25),'#8f1d27':mix(o,'#000000',.1),'#6e1016':mix(o,'#000000',.32),'#f0a49a':m,'#e2675e':mix(i,m,.5),'#3a0508':mix(o,'#000000',.6)};
  return svg.replace(/#[0-9a-f]{6}/gi,c=>map[c.toLowerCase()]||c)};
const SYN=29.530588853;
const moonPath=(cx,cy,r,age)=>{const waxing=age<SYN/2,k=Math.cos(2*Math.PI*age/SYN),rx=Math.abs(k)*r,cres=k>0,o=waxing?1:0,tt=waxing?(cres?0:1):(cres?1:0);
  return `M${cx} ${cy-r} A${r} ${r} 0 0 ${o} ${cx} ${cy+r} A${rx.toFixed(2)} ${r} 0 0 ${tt} ${cx} ${cy-r}Z`};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:800}});
  await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
  await p.goto('file://'+path.join(ROOT,'index.html')+`?date=${date}&hour=17`);await p.waitForFunction(()=>window.__sky&&window.__sky.wax,null,{timeout:20000});await p.waitForTimeout(600);
  const sky=await p.evaluate(()=>({...window.__sky,key:window.__wall.key,stamp:document.querySelector('.postage > g').outerHTML.replace(/ id="[^"]*"/g,'')}));
  sky.wall=`<image href="data:image/webp;base64,${fs.readFileSync(path.join(ROOT,'wall',sky.key+'-d.webp')).toString('base64')}" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>`;
  let s=Math.floor(new Date(date+'T12:00')/864e5)%2147483646+1;const rnd=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
  const cols=sky.palette.c;let hair='';
  for(let i=0;i<260;i++){let x=-100+rnd()*1400,y=-100+rnd()*830,d=`M${x} ${y}`;for(let k=0;k<5;k++){const dx=100+rnd()*110,dy=70+rnd()*50*(rnd()<.5?-1:1);d+=` q${dx/2} ${dy} ${dx} ${dy*.2}`}
    hair+=`<path d="${d}" stroke="${cols[i%8]}" stroke-width="${(3+rnd()*18).toFixed(1)}" opacity="${(.22+rnd()*.45).toFixed(2)}" fill="none" stroke-linecap="round"/>`}
  const rot=(rnd()*20-10).toFixed(1);const tonight=sky.full?'tonight, a full moon':`tonight, ${sky.moon}`;
  const moon=sky.lit<.03?'':`<circle cx="1086" cy="104" r="62" fill="#fff6dc" opacity="${(.12+sky.lit*.2).toFixed(2)}" filter="url(#glow)"/><circle cx="1086" cy="104" r="34" fill="#2c3350" opacity=".35"/><path d="${moonPath(1086,104,34,sky.age)}" fill="#fbf3dc"/>`;
  const html=`<html><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><filter id="blur"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter><filter id="blur8"><feGaussianBlur stdDeviation="9"/></filter><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="ds" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#2a0a05" flood-opacity=".5"/></filter>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".45" stop-color="#2a1405" stop-opacity="0"/><stop offset="1" stop-color="#2a1405" stop-opacity=".55"/></radialGradient>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.bg[0]}"/><stop offset=".55" stop-color="${sky.bg[1]}"/><stop offset="1" stop-color="${sky.bg[2]}"/></linearGradient>
<radialGradient id="glowbg" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${sky.bg[0]}" stop-opacity=".0"/><stop offset="0" stop-color="#ffffff" stop-opacity=".22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<linearGradient id="env" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a1f2f"/><stop offset=".7" stop-color="#3a0d18"/></linearGradient>
<linearGradient id="flap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a2536"/><stop offset="1" stop-color="#4a1420"/></linearGradient>
<symbol id="rose" viewBox="0 0 120 120">${rose}</symbol></defs>
${sky.wall}<rect width="1200" height="630" fill="#f3ead8" opacity=".12"/><rect width="1200" height="630" fill="url(#vig)" opacity=".55"/>
<g transform="translate(330 120)" filter="url(#ds)">
 <rect width="540" height="346" rx="6" fill="url(#env)"/><path d="M0 0 L270 214 L540 0" fill="none" stroke="#2a0710" stroke-opacity=".4" stroke-width="1.5"/>
 <path d="M0 346 L250 180 M540 346 L290 180" stroke="#2a0710" stroke-opacity=".3" stroke-width="1.5"/><path d="M0 0 H540 L270 228Z" fill="url(#flap)"/>
 <path d="M12 7 H528 L270 216Z" fill="none" stroke="#dcc088" stroke-opacity=".55"/><rect x="9" y="9" width="522" height="328" rx="2" fill="none" stroke="#dcc088" stroke-opacity=".35"/>
 <g transform="translate(176 160) scale(.94)">${waxSeal(seal(true,'o'),sky.wax)}</g>
 <g transform="translate(8 206) scale(1.35)">${sky.stamp}</g>
 <g fill="none" stroke="#ecd7aa" stroke-opacity=".7" stroke-width="1.1"><circle cx="128" cy="290" r="30"/><circle cx="128" cy="290" r="21"/><path d="M84 270 q10 -5 20 0 t20 0 M84 284 q10 -5 20 0 t20 0 M84 298 q10 -5 20 0 t20 0 M84 312 q10 -5 20 0 t20 0"/></g>
 <use href="#rose" x="456" y="250" width="78" height="78" transform="rotate(-24 495 289)"/></g>
<g transform="translate(600 540)" text-anchor="middle" font-family="Liberation Serif, DejaVu Serif, serif">
 <rect x="-270" y="-40" width="540" height="92" fill="#f6f0e1" opacity=".96"/><rect x="-264" y="-34" width="528" height="80" fill="none" stroke="#b58c4c" stroke-opacity=".7"/>
 <text y="-7" font-size="26" letter-spacing="9" fill="#4a1420">BEHIND THE CREATOR</text>
 <text y="16" font-size="16" font-style="italic" letter-spacing="1.5" fill="#6f5a3e">a letter from Jasleen Kaur Ahluwalia · break the seal</text>
 <text y="36" font-size="13.5" font-style="italic" letter-spacing="1.2" fill="#8a7454">${tonight} · ${sky.zodiac} season</text>
</g></svg></body></html>`;
  const q=await b.newPage({viewport:{width:1200,height:630}});await q.setContent(html);
  await q.screenshot({path:path.join(ROOT,'og-card.jpg'),type:'jpeg',quality:88});
  // the seal in the tab and on the home screen wears the same wax
  const fav=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 2 186 186">${waxSeal(seal(false,'f'),sky.wax)}</svg>`;fs.writeFileSync(path.join(ROOT,'favicon.svg'),fav);
  const src='data:image/svg+xml;base64,'+Buffer.from(fav).toString('base64');
  for(const [n,sz,bg] of [['favicon-32.png',32,'transparent'],['favicon-192.png',192,'transparent'],['apple-touch-icon.png',180,'#f1ecdd'],['icon-512.png',512,'transparent']]){
    const f=await b.newPage({viewport:{width:sz,height:sz}});const k=bg==='transparent'?1:.86;
    await f.setContent(`<html><body style="margin:0;background:${bg}"><img src="${src}" style="width:${sz*k}px;height:${sz*k}px;display:block;margin:${sz*(1-k)/2}px"></body></html>`);
    await f.screenshot({path:path.join(ROOT,n),omitBackground:bg==='transparent'});await f.close()}
  await b.close();
  console.log(date,sky.moon,sky.zodiac,sky.wax.join(' '));
})();
