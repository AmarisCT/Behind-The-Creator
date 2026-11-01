// Paints the iris wallpaper once per palette into images (wall/<key>-d.webp landscape, wall/<key>-m.webp portrait for phones),
// so the live page shows a single picture instead of thousands of shapes.
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const gen=fs.readFileSync(path.join(__dirname,'wall-gen.js'),'utf8');
const KEYS=['spring','summer','autumn','winter','halloween','muertos','christmas','diwali','valentine','stpatrick','lny','hanukkah','easter','newyear'];
const page=`<html><body style="margin:0"><svg width="0" height="0" style="position:absolute"><defs><filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter><filter id="blur8"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="canvas"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.15 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs></svg>
<svg id="backdrop" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style="display:block"><rect width="1600" height="1000" fill="#efe6d4"/></svg>
<script>${gen}<\/script><script>document.getElementById('backdrop').appendChild(Object.assign(document.createElementNS('http://www.w3.org/2000/svg','rect'),{}));</script></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.setContent(page);
  await p.evaluate(()=>{const r=document.querySelector('#backdrop > rect:last-child');r.setAttribute('width',1600);r.setAttribute('height',1000);r.setAttribute('fill','#000');r.setAttribute('filter','url(#canvas)')});
  for(const k of KEYS){await p.evaluate(k=>window.__wall.recolor([k]),k);
    for(const [suffix,w,h,vb] of [['d',2000,1250,'0 0 1600 1000'],['m',900,1956,'570 0 460 1000']]){
      await p.setViewportSize({width:w,height:h});await p.evaluate(([w,h,vb])=>{const s=document.getElementById('backdrop');s.setAttribute('width',w);s.setAttribute('height',h);s.setAttribute('viewBox',vb)},[w,h,vb]);
      await p.waitForTimeout(150);await p.locator('#backdrop').screenshot({path:`/tmp/wall-${k}-${suffix}.png`})}
    console.log('painted',k)}
  await b.close()})();
