import { sceneName } from './cases'
import { ROOM_DRAW, ROOM_LT } from './rooms'

type SceneId = string

/* Gerado a partir do HTML original: as cenas e personagens continuam sendo montados como strings SVG. */
var LT:Record<string,any[][]>={aad:[[290,60,110,'#ffcf86',.5],[110,110,90,'#ff9f6b',.2]],alg:[[300,110,90,'#9fe0c0',.3],[170,120,110,'#ffd9a0',.35]],aof:[[180,125,110,'#ffd9a0',.5],[310,70,70,'#ffcf86',.25]],apa:[[70,140,100,'#ffe3a0',.45],[292,110,70,'#ffb561',.35]],esc:[[297,175,120,'#ff8a3c',.6],[153,100,90,'#ffcf86',.35]],coz:[[190,40,130,'#ffd9a0',.42],[238,52,70,'#ffd9a0',.2]],bib:[[150,150,120,'#ffc477',.5]],qua:[[151,128,100,'#ffb561',.5],[300,60,90,'#6f9cc0',.22]],
 cam:[[180,70,120,'#ffd9a0',.5],[310,110,70,'#ff9f6b',.2]],pal:[[190,150,130,'#ffe3b0',.5],[300,50,80,'#9fc3d0',.2]],bil:[[180,100,120,'#ffcf86',.42],[326,130,60,'#ffb561',.25]],cab:[[170,125,100,'#ffb561',.4],[300,70,110,'#8fc0e0',.3]]};
var TAG:Record<string,string>={aad:'COLHEITA · 21H',alg:'COLHEITA · 21H',aof:'COLHEITA · 21H',apa:'COLHEITA · 21H',cam:'ESTREIA · 23H',pal:'ESTREIA · 23H',bil:'ESTREIA · 23H',cab:'ESTREIA · 23H'};
function FX(id: SceneId): string {
 var o='<defs><filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="'+(id.length*7)+'"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .9 0"/></filter>'+
 '<radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient>'+
 '<linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stop-color="#8fb0b8" stop-opacity="0"/><stop offset="1" stop-color="#8fb0b8" stop-opacity=".22"/></linearGradient>'+
 '<pattern id="rn" width="12" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(14)"><path d="M3 2v12M9 14v10" stroke="#b5d3df" stroke-width="1" opacity=".55"/></pattern><clipPath id="wc"><rect x="28" y="22" width="92" height="82"/></clipPath>';
 var L=LT[id]||ROOM_LT[id]||[];
 L.forEach(function(l,i){o+='<radialGradient id="l'+i+'"><stop offset="0" stop-color="'+l[3]+'" stop-opacity="'+l[4]+'"/><stop offset=".5" stop-color="'+l[3]+'" stop-opacity="'+(l[4]*.3)+'"/><stop offset="1" stop-color="'+l[3]+'" stop-opacity="0"/></radialGradient>'});
 o+='</defs><rect width="360" height="220" fill="#02080b" opacity=".5"/>';
 L.forEach(function(l,i){o+='<circle cx="'+l[0]+'" cy="'+l[1]+'" r="'+l[2]+'" fill="url(#l'+i+')" style="mix-blend-mode:screen" class="'+(i?'':'flick')+'"/>'});
 if(id==='esc')o+='<g clip-path="url(#wc)"><rect class="rain" x="-20" y="-30" width="170" height="170" fill="url(#rn)"/></g>';
 for(var i=0;i<7;i++)o+='<circle class="dust" cx="'+((i*53+id.length*17)%340+10)+'" cy="'+((i*37+40)%150+30)+'" r="'+(.8+(i%3)*.3)+'" fill="#ffe3b0" opacity=".5" style="mix-blend-mode:screen;animation-delay:-'+(i*1.3)+'s"/>';
 o+='<rect width="360" height="220" fill="url(#fg)"/><rect class="bolt" opacity="0" width="360" height="220" fill="#dfeaff" style="mix-blend-mode:screen"/><rect width="360" height="220" fill="url(#vg)"/>'+
 '<rect class="grain" x="-4" y="-4" width="368" height="228" filter="url(#gr)" opacity=".16" style="mix-blend-mode:overlay"/>'+
 '<rect width="360" height="20" fill="#000"/><rect y="200" width="360" height="20" fill="#000"/>'+
 '<text x="14" y="213" font-size="8" letter-spacing="1.6" fill="#cfc7ac" opacity=".75" style="font-family:var(--display)">'+sceneName(id).toUpperCase()+' · '+(TAG[id]||'NOITE DE CHUVA')+'</text>';
 return o;
}

function sh(c: string, a: number): string {var n=parseInt(c.slice(1),16),t=a<0?0:255,p=Math.abs(a);return 'rgb('+[n>>16,n>>8&255,n&255].map(function(v: number){return Math.round(v+(t-v)*p)}).join()+')'}
var PP:Record<string,any>={ang:{sk:'#c9a58f',hr:'#b9b7b0',st:'neat',cl:'#4a2a30',old:1,dead:1},
 bia:{sk:'#dcb8a0',hr:'#2a1810',st:'bob',cl:'#5a2338',pearl:1},
 ire:{sk:'#d3ad96',hr:'#9a9892',st:'bun',cl:'#3e3a4a',old:1},
 lui:{sk:'#c99f82',hr:'#2a1c14',st:'short',cl:'#3a3a2c',open:1,stub:1},
 dan:{sk:'#d1aa90',hr:'#6c6d70',st:'neat',cl:'#2d3a36',tie:'#7a2a3a',gl:1,old:1},
 aug:{sk:'#c7ae9c',hr:'#c4c4be',st:'bald',cl:'#25252d',tie:'#6b2a2a',old:1,dead:1},
 cec:{sk:'#dab79f',hr:'#2b1a14',st:'bob',cl:'#3b2d44',pearl:1},
 rod:{sk:'#d3aa8d',hr:'#3b261a',st:'short',cl:'#202c38',open:1,stub:1},
 mar:{sk:'#d6b09a',hr:'#a9a7a1',st:'bun',cl:'#463f3b',apr:1,old:1},
 hei:{sk:'#d1ab91',hr:'#8e9091',st:'neat',cl:'#2b3a30',tie:'#3a4a6a',gl:1,old:1},
 liv:{sk:'#d9b49d',hr:'#4a2418',st:'bob',cl:'#6a2a3a',pearl:1},
 ota:{sk:'#d0a98c',hr:'#7d7e80',st:'short',cl:'#2a2e3a',tie:'#a0803a',old:1},
 nil:{sk:'#cfa992',hr:'#8c8a86',st:'bun',cl:'#2f3a3a',old:1},
 cai:{sk:'#d6b094',hr:'#2e2018',st:'short',cl:'#222428',open:1,stub:1}};
function person(o: Person): string {
 var d=PP[o.k],s=o.s||1,i='p'+o.k,sk=d.sk,hr=d.hr,cl=d.cl,e=o.e||0,K='<path d="',F='" fill="',sk2=sh(sk,-.3),g='';
 g+='<defs><radialGradient id="'+i+'s" cx=".3" cy=".4" r=".8"><stop offset="0" stop-color="'+sh(sk,.12)+'"/><stop offset=".6" stop-color="'+sk+'"/><stop offset="1" stop-color="'+sh(sk,-.5)+'"/></radialGradient><linearGradient id="'+i+'c"><stop offset="0" stop-color="'+sh(cl,.3)+'"/><stop offset=".5" stop-color="'+cl+'"/><stop offset="1" stop-color="'+sh(cl,-.6)+'"/></linearGradient></defs>';
 if(d.st==='bob')g+=K+'M-14 -4Q-16 -21 0 -21Q16 -21 14 -4L16 26Q9 28 11 8H-11Q-9 28 -16 26Z'+F+hr+'"/>';
 if(d.st==='bun')g+='<circle cy="-21" r="6.5" fill="'+hr+'"/>';
 g+=K+'M-36 30Q-36 20 -16 17H16Q36 20 36 30L42 140H-42Z'+F+'url(#'+i+'c)"/>';
 g+=K+'M-8 6L-9 22Q0 30 9 22L8 6Z'+F+sk2+'"/>';
 if(d.apr)g+=K+'M-22 44H22L26 140H-26Z'+F+'#cfc7ac" opacity=".85"/><path d="M-22 44L-12 20M22 44L12 20" stroke="#cfc7ac" stroke-width="3"/>';
 else if(d.st==='bob')g+=K+'M-11 19L0 44L11 19Q0 25 -11 19Z'+F+'#d8cfc0"/>'+(d.pearl?'<path d="M-9 24Q0 33 9 24" stroke="#eee8d8" stroke-width="2" stroke-dasharray="1.6 1.2" fill="none"/>':'');
 else{g+=K+'M-11 18L0 50L11 18Q0 25 -11 18Z'+F+(d.open?sk2:'#d9d4c5')+'"/>';
  if(d.tie)g+=K+'M-2.2 26H2.2L4 52L0 58L-4 52Z'+F+d.tie+'"/>';
  g+=K+'M-11 18L-3 58L-22 42L-27 24ZM11 18L3 58L22 42L27 24Z'+F+sh(cl,-.35)+'" opacity=".8"/>';}
 g+='<g transform="rotate('+(o.r||0)+' 0 16)"><ellipse cx="-11.2" cy="1" rx="2.3" ry="4.2" fill="'+sk2+'"/><ellipse cx="11.2" cy="1" rx="2.3" ry="4.2" fill="'+sk2+'"/>';
 g+=K+'M-11 -3Q-11.5 14 0 17.5Q11.5 14 11 -3Q11 -16 0 -16Q-11 -16 -11 -3Z'+F+'url(#'+i+'s)"/>';
 g+=K+'M3 -16Q11 -16 11 -3Q11.5 14 0 17.5Q7 10 6 -3Q5.5 -12 3 -16Z" fill="#150a05" opacity=".38"/>';
 if(d.stub)g+=K+'M-10 4Q-10 15 0 17Q10 15 10 4Q6 11 0 11Q-6 11 -10 4Z" fill="#241811" opacity=".3"/>';
 g+='<g transform="translate(2 0)"><ellipse cx="-4.5" cy="-2" rx="3.2" ry="2" fill="#150a05" opacity=".3"/><ellipse cx="4.5" cy="-2" rx="3.2" ry="2" fill="#150a05" opacity=".3"/>';
 g+=d.dead?'<path d="M-6.8 -2Q-4.5 -.6 -2.2 -2M2.2 -2Q4.5 -.6 6.8 -2" stroke="#20120c" stroke-width=".8" fill="none"/>':'<ellipse cx="-4.5" cy="-2" rx="2.1" ry="1.1" fill="#e8e2d4"/><ellipse cx="4.5" cy="-2" rx="2.1" ry="1.1" fill="#e8e2d4"/><circle cx="-4" cy="-2" r="1.1" fill="#2a1a10"/><circle cx="5" cy="-2" r="1.1" fill="#2a1a10"/>';
 g+=K+(e?'M-8 -5.2Q-5 -6.2 -2 -3.8M8 -5.2Q5 -6.2 2 -3.8':'M-8 -5.4Q-5 -7 -2 -5.6M8 -5.4Q5 -7 2 -5.6')+'" stroke="'+sh(hr,-.35)+'" stroke-width="1.5" fill="none"/>';
 g+='<path d="M.6 -3L-1.2 5.4Q.4 6.8 2.6 5.2" stroke="#2a150c" stroke-width=".7" opacity=".55" fill="none"/>';
 g+=d.dead?'<ellipse cy="10.5" rx="2.4" ry="1" fill="#2a100d"/>':K+(e?'M-3.6 11.2Q0 9.6 3.6 11.2':'M-3.6 10Q0 11 3.6 10')+'" stroke="#4a1f1a" stroke-width="1" fill="none"/>';
 if(d.old)g+=K+'M-6 -10Q0 -11.5 6 -10M-5 -8Q0 -9 5 -8M-6.5 2Q-6 7 -4 9.5M6.5 2Q6 7 4 9.5" stroke="'+sk2+'" stroke-width=".5" fill="none" opacity=".7"/>';
 if(d.gl)g+='<g stroke="#0a0a0a" stroke-width=".9" fill="#9fc3d0" fill-opacity=".12"><circle cx="-4.5" cy="-2" r="3.9"/><circle cx="4.5" cy="-2" r="3.9"/><path d="M-.6 -2.4H.6M-8.4 -2.4L-11 -3M8.4 -2.4L11 -3" fill="none"/></g>';
 g+='</g>';
 var H:Record<string,string>={bald:'M-11 -4Q-14 -12 -9 -14Q-11 -7 -10.4 2ZM11 -4Q14 -12 9 -14Q11 -7 10.4 2Z',short:'M-12 -3Q-15 -19 0 -19.5Q15 -19 12 -3Q10 -11 4 -12Q-4 -9 -10 -11Z',bob:'M-12 -3Q-10 -17 3 -16.5Q12 -15 12 -3Q9 -11 -2 -11Q-8 -9 -12 -3Z',bun:'M-12 -3Q-13 -18 0 -18Q13 -18 12 -3Q9 -12 0 -12Q-9 -12 -12 -3Z',neat:'M-11.5 -3Q-14 -18 1 -18.5Q14 -18 11.5 -3Q9 -12 3 -13Q-5 -13.5 -11.5 -3Z'};
 g+=K+H[d.st]+F+hr+'"/>';
 if(d.st!=='bald')g+='<path d="M-9 -13Q-3 -17 5 -16" stroke="'+sh(hr,.35)+'" stroke-width=".8" opacity=".5" fill="none"/>';
 g+='<path d="M-11 -2Q-11.5 -14 -1 -16" stroke="#ffd9a0" stroke-width=".9" opacity=".5" fill="none"/></g>';
 return (o.b||'')+'<g transform="translate('+o.x+' '+o.y+') scale('+(o.f?-s:s)+' '+s+')" style="filter:drop-shadow(-3px 2px 5px #000c)"><g class="pp">'+g+(o.h||'')+'</g></g>'+(o.a||'');
}
var DESKF='<rect x="108" y="134" width="150" height="62" class="f3"/><rect x="108" y="134" width="150" height="9" class="f4"/>',
CHAIR='<path d="M170 140V92Q170 60 212 60Q254 60 254 92V140Z" fill="#2e403a"/><path d="M178 140V94Q178 68 212 68Q246 68 246 94V140Z" fill="#3b514a" opacity=".55"/>',
CNTF='<rect y="150" width="360" height="70" class="f3"/><rect y="150" width="360" height="8" class="f4"/>',
AUG={k:'aug',x:212,y:88,r:-14,b:CHAIR,a:DESKF},
TRAY='<rect x="-30" y="66" width="60" height="4" fill="#cfc7ac"/><circle cx="-15" cy="62" r="4" fill="#e8e2d2"/><circle cx="2" cy="62" r="4" fill="#e8e2d2"/><rect x="14" y="58" width="9" height="8" fill="#9fc3d0" opacity=".5"/><ellipse cx="-29" cy="69" rx="5.5" ry="3.8" fill="#bf9a82"/><ellipse cx="29" cy="69" rx="5.5" ry="3.8" fill="#bf9a82"/>',
NOTE='<rect x="-14" y="60" width="26" height="30" fill="#e3d8b0" transform="rotate(-6 0 70)"/><path d="M-10 68H8M-10 74H8M-10 80H4" stroke="#22251f" stroke-width="1" opacity=".6"/><ellipse cx="-15" cy="86" rx="5" ry="3.6" fill="#c79f8a"/><ellipse cx="13" cy="86" rx="5" ry="3.6" fill="#c79f8a"/>',
CAP='<ellipse cx="22" cy="70" rx="6" ry="4" fill="#bf9a82"/><rect x="18" y="64" width="9" height="4" rx="2" fill="#f2efe6"/>';
var CUTS_RAW:Record<string,CutFrame[]>={intro:[{t:'Mansão Valverde. 22h40.',d:3200},{sc:'esc',t:'A tempestade cortou a estrada. A polícia só chega ao amanhecer.',p:[AUG]},{sc:'coz',z:'out',t:'Quatro pessoas. Uma bandeja. Um jantar que terminou em gritos.',p:[{k:'hei',x:124,y:80,h:TRAY},{k:'mar',x:262,y:84,f:1,e:1,a:CNTF}]},{sc:'bib',t:'Todos tinham motivos. Alguém tinha mais que isso.',p:[{k:'cec',x:136,y:84,s:.95,e:1},{k:'rod',x:240,y:80,f:1,e:1}]},{sc:'qua',z:'out',t:'Você tem até o amanhecer.',p:[{k:'hei',x:96,y:86,r:7}]},{t:'O Caso Valverde',d:3500}],
 end:[{t:'Amanhecer.',d:3000},{sc:'esc',t:'Augusto iria à polícia pela manhã. Heitor não podia permitir.',p:[AUG]},{sc:'qua',z:'out',t:'Uma cápsula trocada. Uma dose de digoxina. Um coração cansado.',p:[{k:'hei',x:120,y:86,r:8,e:1,h:CAP}]},{sc:'coz',t:'O recado de Marta contou o que o doutor tentou esconder.',p:[{k:'mar',x:250,y:84,f:1,h:NOTE,a:CNTF}]},{t:'Caso encerrado',d:3500}]};

export interface Person { k: string; x: number; y: number; s?: number; f?: number; e?: number; r?: number; b?: string; a?: string; h?: string }
export interface CutFrame { t: string; d?: number; sc?: SceneId; z?: string; p?: Person[] }
function scenery(id: SceneId, ps?: Person[]): string {
 if(ROOM_DRAW[id]) return ROOM_DRAW[id]()+FX(id);
 var w='<rect width="360" height="220" class="f1"/>',b='';
 if(id==='esc'){
  b=w+'<rect x="28" y="22" width="92" height="82" class="f2"/><rect x="28" y="22" width="92" height="82" class="st"/><path d="M74 22v82M28 63h92" class="st"/>'+
  '<path d="M40 30l-6 22M62 28l-6 26M90 30l-6 24M108 32l-6 22M48 70l-5 24M96 72l-5 22" stroke="#6d8f9a" stroke-width="1.4" opacity=".6"/>'+
  '<rect x="256" y="76" width="82" height="110" class="f3"/><rect x="270" y="104" width="54" height="82" class="f1"/><path d="M284 186c4-18 10-14 12-26 4 12 12 10 14 26z" fill="#c8503a" opacity=".8"/>'+
  '<rect x="108" y="134" width="150" height="16" class="f4"/><rect x="116" y="150" width="8" height="46" class="f3"/><rect x="242" y="150" width="8" height="46" class="f3"/>'+
  '<rect x="150" y="100" width="6" height="34" class="f3"/><path d="M138 100h30l-6-20h-18z" class="f4"/><ellipse cx="153" cy="140" rx="60" ry="30" class="lt"/>'+
  '<rect x="0" y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='coz'){
  b=w+'<rect x="0" y="0" width="360" height="150" class="f2"/>'+
  '<path d="M0 30h360M0 60h360M0 90h360M0 120h360" class="st" opacity=".5"/>'+
  '<circle cx="190" cy="38" r="18" class="f4"/><circle cx="238" cy="52" r="13" class="f4"/><circle cx="148" cy="52" r="13" class="f4"/><path d="M190 0v20M238 0v39M148 0v39" class="st"/>'+
  '<rect x="38" y="36" width="82" height="64" class="f3"/><rect x="38" y="36" width="82" height="64" class="st"/>'+
  '<rect x="0" y="150" width="360" height="70" class="f3"/><rect x="0" y="150" width="360" height="8" class="f4"/>'+
  '<rect x="196" y="126" width="56" height="24" class="f4"/><rect x="262" y="128" width="46" height="22" class="f1"/>';
 }
 if(id==='bib'){
  var sh='';for(var i=0;i<4;i++){sh+='<rect x="14" y="'+(26+i*40)+'" width="96" height="30" class="f3"/><rect x="250" y="'+(26+i*40)+'" width="96" height="30" class="f3"/>';
   for(var j=0;j<9;j++){sh+='<rect x="'+(18+j*10.5)+'" y="'+(30+i*40)+'" width="7" height="26" class="f4" opacity="'+(.5+((i+j)%3)*.2)+'"/><rect x="'+(254+j*10.5)+'" y="'+(30+i*40)+'" width="7" height="26" class="f4" opacity="'+(.5+((i+j+1)%3)*.2)+'"/>';}}
  b=w+sh+'<rect x="118" y="150" width="62" height="12" class="f4"/><rect x="126" y="162" width="6" height="34" class="f3"/><rect x="168" y="162" width="6" height="34" class="f3"/>'+
  '<path d="M196 196v-40q0-24 26-24t26 24v40z" class="f3"/><rect x="0" y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='qua'){
  b=w+'<rect x="190" y="116" width="150" height="62" class="f3"/><rect x="190" y="98" width="30" height="80" class="f4"/><rect x="190" y="178" width="150" height="14" class="f2"/>'+
  '<rect x="128" y="140" width="46" height="52" class="f3"/><rect x="128" y="140" width="46" height="8" class="f4"/><rect x="144" y="118" width="14" height="22" class="f4"/><ellipse cx="151" cy="130" rx="46" ry="30" class="lt"/>'+
  '<rect x="46" y="150" width="76" height="42" class="f4"/><path d="M46 150l14-12h48l14 12" class="st"/><rect x="0" y="192" width="360" height="28" class="f2"/>';
 }

 if(id==='cam'){
  var bl='';for(var i=0;i<9;i++)bl+='<circle cx="'+(112+i*17)+'" cy="34" r="3" fill="#ffe3b0"/>';
  for(var j=0;j<4;j++)bl+='<circle cx="104" cy="'+(46+j*17)+'" r="3" fill="#ffe3b0"/><circle cx="256" cy="'+(46+j*17)+'" r="3" fill="#ffe3b0"/>';
  b=w+'<rect y="120" width="360" height="76" class="f2"/><path d="M0 120H360" class="st"/>'+
  '<rect x="96" y="26" width="168" height="84" class="f2"/><rect x="108" y="40" width="144" height="64" fill="#9fc3d0" opacity=".14"/><rect x="108" y="40" width="144" height="64" class="st"/>'+bl+
  '<rect x="86" y="120" width="188" height="14" class="f4"/><rect x="94" y="134" width="8" height="62" class="f3"/><rect x="258" y="134" width="8" height="62" class="f3"/><rect x="112" y="136" width="64" height="30" class="f3"/><ellipse cx="170" cy="118" rx="70" ry="14" class="lt"/>'+
  '<path d="M286 60H352M290 60V196M346 60V196" class="st"/><path d="M302 62l-12 90h26l-8-90zM336 62l-8 80h18l-4-80z" class="f4"/><path d="M322 62l-10 100h28l-6-100z" class="f3"/>'+
  '<rect x="8" y="150" width="70" height="40" class="f3"/><rect x="8" y="138" width="70" height="16" class="f4"/>'+
  '<rect x="40" y="52" width="26" height="34" fill="#cfc7ac" opacity=".7"/><path d="M45 60h16M45 66h16M45 72h12" stroke="#22251f" opacity=".5"/>'+
  '<rect y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='pal'){
  var cf='';for(var i=0;i<12;i++)cf+='<rect x="'+(i*30)+'" y="0" width="14" height="150" class="f3" opacity=".7"/>';
  var rg='';for(var i=0;i<9;i++)rg+='M300 '+(80+i*12)+'h16';
  b=w+'<rect width="360" height="150" class="f2"/>'+cf+
  '<rect x="236" y="62" width="124" height="6" class="f4"/><path d="M240 62v-18M280 62v-18M320 62v-18M356 62v-18M256 44H360M240 68L226 150M356 68l4 82" class="st"/>'+
  '<rect x="224" y="52" width="28" height="4" class="f4" transform="rotate(-40 252 56)"/>'+
  '<path d="M300 68V196M316 68V196'+rg+'" class="st"/>'+
  '<path d="M0 0H360V26Q180 50 0 26Z" class="f1"/>'+
  '<rect y="150" width="360" height="70" class="f3"/><rect y="150" width="360" height="6" class="f4"/><path d="M0 170H360M0 190H360" class="st" opacity=".5"/>'+
  '<ellipse cx="190" cy="172" rx="90" ry="22" class="lt"/><path d="M178 178q10-14 26-10 20 4 30 12-10 10-30 8-16-2-26-10z" fill="none" stroke="#e8e2d4" stroke-dasharray="3 2" opacity=".6"/>';
 }
 if(id==='bil'){
  var br='';for(var i=0;i<8;i++)br+='<path d="M'+(114+i*22)+' 58v50" class="st"/>';
  b=w+'<rect y="150" width="360" height="70" class="f2"/>'+
  '<rect x="14" y="50" width="34" height="50" class="f4"/><path d="M20 62h22M20 70h22M20 78h14" class="st"/>'+
  '<rect x="60" y="34" width="240" height="116" class="f3"/><rect x="60" y="34" width="240" height="116" class="st"/>'+
  '<rect x="130" y="40" width="100" height="12" class="f1"/><path d="M138 46h84" stroke="#d0a649" opacity=".6"/>'+
  '<rect x="92" y="58" width="176" height="50" class="f1"/><rect x="92" y="58" width="176" height="50" fill="#9fc3d0" opacity=".1"/>'+br+
  '<rect x="76" y="108" width="208" height="12" class="f4"/><rect x="236" y="100" width="22" height="8" fill="#cfc7ac" opacity=".7"/>'+
  '<rect x="304" y="134" width="48" height="8" class="f4"/><rect x="310" y="142" width="6" height="54" class="f3"/><rect x="340" y="142" width="6" height="54" class="f3"/><rect x="316" y="127" width="20" height="8" fill="#cfc7ac" opacity=".75"/>'+
  '<rect y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='cab'){
  var fd='';for(var i=0;i<14;i++)fd+='<path d="M'+(56+i*15)+' 124v22" class="st"/><rect x="'+(53+i*15)+'" y="'+(128+(i%4)*5)+'" width="6" height="5" fill="#d0a649" opacity=".8"/>';
  b=w+'<rect x="30" y="34" width="300" height="62" class="f1"/><rect x="30" y="34" width="300" height="62" fill="#ffb561" opacity=".1"/><path d="M180 34v62" class="st"/><rect x="30" y="34" width="300" height="62" class="st"/>'+
  '<rect x="46" y="152" width="218" height="44" class="f2"/><rect x="40" y="118" width="230" height="34" class="f4"/><path d="M40 118l10-10h210l10 10" class="f3"/>'+fd+
  '<rect x="106" y="106" width="24" height="12" fill="#cfc7ac" opacity=".8" transform="rotate(-6 118 112)"/>'+
  '<rect x="280" y="152" width="68" height="8" class="f4"/><rect x="288" y="160" width="6" height="36" class="f3"/><rect x="336" y="160" width="6" height="36" class="f3"/>'+
  '<rect x="288" y="104" width="52" height="40" class="f1"/><rect x="291" y="107" width="46" height="34" fill="#9fc3d0" opacity=".22"/><path d="M291 124h46M314 107v34" class="st"/>'+
  '<rect x="0" y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='aad'){
  var br1='',br2='',gl1='';
  for(var i=0;i<3;i++){var bx=10+i*66;br1+='<rect x="'+bx+'" y="104" width="62" height="44" rx="12" class="f4"/><path d="M'+(bx+14)+' 104v44M'+(bx+48)+' 104v44" class="st"/><circle cx="'+(bx+31)+'" cy="126" r="4" class="f1"/>'}
  for(var j=0;j<2;j++){var by=42+j*66;br2+='<rect x="'+by+'" y="60" width="62" height="44" rx="12" class="f3"/><path d="M'+(by+14)+' 60v44M'+(by+48)+' 60v44" class="st"/><circle cx="'+(by+31)+'" cy="82" r="4" class="f1"/>'}
  for(var k=0;k<3;k++)gl1+='<rect x="'+(232+k*22)+'" y="96" width="9" height="22" class="f4"/><rect x="'+(235+k*22)+'" y="88" width="3" height="9" class="f4"/>';
  b=w+'<rect width="360" height="150" class="f2"/><path d="M0 0H360V64Q180 14 0 64Z" class="f1"/><path d="M70 0Q66 40 44 70M180 0V40M290 0Q294 40 316 70" class="st" opacity=".6"/>'+
  '<rect y="148" width="360" height="72" class="f3"/><rect y="148" width="360" height="6" class="f4"/><path d="M0 172H360M0 194H360" class="st" opacity=".5"/>'+
  '<rect x="6" y="146" width="204" height="6" class="f4"/>'+br1+br2+
  '<rect x="92" y="112" width="22" height="28" fill="#cfc7ac" opacity=".75"/><path d="M96 120h14M96 126h14M96 132h10" stroke="#22251f" opacity=".5"/>'+
  '<path d="M280 0v50" class="st"/><path d="M266 52h28l-6-12h-16z" class="f4"/>'+
  '<rect x="216" y="118" width="128" height="10" class="f4"/><rect x="222" y="128" width="8" height="68" class="f3"/><rect x="330" y="128" width="8" height="68" class="f3"/>'+gl1+
  '<path d="M300 112h10l-2 6q-3 3-6 0zM318 112h10l-2 6q-3 3-6 0z" fill="#d9c9d0" opacity=".6"/><rect x="296" y="112" width="34" height="6" fill="#cfc7ac" opacity=".8" transform="translate(0 -6)"/>'+
  '<ellipse cx="280" cy="120" rx="58" ry="12" class="lt"/><rect y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='alg'){
  var tk='';
  for(var i=0;i<2;i++){var tx=12+i*54;tk+='<rect x="'+tx+'" y="46" width="48" height="108" rx="10" class="f4"/><rect x="'+(tx+6)+'" y="52" width="8" height="96" fill="#9fc3d0" opacity=".15"/><path d="M'+tx+' 70h48M'+tx+' 130h48" class="st"/><rect x="'+(tx+16)+'" y="154" width="6" height="40" class="f3"/><rect x="'+(tx+30)+'" y="154" width="6" height="40" class="f3"/>'}
  var bl='';for(var j=0;j<4;j++)bl+='<path d="M'+(302+j*0)+' '+(40)+'L'+(302+Math.cos(j*1.57+.4)*18)+' '+(52+Math.sin(j*1.57+.4)*18)+'" class="st"/>';
  b=w+'<rect width="360" height="150" class="f2"/><path d="M0 30H360M0 38H360" class="st"/>'+
  '<rect y="150" width="360" height="70" class="f3"/><rect y="150" width="360" height="6" class="f4"/><path d="M0 176H360M0 198H360" class="st" opacity=".5"/>'+tk+
  '<path d="M60 46V30M66 154v-20H128" class="st"/>'+
  '<rect x="124" y="138" width="116" height="8" class="f4"/><rect x="130" y="146" width="6" height="46" class="f3"/><rect x="228" y="146" width="6" height="46" class="f3"/><rect x="166" y="124" width="22" height="14" class="f1"/><rect x="170" y="128" width="14" height="5" fill="#9fe0c0" opacity=".35"/>'+
  '<circle cx="302" cy="52" r="26" class="f3"/><circle cx="302" cy="52" r="26" class="st"/><circle cx="302" cy="52" r="3" class="f4"/>'+bl+'<path d="M302 52L284 44M302 52L320 44M302 52L296 72M302 52L312 72" class="st"/>'+
  '<rect x="286" y="96" width="56" height="48" class="f1"/><rect x="286" y="96" width="56" height="48" class="st"/><rect x="292" y="102" width="44" height="10" fill="#9fe0c0" opacity=".28"/><circle cx="298" cy="124" r="4" class="f4"/><circle cx="314" cy="124" r="4" class="f4"/><circle cx="330" cy="124" r="4" fill="#c8503a" opacity=".8"/>'+
  '<rect y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='aof'){
  var fl='';for(var i=0;i<4;i++){fl+='<rect x="14" y="'+(30+i*30)+'" width="80" height="24" class="f3"/>';for(var j=0;j<6;j++)fl+='<rect x="'+(18+j*13)+'" y="'+(33+i*30)+'" width="9" height="18" class="f4" opacity="'+(.55+((i+j)%3)*.2)+'"/>'}
  b=w+'<rect width="360" height="150" class="f2"/>'+fl+
  '<rect x="130" y="26" width="104" height="62" class="f1"/><rect x="130" y="26" width="104" height="62" fill="#9fc3d0" opacity=".1"/><rect x="130" y="26" width="104" height="62" class="st"/><path d="M182 26v62M130 57h104" class="st"/><circle cx="212" cy="44" r="7" class="f4" opacity=".8"/>'+
  '<rect x="276" y="44" width="68" height="56" class="f3"/><rect x="276" y="44" width="68" height="56" class="st"/><rect x="298" y="62" width="30" height="34" fill="#cfc7ac" opacity=".8"/><path d="M302 70h22M302 76h22M302 82h14" stroke="#22251f" opacity=".5"/><circle cx="313" cy="58" r="2.5" fill="#c8503a"/>'+
  '<rect y="150" width="360" height="70" class="f3"/><rect y="150" width="360" height="6" class="f4"/><path d="M0 176H360M0 198H360" class="st" opacity=".5"/>'+
  '<rect x="96" y="130" width="170" height="14" class="f4"/><rect x="104" y="144" width="8" height="52" class="f3"/><rect x="250" y="144" width="8" height="52" class="f3"/><rect x="108" y="146" width="62" height="30" class="f2"/>'+
  '<rect x="140" y="118" width="40" height="12" fill="#cfc7ac" opacity=".8" transform="rotate(-4 160 124)"/><path d="M146 122h26M146 126h18" stroke="#22251f" opacity=".5"/><rect x="214" y="112" width="12" height="18" class="f1"/><rect x="216" y="106" width="8" height="8" fill="#ffd9a0" opacity=".7"/>'+
  '<ellipse cx="180" cy="130" rx="72" ry="12" class="lt"/><rect y="196" width="360" height="24" class="f2"/>';
 }
 if(id==='apa'){
  var vn='';for(var i=0;i<9;i++){var vx=-20+i*46;vn+='<path d="M'+vx+' 220L'+(176+(vx-176)*.12)+' 118" class="st" opacity=".7"/>';}
  var ps2='';for(var j=0;j<6;j++){var py=130+j*j*2.6+j*8;ps2+='<rect x="'+(60+j*4)+'" y="'+py+'" width="3" height="'+(8+j*3)+'" class="f4" opacity=".7"/><rect x="'+(290-j*4)+'" y="'+py+'" width="3" height="'+(8+j*3)+'" class="f4" opacity=".7"/>'}
  b=w+'<rect width="360" height="120" class="f2"/><circle cx="60" cy="40" r="13" class="f4" opacity=".75"/><path d="M0 118Q90 100 180 114T360 112V220H0Z" class="f3"/>'+vn+ps2+
  '<path d="M0 150H360M0 176H360" class="st" opacity=".35"/>'+
  '<rect x="266" y="66" width="78" height="92" class="f3"/><rect x="258" y="58" width="94" height="12" class="f4"/><rect x="276" y="104" width="46" height="54" class="f1"/><rect x="282" y="98" width="16" height="24" class="f1"/><rect x="284" y="104" width="12" height="12" fill="#9fe0c0" opacity=".3"/><circle cx="290" cy="124" r="2.5" fill="#c8503a"/><rect x="304" y="82" width="30" height="16" fill="#cfc7ac" opacity=".5"/>'+
  '<rect x="44" y="136" width="56" height="22" class="f4"/><rect x="58" y="116" width="28" height="22" class="f3"/><rect x="62" y="120" width="20" height="12" fill="#9fc3d0" opacity=".18"/><circle cx="52" cy="160" r="13" class="f2"/><circle cx="52" cy="160" r="13" class="st"/><circle cx="94" cy="164" r="9" class="f2"/><circle cx="94" cy="164" r="9" class="st"/><circle cx="46" cy="138" r="3.5" fill="#ffe3a0"/><rect x="62" y="128" width="16" height="9" fill="#cfc7ac" opacity=".75"/>'+
  '<rect y="196" width="360" height="24" class="f2"/>';
 }

 return b+(ps?ps.map(person).join(''):'')+FX(id)
}

/** SVG completo (menu e cutscenes), sem pontos de investigação. */
export function sceneSvg(id: SceneId, ps?: Person[], slice = false): string {
 return '<svg viewBox="0 0 360 220"'+(slice?' preserveAspectRatio="xMidYMid slice"':'')+' role="img" aria-label="Cena: '+sceneName(id)+'">'+scenery(id,ps)+'</svg>'
}

/** Conteúdo interno da cena (para o React desenhar os pontos por cima). */
export function sceneInner(id: SceneId): string { return scenery(id) }

const CUTS_IMP: Record<string, CutFrame[]> = {
  intro: [
    { t: 'Teatro Imperial. 23h05.', d: 3200 },
    { sc: 'pal', t: 'A estreia terminou em aplausos. Vinte minutos depois, o diretor Sérgio Prado estava morto sob a varanda técnica.' },
    { sc: 'bil', z: 'out', t: 'Casa cheia, caixa suspeito. Alguém precisava que a noite acabasse bem.', p: [{ k: 'ota', x: 178, y: 80, e: 1 }] },
    { sc: 'cam', t: 'Todos tinham algo a perder com Sérgio.', p: [{ k: 'liv', x: 200, y: 84, s: 0.95, e: 1, r: -6 }] },
    { sc: 'cab', z: 'out', t: 'A polícia só chega ao amanhecer. Você tem a noite.', p: [{ k: 'cai', x: 96, y: 86 }] },
    { t: 'O Caso Imperial', d: 3500 },
  ],
  end: [
    { t: 'Madrugada.', d: 3000 },
    { sc: 'pal', t: 'Sérgio ia auditar a bilheteria na manhã seguinte. Otávio não podia permitir.' },
    { sc: 'cab', z: 'out', t: 'A câmera de serviço mostrou o que o produtor jurou nunca ter feito.', p: [{ k: 'cai', x: 96, y: 86, e: 1 }] },
    { sc: 'bil', t: 'O borderô contou o resto: ingressos vendidos, dinheiro que nunca chegou ao cofre.', p: [{ k: 'ota', x: 178, y: 80, r: 8, e: 1 }] },
    { t: 'Caso encerrado', d: 3500 },
  ],
}

const CUTS_AUR: Record<string, CutFrame[]> = {
  intro: [
    { t: 'Vinícola Aurora. 21h45.', d: 3200 },
    { sc: 'aad', t: 'A noite de colheita terminava em brindes. Vinte minutos depois, Ângelo Bertoni foi achado no lagar.' },
    { sc: 'alg', z: 'out', t: 'Sem ferimentos. Sem testemunhas. Só o ar parado de uma sala de fermentação.', p: [{ k: 'dan', x: 178, y: 80, e: 1 }] },
    { sc: 'aof', t: 'Todos tinham algo a perder com Ângelo.', p: [{ k: 'bia', x: 200, y: 84, s: 0.95, e: 1, r: -6 }] },
    { sc: 'apa', z: 'out', t: 'A estrada de terra alagou. A polícia só chega ao amanhecer. Você tem a noite.', p: [{ k: 'lui', x: 96, y: 86 }] },
    { t: 'O Caso Aurora', d: 3500 },
  ],
  end: [
    { t: 'Madrugada.', d: 3000 },
    { sc: 'alg', t: 'Ângelo exigiria explicações pela manhã. Dante não podia esperar.' },
    { sc: 'apa', z: 'out', t: 'O cartão de acesso mostrou o que o enólogo jurou nunca ter feito.', p: [{ k: 'lui', x: 96, y: 86, e: 1 }] },
    { sc: 'aad', t: 'O livro de lotes contou o resto: garrafas demais para barricas de menos.', p: [{ k: 'dan', x: 178, y: 80, r: 8, e: 1 }] },
    { t: 'Caso encerrado', d: 3500 },
  ],
}

export const CUTS: Record<string, Record<'intro' | 'end', CutFrame[]>> = {
  valverde: CUTS_RAW as Record<'intro' | 'end', CutFrame[]>,
  imperial: CUTS_IMP as Record<'intro' | 'end', CutFrame[]>,
  aurora: CUTS_AUR as Record<'intro' | 'end', CutFrame[]>,
  galeria: {
    intro: [
      { t: 'Galeria Serra. Uma tela rara foi atestada na véspera.', d: 4000 },
      { t: 'Na manhã seguinte, Eduardo Serra foi achado morto no ateliê de restauro.', d: 4500 },
      { t: 'Quatro pessoas tinham acesso àquele andar. Uma delas trocou a verdade por uma cópia.', d: 4500 },
      { t: 'Caso 004 · O Caso Ateliê', d: 3000 },
    ],
    end: [
      { t: 'A tela original estava dentro da mala. A cópia tinha a assinatura de quem a pintou.', d: 4500 },
      { t: 'Caso encerrado', d: 3000 },
    ],
  },
  farol: {
    intro: [
      { t: 'Ponta do Farol. Uma tempestade derrubou a energia da costa.', d: 4000 },
      { t: 'Na base da torre, o faroleiro Joaquim Mota foi encontrado morto.', d: 4000 },
      { t: 'Naquela noite, a luz se apagou, e um navio quase bateu nas pedras.', d: 4500 },
      { t: 'Caso 005 · O Caso Farol', d: 3000 },
    ],
    end: [
      { t: 'A chave da lâmpada estava na caixa de ferro, e só dois homens sabiam onde ela ficava.', d: 4500 },
      { t: 'Caso encerrado', d: 3000 },
    ],
  },
  trem: {
    intro: [
      { t: 'Trem noturno, rumo ao norte. Três horas de viagem pela serra.', d: 4000 },
      { t: 'Às 3h, a cabine 7 foi arrombada por dentro. Renato Duarte estava morto.', d: 4500 },
      { t: 'O trem parou no meio da noite, sem autorização. Alguém desceu.', d: 4000 },
      { t: 'Caso 006 · O Caso Trem Noturno', d: 3000 },
    ],
    end: [
      { t: 'O bilhete não usado estava guardado com a conta sem assinatura.', d: 4500 },
      { t: 'Caso encerrado', d: 3000 },
    ],
  },
  silencio: {
    intro: [
      { t: 'A casa de vidro ficou em silêncio na noite de Lorena Vasques.', d: 4000 },
      { t: 'O gerador desligou às pressas, e as gravações pararam de tocar.', d: 4000 },
      { t: 'Só quem zerou todos os casos chega até aqui. Não há tutorial.', d: 4000 },
      { t: 'Caso 007 · O Caso do Silêncio', d: 3000 },
    ],
    end: [
      { t: 'Hugo tentou apagar o último som, mas a fita cortada ainda guardava a voz.', d: 4500 },
      { t: 'Caso encerrado', d: 3000 },
    ],
  },
  origem: {
    intro: [
      { t: 'Seu primeiro caso. Uma joia de família sumiu da mansão Lima.', d: 4000 },
      { t: 'Três pessoas estavam em casa naquela noite. Só uma delas mentiu.', d: 4000 },
      { t: 'Comece pelas cenas. Toque nos pontos dourados.', d: 4000 },
      { t: 'Caso 000 · Onde Tudo Começou', d: 3000 },
    ],
    end: [
      { t: 'A joia foi encontrada onde ninguém tinha procurado.', d: 4000 },
      { t: 'Você resolveu seu primeiro caso. Foi aqui que tudo começou.', d: 4500 },
      { t: 'Caso encerrado', d: 3000 },
    ],
  },
}

/** Isola os ids do SVG (gradientes, filtros) para vários SVGs coexistirem na mesma página. */
function scope(svg: string, u: string): string {
  const ids = new Set([...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]))
  let o = svg
  ids.forEach((i) => {
    o = o.split('id="' + i + '"').join('id="' + u + i + '"').split('url(#' + i + ')').join('url(#' + u + i + ')')
  })
  return o
}
export const sceneSvgScoped = (id: SceneId, uid: string, ps?: Person[], slice = false) => scope(sceneSvg(id, ps, slice), uid)
