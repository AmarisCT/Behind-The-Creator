/* ===== The botanical wallpaper: irises, sage leaves, gold sprigs and butterflies, painted fresh in the browser ===== */
(function(){
  const NS='http://www.w3.org/2000/svg',B=document.getElementById('backdrop');if(!B)return;
  const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
  let sd=23;const rnd=()=>{sd=(sd*16807)%2147483647;return (sd-1)/2147483646},R=(a,b)=>a+rnd()*(b-a),pick=a=>a[Math.floor(rnd()*a.length)];
  const LITE=!!window.LITE,f1=n=>n.toFixed(1);
  const base=B.querySelector('rect');base.setAttribute('fill','#efe6d4');
  const W=el('g',{id:'wallpaper'});base.after(W);
  const defs=el('defs',{},W);
  const grad=(id,stops,attrs={})=>{const g=el(attrs.lin?'linearGradient':'radialGradient',{id,...(attrs.lin?{x1:0,y1:0,x2:attrs.x2||0,y2:attrs.y2||1}:{cx:.5,cy:0,r:1.05,fx:.5,fy:0})},defs);stops.forEach(([o,c,op])=>el('stop',{offset:o,'stop-color':c,'stop-opacity':op??1},g));return g};
  grad('irF',[[0,'#fbeeee'],[.42,'#e2a6b4'],[1,'#9e4b6c']]);grad('irS',[[0,'#fcf3f1'],[.5,'#ecbcc6'],[1,'#b56f8b']]);
  grad('irBl',[[0,'#fbf0ee'],[1,'#e6aab6']]);
  grad('leafG',[[0,'#a9b088'],[.5,'#8d9870'],[1,'#6d7a52']],{lin:1,x2:1,y2:0});grad('stemG',[[0,'#9aa47c'],[1,'#6f7b52']],{lin:1,x2:1,y2:0});
  const mot=el('filter',{id:'wallMottle',x:0,y:0,width:'100%',height:'100%'},defs);el('feTurbulence',{type:'fractalNoise',baseFrequency:'.006 .01',numOctaves:3,seed:5},mot);
  el('feColorMatrix',{values:'0 0 0 0 .62  0 0 0 0 .5  0 0 0 0 .34  0 0 0 .22 0'},mot);
  el('rect',{width:1600,height:1000,filter:'url(#wallMottle)'},W);
  const GOLD='#c39a52',GOLD2='#d8b36a';

  // ---- one ruffled petal, base at 0,0 pointing down (+y): soft waves, dense veining, darker rim, a curled fold ----
  let pid=0;
  const outline=(L,spread,wid,amp,ph,ph2)=>{const n=90,pts=[];
    for(let i=0;i<=n;i++){const u=i/n*2-1,th=u*spread,rim=Math.pow(1-Math.pow(Math.abs(u),2.2),1.4);let r=L*Math.pow(Math.cos(u*Math.PI/2),.36);
      r*=1+amp*rim*(Math.abs(Math.sin(u*7.5+ph))*.09+Math.sin(u*13+ph2)*.035-.05);pts.push([Math.sin(th)*r*wid,Math.cos(th)*r])}
    let d=`M${f1(pts[0][0])} ${f1(pts[0][1])}`;for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
      d+=` C${f1(p1[0]+(p2[0]-p0[0])/6)} ${f1(p1[1]+(p2[1]-p0[1])/6)} ${f1(p2[0]-(p3[0]-p1[0])/6)} ${f1(p2[1]-(p3[1]-p1[1])/6)} ${f1(p2[0])} ${f1(p2[1])}`}
    return d+' Z'};
  const petal=(g,L,spread,fill,veinN,amp=1,wid=1.18,fold=true)=>{const ph=R(0,6),ph2=R(0,6),d=outline(L,spread,wid,amp,ph,ph2),id='pc'+(pid++);
    el('path',{d,fill},g);const cp=el('clipPath',{id},defs);el('path',{d},cp);const inner=el('g',{'clip-path':`url(#${id})`},g);
    // darker rim and a deeper throat
    el('path',{d,fill:'none',stroke:'var(--irEdge,#8a3a5c)','stroke-width':L*.16,opacity:.3},inner);
    el('ellipse',{cx:0,cy:L*.05,rx:L*.22,ry:L*.2,fill:'var(--irEdge,#8a3a5c)',opacity:.22},inner);
    // the fine striations that make it look painted
    const vg=el('g',{fill:'none','stroke-linecap':'round'},inner);
    for(let k=0;k<veinN;k++){const u=-.98+1.96*k/(veinN-1)+R(-.008,.008),th=u*spread,r=L*Math.pow(Math.cos(u*Math.PI/2),.36)*R(.7,1.02),x=Math.sin(th)*r*wid,y=Math.cos(th)*r,light=k%2===0;
      el('path',{d:`M${f1(x*.05)} ${f1(L*.05)} Q${f1(Math.sin(th*.7)*r*.5*wid)} ${f1(Math.cos(th*.85)*r*.52)} ${f1(x)} ${f1(y)}`,stroke:light?'#fffaf6':'var(--irEdge,#8a3a5c)','stroke-width':light?R(.3,.6).toFixed(2):R(.22,.42).toFixed(2),opacity:light?R(.35,.7).toFixed(2):R(.15,.32).toFixed(2)},vg)}
    // a soft highlight down the middle, and a curled-over fold near the tip
    el('path',{d:`M0 ${f1(L*.08)} Q${f1(L*.05)} ${f1(L*.45)} 0 ${f1(L*.8)}`,stroke:'#fffaf4','stroke-width':L*.09,opacity:.22,fill:'none','stroke-linecap':'round'},inner);
    if(fold){const fa=R(-.5,.5)*spread,fr=L*.86,fx=Math.sin(fa)*fr*wid,fy=Math.cos(fa)*fr,fw=L*R(.22,.32);
      el('path',{d:`M${f1(fx-fw)} ${f1(fy-fw*.2)} Q${f1(fx)} ${f1(fy+fw*.55)} ${f1(fx+fw)} ${f1(fy-fw*.15)} Q${f1(fx)} ${f1(fy+fw*.1)} ${f1(fx-fw)} ${f1(fy-fw*.2)}Z`,fill:'#fff6f2',opacity:.16,filter:'url(#blur2)'},inner)}
    el('path',{d,fill:'none',stroke:GOLD,'stroke-width':.9,opacity:.9},g)};
  const beard=(g,L)=>{for(let k=0;k<(LITE?30:70);k++){const y=R(.03,.42)*L,x=R(-.05,.05)*L*(1-y/L),a=R(-60,60),l=R(4,9);
      el('path',{d:`M${f1(x)} ${f1(y)} l${f1(Math.sin(a*Math.PI/180)*l)} ${f1(Math.cos(a*Math.PI/180)*l)}`,stroke:pick(['#e8c25a','#d9a73c','#f2d98a','#c98e2e']),'stroke-width':1.1,'stroke-linecap':'round'},g)}};
  const at=(g,x,y,a)=>el('g',{transform:`translate(${f1(x)} ${f1(y)}) rotate(${f1(a-90)})`},g);
  const leaf=(g,x,y,len,a,w)=>{const t=a*Math.PI/180,tx=x+Math.cos(t)*len,ty=y+Math.sin(t)*len,bend=R(-.18,.18)*len,nx=-Math.sin(t),ny=Math.cos(t);
    const mx=x+Math.cos(t)*len*.5+nx*bend,my=y+Math.sin(t)*len*.5+ny*bend;
    const d=`M${f1(x-nx*w)} ${f1(y-ny*w)} Q${f1(mx-nx*w*.7)} ${f1(my-ny*w*.7)} ${f1(tx)} ${f1(ty)} Q${f1(mx+nx*w*.7)} ${f1(my+ny*w*.7)} ${f1(x+nx*w)} ${f1(y+ny*w)} Z`;
    el('path',{d,fill:'url(#leafG)'},g);el('path',{d:`M${f1(x)} ${f1(y)} Q${f1(mx)} ${f1(my)} ${f1(tx)} ${f1(ty)}`,stroke:'#c3c9a6','stroke-width':.8,fill:'none',opacity:.7},g);
    for(let k=0;k<5;k++){const o=(k-2)*w*.28;el('path',{d:`M${f1(x+nx*o)} ${f1(y+ny*o)} Q${f1(mx+nx*o*.7)} ${f1(my+ny*o*.7)} ${f1(tx)} ${f1(ty)}`,stroke:'#5f6b45','stroke-width':.35,fill:'none',opacity:.35},g)}
    el('path',{d,fill:'none',stroke:GOLD,'stroke-width':.6,opacity:.45},g)};
  const stem=(g,x1,y1,x2,y2,w)=>{const mx=(x1+x2)/2+R(-40,40);el('path',{d:`M${f1(x1)} ${f1(y1)} Q${f1(mx)} ${f1((y1+y2)/2)} ${f1(x2)} ${f1(y2)}`,stroke:'url(#stemG)','stroke-width':w,fill:'none','stroke-linecap':'round'},g)};
  const bud=(g,x,y,s,a)=>{const b=at(g,x,y,a);const L=46*s;
    el('path',{d:`M0 0 C${f1(-L*.32)} ${f1(L*.3)} ${f1(-L*.22)} ${f1(L*.8)} 0 ${f1(L)} C${f1(L*.22)} ${f1(L*.8)} ${f1(L*.32)} ${f1(L*.3)} 0 0Z`,fill:'url(#irF)',transform:`rotate(180) translate(0 ${f1(-L*.2)})`},b);
    for(const sd2 of [-1,1])el('path',{d:`M0 ${f1(L*.25)} C${f1(sd2*L*.36)} ${f1(L*.05)} ${f1(sd2*L*.3)} ${f1(-L*.45)} ${f1(sd2*L*.06)} ${f1(-L*.7)} C${f1(sd2*L*.12)} ${f1(-L*.3)} ${f1(sd2*L*.08)} 0 0 ${f1(L*.25)}Z`,fill:'url(#leafG)',stroke:GOLD,'stroke-width':.5,'stroke-opacity':.5},b)};
  const iris=(g,x,y,s,rot)=>{const f=el('g',{transform:`translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})`},g),L=120,V=LITE?60:130;
    // upright standards, cupped together
    [[270,.92,.42,1.1],[246,.86,.4,1.05],[294,.86,.4,1.05]].forEach(([a,k,sp,w])=>petal(at(f,0,-4,a),L*k,sp,'url(#irS)',V-20,1.1,w));
    // three drooping falls, the front one largest
    [[156,1,.9],[24,1,.9]].forEach(([a,k,sp])=>{const p=at(f,0,6,a);petal(p,L*k,sp,'url(#irF)',V,1.2,1.32);beard(p,L*k)});
    const p=at(f,0,8,90);petal(p,L*1.12,.92,'url(#irF)',V+10,1.25,1.36);beard(p,L*1.12)};
  const sprig=(g,x,y,len,a)=>{const sg=el('g',{stroke:GOLD2,fill:'none','stroke-width':.75,opacity:.85},g);let px=x,py=y,ang=a;
    for(let k=0;k<6;k++){const l=len/6,nx=px+Math.cos(ang*Math.PI/180)*l,ny=py+Math.sin(ang*Math.PI/180)*l;el('path',{d:`M${f1(px)} ${f1(py)} L${f1(nx)} ${f1(ny)}`},sg);
      for(const sd2 of [-1,1]){if(rnd()<.6){const ba=ang+sd2*R(30,60),bl=R(8,18),bx=nx+Math.cos(ba*Math.PI/180)*bl,by=ny+Math.sin(ba*Math.PI/180)*bl;el('path',{d:`M${f1(nx)} ${f1(ny)} L${f1(bx)} ${f1(by)}`},sg);
        if(rnd()<.55){for(let q=0;q<5;q++){const qa=q*72*Math.PI/180;el('circle',{cx:f1(bx+Math.cos(qa)*2.2),cy:f1(by+Math.sin(qa)*2.2),r:1.3,fill:'#e8b8b4',stroke:'none'},sg)}el('circle',{cx:f1(bx),cy:f1(by),r:.9,fill:GOLD,stroke:'none'},sg)}
        else el('circle',{cx:f1(bx),cy:f1(by),r:R(1,1.8).toFixed(1),fill:'#d4a86a',stroke:'none'},sg)}}
      px=nx;py=ny;ang+=R(-18,18)}};
  const blossom=(g,x,y,r)=>{const b=el('g',{transform:`translate(${f1(x)} ${f1(y)}) rotate(${f1(R(0,60))})`},g);
    for(let k=0;k<6;k++){el('ellipse',{cx:0,cy:-r*.55,rx:r*.32,ry:r*.55,fill:'url(#irBl)',stroke:GOLD,'stroke-width':.4,'stroke-opacity':.7,transform:`rotate(${k*60})`},b);
      el('path',{d:`M0 ${f1(-r*.15)} L0 ${f1(-r*.9)}`,stroke:'#b8607a','stroke-width':.35,opacity:.4,transform:`rotate(${k*60})`},b)}
    for(let k=0;k<8;k++){const q=k*45*Math.PI/180;el('circle',{cx:f1(Math.cos(q)*r*.2),cy:f1(Math.sin(q)*r*.2),r:.9,fill:'#d9a73c'},b)}el('circle',{r:r*.12,fill:'#e8c25a'},b)};
  const butterfly=(g,x,y,s,a)=>{const b=el('g',{transform:`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`,class:'wall-bfly'},g);
    for(const sd2 of [-1,1]){el('path',{d:`M0 -2 C${sd2*10} -26 ${sd2*34} -30 ${sd2*36} -14 C${sd2*38} -2 ${sd2*20} 2 0 0Z`,fill:'#ecc9d2',stroke:GOLD,'stroke-width':.8,opacity:.92},b);
      el('path',{d:`M0 1 C${sd2*16} 4 ${sd2*26} 14 ${sd2*20} 24 C${sd2*14} 30 ${sd2*4} 18 0 4Z`,fill:'#e3b4c2',stroke:GOLD,'stroke-width':.8,opacity:.92},b);
      for(let k=0;k<4;k++)el('path',{d:`M0 -1 Q${sd2*(10+k*5)} ${-12-k*3} ${sd2*(16+k*5)} ${-18-k*2}`,stroke:'#b07a8e','stroke-width':.35,fill:'none',opacity:.5},b);
      el('path',{d:`M0 -6 Q${sd2*5} -18 ${sd2*9} -22`,stroke:'#7a5a3a','stroke-width':.6,fill:'none'},b);el('circle',{cx:sd2*9,cy:-22,r:1,fill:'#7a5a3a'},b)}
    el('ellipse',{cx:0,cy:4,rx:1.6,ry:10,fill:'#8a6a4a'},b)};

  // ---- the composition (weighted to the edges, with a pair down the middle for phones) ----
  const back=el('g',{},W),mid=el('g',{},W),front=el('g',{},W),top=el('g',{},W);
  for(let i=0;i<(LITE?26:52);i++)sprig(back,R(0,1600),R(0,1000),R(60,130),R(0,360));
  for(let i=0;i<(LITE?16:30);i++)blossom(back,R(0,1600),R(0,1000),R(9,16));
  const FL=[[170,260,1.9,-10],[1440,230,1.75,12],[1400,800,1.95,-6],[230,820,1.6,8],[790,130,1.15,-4],[860,900,1.25,5]];
  FL.forEach(([x,y,s])=>{stem(mid,x,y+20,x+R(-60,60),1080,6*s);for(let k=0;k<2;k++)leaf(mid,x+R(-120,120),1060,R(420,700),R(-118,-62),R(16,24))});
  [[70,1030,640,-80,22],[150,1040,520,-60,18],[1540,1030,620,-100,22],[1460,1040,520,-118,18],[1590,420,360,-160,16],[10,380,380,-25,16]].forEach(a=>leaf(mid,...a));
  [[420,470,.9,-20],[1180,420,.85,24],[1220,610,.8,-10],[520,640,.8,14],[690,330,.7,-28],[940,700,.7,18]].forEach(([x,y,s,a])=>{stem(mid,x,y,x+R(-30,30),1060,4*s);bud(front,x,y,s,a)});
  FL.forEach(a=>iris(front,...a));
  [[560,230,.9,-14],[1060,170,.8,18],[1110,880,.9,-8],[150,560,.75,10],[1500,520,.7,-20]].forEach(a=>butterfly(top,...a));

  // ---- the irises change colour with the season and the holidays ----
  const PAL={spring:[['#fbeeee','#e2a6b4','#9e4b6c'],['#fcf3f1','#ecbcc6','#b56f8b']],summer:[['#fff2e6','#f3b896','#c4664e'],['#fff6ee','#f7cdb2','#d68a6a']],
    autumn:[['#f7ebe9','#c99aa8','#7a3e5c'],['#faf0ee','#d9b2bd','#965a74']],winter:[['#fbf8fc','#d7cce6','#8e7cb0'],['#fdfbfe','#e6def0','#a898c6']],
    halloween:[['#efe2f0','#8e5a94','#2e1736'],['#f4ebf4','#a678aa','#4a2a50']],muertos:[['#fff4d8','#f4a83a','#c0501a'],['#fff8e6','#f7c46a','#d97a28']],
    christmas:[['#fbeaea','#d0505c','#7a1424'],['#fdf0f0','#e07a82','#9a2a36']],diwali:[['#fff4e0','#f2b23a','#b0306a'],['#fff8ea','#f6cb6a','#c9568a']],
    valentine:[['#fff0f2','#ef7f98','#b0243f'],['#fff5f6','#f5a3b4','#c8506a']],stpatrick:[['#f7fbf2','#cfe6c0','#6f9a5a'],['#fbfdf8','#e2f0d8','#8fb47a']],
    lny:[['#fff0e8','#e6505a','#9a1020'],['#fff5ee','#ee7c80','#b42a34']],hanukkah:[['#f6f8fe','#a9bde8','#2f4f9a'],['#fafbff','#c6d4f0','#5674b8']],
    easter:[['#fbf6ff','#d9c6f0','#8f6cc0'],['#fdfaff','#e8dcf6','#a98ad0']],newyear:[['#fffaf0','#e8d4a8','#a8843c'],['#fffcf6','#f0e2c2','#c09a52']]};
  const ALIAS={december:'christmas',gurpurab:'diwali',vaisakhi:'diwali',lantern:'lny',holi:'valentine',mothers:'spring',eqS:'spring',solW:'winter'};
  const setStops=(id,c)=>[...document.querySelectorAll(`#${id} stop`)].forEach((s,i)=>s.setAttribute('stop-color',c[i]));
  window.__wall={recolor:(hol,season)=>{const k=(hol||[]).map(h=>ALIAS[h]||h).find(h=>PAL[h])||season||'spring',p=PAL[k]||PAL.spring;
    setStops('irF',p[0]);setStops('irS',p[1]);W.style.setProperty('--irEdge',p[0][2]);setStops('irBl',[p[1][0],p[1][1]]);return k}};
})();
