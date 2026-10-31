// JKA monogram as vector paths (cap height 100, baseline y=100)
const J=`<path d="M10 0 H44 V4 H36 V76 C36 99 22 108 9 104 C1 101 -1 93 5 90 C9 94 15 97 19 93 C23 89 24 84 24 76 V4 H10Z"/><circle cx="5.5" cy="95" r="5.2"/>`;
const K=`<path d="M0 0 H26 V4 H18 V96 H26 V100 H0 V96 H7 V4 H0Z"/><path d="M18 56 L52 4 H45 V0 H66 V4 H57 L21 60Z"/><path d="M27 44 L36 38 L64 96 H70 V100 H46 V96 H51Z"/>`;
const A=`<path d="M34 0 H43 L72 96 H78 V100 H52 V96 H59 L52 72 H22 L16 96 H24 V100 H2 V96 H11 Z M23.5 67 H50.6 L38 22 Z" fill-rule="evenodd"/>`;
// laid out with optical spacing; total width ≈ 214
const MONO=`<g transform="translate(0 0)">${J}</g><g transform="translate(58 0)">${K}</g><g transform="translate(134 0)">${A}</g>`;
module.exports={MONO,W:214,H:110};
