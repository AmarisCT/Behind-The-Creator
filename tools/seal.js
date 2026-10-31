const {MONO,W}=require('./mono.js');
// wax seal (viewBox 0 0 200 200), monogram embossed
module.exports=(withRibbon=true,id='s')=>`
<defs>
 <radialGradient id="${id}w" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#d4504c"/><stop offset=".55" stop-color="#a3222a"/><stop offset="1" stop-color="#5e0d12"/></radialGradient>
 <radialGradient id="${id}i" cx=".42" cy=".38" r=".75"><stop offset="0" stop-color="#c33a38"/><stop offset="1" stop-color="#8f1a20"/></radialGradient>
 <filter id="${id}e" x="-10%" y="-10%" width="120%" height="120%"><feOffset dx="0" dy="1.6" in="SourceAlpha" result="o"/><feGaussianBlur in="o" stdDeviation="1" result="b"/><feComposite in="SourceAlpha" in2="b" operator="arithmetic" k2="-1" k3="1" result="sh"/><feFlood flood-color="#3a0508" flood-opacity=".75"/><feComposite in2="sh" operator="in" result="d"/><feOffset dx="0" dy="-1.2" in="SourceAlpha" result="o2"/><feGaussianBlur in="o2" stdDeviation=".8" result="b2"/><feComposite in="SourceAlpha" in2="b2" operator="arithmetic" k2="-1" k3="1" result="hl"/><feFlood flood-color="#ffd2c4" flood-opacity=".55"/><feComposite in2="hl" operator="in" result="l"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="d"/><feMergeNode in="l"/></feMerge></filter>
</defs>
${withRibbon?`<path d="M86 132 L58 196 L76 186 L86 200 L104 138Z" fill="#7a1520"/><path d="M114 132 L146 194 L127 185 L117 199 L96 138Z" fill="#8f1d27"/>`:''}
<path d="M100 8 C130 4 158 20 172 46 C188 74 186 110 168 138 C150 164 120 182 88 178 C56 174 28 156 16 126 C4 96 12 60 36 36 C52 18 74 9 100 8Z" fill="url(#${id}w)"/>
<circle cx="98" cy="95" r="66" fill="url(#${id}i)"/>
<circle cx="98" cy="95" r="66" fill="none" stroke="#6e1016" stroke-width="2.5" stroke-opacity=".6"/>
<circle cx="98" cy="95" r="58" fill="none" stroke="#f0a49a" stroke-width="1.2" stroke-dasharray="2 4" stroke-opacity=".55"/>
<g transform="translate(98 95) scale(.47) translate(${-W/2} -52)" fill="#e2675e" filter="url(#${id}e)">${MONO}</g>
<ellipse cx="66" cy="50" rx="22" ry="9" fill="#fff" opacity=".16" transform="rotate(-32 66 50)"/>`;
