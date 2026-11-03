'use strict';
/* ===== Grunddaten ===== */
const TYPES=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel'];
const TDE={Normal:'Normal',Fire:'Feuer',Water:'Wasser',Electric:'Elektro',Grass:'Pflanze',Ice:'Eis',Fighting:'Kampf',Poison:'Gift',Ground:'Boden',Flying:'Flug',Psychic:'Psycho',Bug:'Käfer',Rock:'Gestein',Ghost:'Geist',Dragon:'Drache',Dark:'Unlicht',Steel:'Stahl'};
const TCOL={Normal:'#9a9a78',Fire:'#e8762f',Water:'#5a86e8',Electric:'#d9b51c',Grass:'#5fae45',Ice:'#6ec4c4',Fighting:'#b52f29',Poison:'#934493',Ground:'#c9a552',Flying:'#9180e0',Psychic:'#ee4d7d',Bug:'#93a51e',Rock:'#a8913a',Ghost:'#6a5590',Dragon:'#6634f0',Dark:'#6a5446',Steel:'#a3a3c0',Fairy:'#dc7ea3'};
const CH={ // Angriff -> [sehr effektiv, nicht sehr effektiv, keine Wirkung]
Normal:[[],['Rock','Steel'],['Ghost']],Fire:[['Grass','Ice','Bug','Steel'],['Fire','Water','Rock','Dragon'],[]],
Water:[['Fire','Ground','Rock'],['Water','Grass','Dragon'],[]],Electric:[['Water','Flying'],['Electric','Grass','Dragon'],['Ground']],
Grass:[['Water','Ground','Rock'],['Fire','Grass','Poison','Flying','Bug','Dragon','Steel'],[]],Ice:[['Grass','Ground','Flying','Dragon'],['Fire','Water','Ice','Steel'],[]],
Fighting:[['Normal','Ice','Rock','Dark','Steel'],['Poison','Flying','Psychic','Bug'],['Ghost']],Poison:[['Grass'],['Poison','Ground','Rock','Ghost'],['Steel']],
Ground:[['Fire','Electric','Poison','Rock','Steel'],['Grass','Bug'],['Flying']],Flying:[['Grass','Fighting','Bug'],['Electric','Rock','Steel'],[]],
Psychic:[['Fighting','Poison'],['Psychic','Steel'],['Dark']],Bug:[['Grass','Psychic','Dark'],['Fire','Fighting','Poison','Flying','Ghost','Steel'],[]],
Rock:[['Fire','Ice','Flying','Bug'],['Fighting','Ground','Steel'],[]],Ghost:[['Psychic','Ghost'],['Dark'],['Normal']],
Dragon:[['Dragon'],['Steel'],[]],Dark:[['Psychic','Ghost'],['Fighting','Dark'],[]],
Steel:[['Ice','Rock'],['Fire','Water','Electric','Steel'],[]]};
function eff(a,d){const c=CH[a];if(!c)return 1;if(c[2].includes(d))return 0;if(c[0].includes(d))return 2;if(c[1].includes(d))return .5;return 1}
function defMult(types){const o={};TYPES.forEach(a=>{o[a]=types.reduce((m,d)=>m*eff(a,d),1)});return o}
const CAT={phys:'Physisch',spez:'Speziell',status:'Status'};
const STATDE={atk:'Angriff',def:'Verteidigung',spa:'Spezial-Angriff',spd:'Spezial-Verteidigung',spe:'Initiative'};
const ICAT={'standard-balls':'Pokébälle','special-balls':'Pokébälle','apricorn-balls':'Pokébälle',healing:'Heilung',medicine:'Heilung','status-cures':'Statusheilung',revival:'Beleber','pp-recovery':'AP-Auffüllung',vitamins:'Vitamine','stat-boosts':'Kampf-Items',evolution:'Entwicklung','held-items':'Trage-Item',choice:'Trage-Item (Wahl)','type-enhancement':'Trage-Item (Typ-Verstärker)',plates:'Tafeln','species-specific':'Trage-Item (speziell)','type-protection':'Beeren (Typ-Schutz)','in-a-pinch':'Beeren','picky-healing':'Beeren','baking-only':'Beeren',other:'Sonstiges',jewels:'Juwelen',loot:'Wertsachen',collectibles:'Sammelobjekte','plot-advancement':'Basis-Item / Story',gameplay:'Basis-Item','dex-completion':'Fossilien & Co.',training:'Training','effort-training':'EV-Training','effort-drop':'EV-Beeren','bad-held-items':'Trage-Item (negativ)',scarves:'Tücher',flutes:'Flöten',spelunking:'Erkundung',mulch:'Mulch','event-items':'Event','data-cards':'Datenkarten','miracle-shooter':'Wunderwerfer',unused:'Unbenutzt'};
const LVDE=s=>s.replace(/No level shift based on difficulty, levels are as stated\./,'Keine Level-Anpassung nach Schwierigkeit – Level wie angegeben.').replace(/Levels -(\d+) on Easy mode, \+(\d+) on Challenge mode\.?/,'Level −$1 im Leicht-Modus, +$2 im Challenge-Modus.');
const TABDE={'Easy and Normal Mode':'Leicht & Normal','Challenge Mode':'Challenge-Modus','Black':'Black 2','White':'White 2'};
function methDE(m){if(!m)return'';const M=D.meth;if(M[m])return M[m];
 const r=[[/^Fish, Rippling Water$/,'Angeln (kräuselndes Wasser)'],[/^Surf, Rippling Water$/,'Surfen (kräuselndes Wasser)'],[/^Fish$/,'Angeln'],[/^Floor$/,'Boden'],[/^Swamps$/,'Sumpf'],[/^Shadows Overhead$/,'Schatten (fliegend)'],[/^Grass Doubles$/,'Gras (Doppelkampf)'],[/^Sewer$/,'Kanalisation'],[/^Room$/,'Raum'],[/^Rooms, Type Two$/,'Räume (Typ 2)'],[/^Special Gifts$/,'Geschenk'],[/^Static Encounter$/,'Feste Begegnung'],[/^Special Event(.*)$/,'Spezialbegegnung$1'],[/^Event Encounter(.*)$/,'Event-Begegnung$1'],[/^Sand, (Inside|Outside)$/,(x,a)=>'Sand ('+(a=='Inside'?'innen':'außen')+')'],[/^Hidden Grotto:\s*(.*)$/,'Versteckte Lichtung: $1']];
 for(const [p,t] of r)if(p.test(m))return m.replace(p,t);return m}

/* ===== Speicher ===== */
const LS={get(k,d){try{const v=localStorage.getItem('sgss_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('sgss_'+k,JSON.stringify(v))}catch(e){}}};
let FAV=new Set(LS.get('fav',[])),TEAM=LS.get('team',[]),CHK=new Set(LS.get('chk',[]));
const saveFav=()=>LS.set('fav',[...FAV]),saveTeam=()=>LS.set('team',TEAM),saveChk=()=>LS.set('chk',[...CHK]);

/* ===== Hilfen ===== */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nrm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/♀/g,'w').replace(/♂/g,'m').replace(/[^a-z0-9]+/g,' ').trim();
const tb=t=>`<span class="tb" style="background:${TCOL[t]||'#666'}">${esc(TDE[t]||t)}</span>`;
const both=(en,de)=>de&&de!==en?`${esc(en)} / ${esc(de)}`:esc(en);
let D=null,PK=[],PKN={},MVK={},ITK={},ABK={},AREA=[],AREAN={},TRP=[],TRPID={},GU=[];

/* ===== Suche ===== */
function score(q,terms){let best=9;for(const t of terms){if(!t)continue;
 if(t===q)return 0; if(t.startsWith(q))best=Math.min(best,1); else if((' '+t).includes(' '+q))best=Math.min(best,2); else if(t.includes(q))best=Math.min(best,3);}return best}
function search(list,q,keyfn,sortname){const n=nrm(q);if(!n)return list;const nc=n.replace(/ /g,'');
 const out=[];for(const x of list){const terms=keyfn(x);let s=score(n,terms);if(s>3)s=Math.min(s,score(nc,terms.map(t=>t.replace(/ /g,'')))+(s>3?0:0));if(s<=3)out.push([s,x])}
 out.sort((a,b)=>a[0]-b[0]||sortname(a[1]).localeCompare(sortname(b[1]),'de'));return out.map(o=>o[1])}

/* ===== Laden ===== */
async function boot(){
 try{const r=await fetch('data.json');D=await r.json()}catch(e){$('#list').innerHTML='<div class="warn">Daten konnten nicht geladen werden. Bitte Internetverbindung prüfen und die Seite neu laden.</div>';return}
 PK=D.pk;PK.forEach(p=>{p.key=nrm(p.en).replace(/ /g,'');PKN[p.key]=p});
 for(const [k,m] of Object.entries(D.mv)){m.k=k;MVK[k]=m}
 for(const [k,i] of Object.entries(D.it)){i.k=k;ITK[k]=i}
 for(const [k,a] of Object.entries(D.ab)){a.k=k;ABK[k]=a}
 D.tm.forEach(t=>{const m=MVK[t.mv];if(m){m.tm=m.tm||[];m.tm.push(t)}});
 AREA=D.areas;AREA.forEach((a,i)=>{a.i=i;AREAN[nrm(a.n)]=a});
 TRP=D.tr;TRP.forEach(p=>TRPID[p.id]=p);GU=D.gu;
 applyDe(LS.get('deNames',null));
 render();loadDeNames();
}
function applyDe(map){if(!map)return;PK.forEach(p=>{const base=map[p.id];if(!base)return;
 if(p.f===0)p.de=base;else{const sfx=p.en.includes(' - ')?' – '+p.en.split(' - ').slice(1).join(' - ').trim():'';p.de=base+sfx}})}
async function loadDeNames(force){
 const have=LS.get('deNames',null);if(have&&Object.keys(have).length>=490&&!force)return;
 try{const r=await fetch('https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv',{cache:'no-store'});if(!r.ok)throw 0;
  const t=await r.text(),map={};t.split('\n').forEach(l=>{const m=l.match(/^(\d+),6,("([^"]*)"|[^,]*)/);if(m){const id=+m[1];if(id<=493)map[id]=(m[3]??m[2]).trim()}});
  if(Object.keys(map).length<490)throw 0;LS.set('deNames',map);applyDe(map);if(TAB==='pk'&&!$('#sheet').classList.contains('open'))render();if(TAB==='mo')render();return true
 }catch(e){return false}}
function deCount(){return PK.filter(p=>p.f===0&&p.de).length}

/* ===== Navigation ===== */
let TAB='pk',LIMIT=80;const PH={pk:'Pokémon suchen (DE/EN)',it:'Item suchen (DE/EN)',mv:'TM-Nr., Attacke oder Fundort',ar:'Gebiet suchen, z. B. Route 4',mo:'Trainer, Fähigkeit, Seite …'};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{TAB=b.dataset.t;document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('on',x===b));$('#q').value='';$('#q').placeholder=PH[TAB];LIMIT=80;closeAll();render();window.scrollTo(0,0)});
const q=$('#q');q.addEventListener('input',()=>{LIMIT=80;$('#clr').style.display=q.value?'block':'none';render()});
$('#clr').onclick=()=>{q.value='';$('#clr').style.display='none';render();q.focus()};
q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const f=$('#list .row');if(f)f.click();q.blur()}});

/* Detailansicht (Stapel für "Zurück") */
let STACK=[];
function openView(fn,arg){STACK.push([fn,arg]);drawTop();}
function drawTop(){const s=$('#sheet');const [fn,arg]=STACK[STACK.length-1];const r=fn(arg);
 s.innerHTML=`<div class="sh-top"><button class="back" onclick="goBack()">‹ Zurück</button><div class="tt">${r.t}</div>${r.btn||''}</div><div class="sh-body">${r.h}</div>`;
 s.classList.add('open');s.scrollTop=0;document.body.style.overflow='hidden'}
function goBack(){STACK.pop();if(STACK.length)drawTop();else closeAll()}
function closeAll(){STACK=[];const s=$('#sheet');s.classList.remove('open');s.innerHTML='';document.body.style.overflow='';if(TAB==='mo'||TAB==='ar')render()}


/* ===== Listen ===== */
function rowPk(p){return `<button class="row" onclick="openView(vPk,'${p.key}')"><span class="no">#${String(p.id).padStart(3,'0')}</span><span class="nm"><div class="en">${esc(p.en)}</div><div class="de">${esc(p.de||'–')}</div></span><span class="side">${p.t.map(tb).join('')}</span></button>`}
function rowIt(i){return `<button class="row" onclick="openView(vIt,'${i.k}')"><span class="nm"><div class="en">${esc(i.en)}</div><div class="de">${esc(i.de||'–')}</div></span><span class="side small">${esc(ICAT[i.cat]||'')}</span></button>`}
function rowMv(m){const t=(m.tm||[])[0];return `<button class="row" onclick="openView(vMv,'${m.k}')">${t?`<span class="no">${t.n}</span>`:''}<span class="nm"><div class="en">${esc(m.en)}</div><div class="de">${esc(m.de||'–')}</div></span><span class="side">${tb(m.t)}</span></button>`}
function rowAr(a){const n=a.enc.length,c=a.items.length+a.tms.length;return `<button class="row" onclick="openView(vAr,${a.i})"><span class="nm"><div class="en">${esc(a.n)}</div><div class="de">${n?n+' Begegnungen':'Keine Wildbegegnungen'} · ${c} Items/TMs${a.pg?' · Postgame':''}</div></span></button>`}
function pager(arr,rowfn){let h=arr.slice(0,LIMIT).map(rowfn).join('');if(arr.length>LIMIT)h+=`<button class="more" onclick="LIMIT+=150;render()">Weitere ${arr.length-LIMIT} anzeigen</button>`;return h}
function render(){if(!D)return;const v=q.value.trim(),L=$('#list');let h='';
 if(TAB==='pk'){const r=search(PK,v,p=>[nrm(p.en),nrm(p.de),String(p.id),String(p.id).padStart(3,'0')],p=>p.en);
  if(!v&&deCount()<490)h+=`<div class="hint">Deutsche Pokémon-Namen: ${deCount()} von 493 geladen. Sie werden beim ersten Start aus dem Internet geladen und danach gespeichert.</div>`;
  h+=r.length?pager(r,rowPk):'<div class="hint">Kein Pokémon gefunden. Tipp: Deutsche und englische Namen funktionieren beide.</div>'}
 if(TAB==='it'){const all=Object.values(ITK).filter(i=>i.locs.length||i.buy.length||i.evo.length||i.note.length||i.txt);const r=search(all,v,i=>[nrm(i.en),nrm(i.de)],i=>i.en);h=r.length?pager(r,rowIt):'<div class="hint">Kein Item gefunden.</div>'}
 if(TAB==='mv'){let all=Object.values(MVK);if(!v){all=D.tm.map(t=>MVK[t.mv]).filter((m,i,a)=>m&&a.indexOf(m)===i);h='<div class="hint">Alle 95 TMs. Tippe eine TM-Nummer, einen Attackennamen (DE/EN) oder einen Fundort.</div>'}
  const r=search(all,v,m=>[nrm(m.en),nrm(m.de),...(m.tm||[]).flatMap(t=>[nrm(t.n),nrm(t.n.replace(/^TM0?/,'TM')),t.n.replace(/^TM0?/,''),nrm(t.loc)])],m=>((m.tm||[])[0]||{n:'ZZ'}).n+m.en);h+=r.length?pager(r,rowMv):'<div class="hint">Nichts gefunden.</div>'}
 if(TAB==='ar'){const r=search(AREA,v,a=>[nrm(a.n)],a=>a.n);h=pager(r,rowAr)}
 if(TAB==='mo')h=moreMenu(v);
 L.innerHTML=h}

/* ===== Pokémon-Detail ===== */
function natName(n){const x=D.nat.find(z=>z[0]===n);return x?`${x[0]} / ${x[1]}`:n}
function natPM(n){const x=D.nat.find(z=>z[0]===n);if(!x||!x[2])return'';return `<div class="pm"><span class="plus">+ ${STATDE[x[2]]}</span> &nbsp; <span class="minus">− ${STATDE[x[3]]}</span></div>`}
function mvLink(k,pre){const m=MVK[k];if(!m)return `<tr><td>${pre??''}</td><td>${esc(k)}</td><td></td><td></td></tr>`;
 return `<tr class="lk" onclick="openView(vMv,'${m.k}')"><td>${pre??''}</td><td><b>${esc(m.en)}</b><div class="small">${esc(m.de||'')}</div></td><td>${tb(m.t)}<div class="small">${CAT[m.c]||''}</div></td><td>${m.p??'–'}</td></tr>`}
function multHTML(types){const m=defMult(types),g={};for(const [t,v] of Object.entries(m)){(g[v]=g[v]||[]).push(t)}
 const lab=[[4,'4× Schwach'],[2,'2× Schwach'],[.5,'½ Resistent'],[.25,'¼ Resistent'],[0,'Immun']];
 return lab.filter(([v])=>g[v]).map(([v,l])=>`<div class="mult"><span class="small">${l}</span><span>${g[v].map(tb).join(' ')}</span></div>`).join('')}
function abLine(k,label){const a=ABK[k];if(!a)return'';return `<div style="margin:0 0 10px"><div><span class="small">${label}</span> <b>${both(a.en,a.de)}</b></div>${a.txt?`<div>${esc(a.txt)}</div>`:''}${a.fx?`<div class="small">Sacred Gold (EN): ${esc(a.fx)}</div>`:''}</div>`}
function vPk(key){const p=PKN[key];if(!p)return{t:'?',h:'Nicht gefunden'};const fk='pk:'+p.key;
 let h=`<div class="small">#${String(p.id).padStart(3,'0')}</div><div class="big">${esc(p.en)}</div><div class="big2">${esc(p.de||'deutscher Name noch nicht geladen')}</div><div style="margin-bottom:12px">${p.t.map(tb).join(' ')} ${p.role?`<span class="tag">${esc(p.role)}</span>`:''}</div>`;
 const inT=TEAM.includes(p.key);
 h+=`<button class="btn ${inT?'':'pri'}" onclick="toggleTeam('${p.key}')">${inT?'Aus Team entfernen':'Zum Team hinzufügen ('+TEAM.length+'/6)'}</button>`;
 // Wesen
 const n=p.nat;if(n){h+='<div class="card"><h3>Empfohlene Wesen</h3>';
  if(n.multi&&n.multi.length){h+=`<div class="small" style="margin-bottom:8px">${esc(n.note)}</div>`+n.multi.map(([f,ns])=>{const fp=PKN[nrm(f).replace(/ /g,'')];return `<div class="nat"><b>${both(f,fp&&fp.de)}</b><div>${ns.map(x=>natName(x)).join(' · ')}</div></div>`}).join('')}
  else{h+=n.r.map((r,i)=>`<div class="nat"><b>${i+1}. ${natName(r[0])}</b>${natPM(r[0])}<div class="small">${esc(r[1])}</div></div>`).join('');if(n.note)h+=`<div class="small">${esc(n.note)}</div>`}
  h+='<div class="small" style="margin-top:6px">Automatisch aus Sacred Gold-Basiswerten und -Attacken berechnet – Empfehlung, keine offizielle Angabe.</div></div>'}
 // Fundorte
 h+='<div class="card"><h3>Fundorte in Sacred Gold</h3>';
 if(p.enc.length){h+='<table><tr><th>Gebiet</th><th>Art</th><th>Lv.</th><th>%</th></tr>'+p.enc.map(e=>{const a=AREAN[nrm(e[0])];return `<tr class="lk" onclick="${a?`openView(vAr,${a.i})`:''}"><td>${esc(e[0])}${e[2]?`<div class="small">${esc(e[2])}</div>`:''}${a&&a.pg?' <span class="tag pg">Postgame</span>':''}</td><td>${esc(methDE(e[1]))}</td><td>${esc(e[3])}</td><td>${e[4]??''}</td></tr>`}).join('')+'</table>'}
 else h+='<div class="small">Nicht wild fangbar laut Wiki-Tabellen. Prüfe Entwicklung, Geschenk-Pokémon, Legendäre oder Tausche (Mehr → Seiten).</div>';
 h+='</div>';
 // Entwicklung
 h+='<div class="card"><h3>Entwicklung</h3>';
 if(p.pre){const pp=PKN[nrm(p.pre).replace(/ /g,'')];h+=`<div style="margin-bottom:8px"><span class="small">Entwickelt sich aus</span> <a onclick="openView(vPk,'${pp?pp.key:''}')" style="color:var(--ac)">${both(p.pre,pp&&pp.de)}</a></div>`}
 h+=p.evo.length?p.evo.map(e=>{const t=PKN[nrm(e.to).replace(/ /g,'')];return `<button class="btn" onclick="openView(vPk,'${t?t.key:''}')">→ <b>${both(e.to,t&&t.de)}</b><div class="small">${esc(e.m)}</div></button>`}).join(''):'<div class="small">Keine weitere Entwicklung.</div>';
 h+='</div>';
 // Werte
 if(p.s){const L=['KP','Angriff','Vert.','Sp.-Angr.','Sp.-Vert.','Init.'];h+='<div class="card"><h3>Basiswerte (Sacred Gold)</h3>'+p.s.map((v,i)=>{const d=p.vs&&p.vs[i]!==v?` <span class="small">(${p.vs[i]})</span>`:'';const c=v>=110?'#5fd08a':v>=80?'#c9d05f':v>=55?'#e8a64a':'#e86a4a';return `<div class="stat"><span class="small">${L[i]}</span><b>${v}</b><div class="bar"><i style="width:${Math.min(100,v/1.8)}%;background:${c}"></i></div></div>${d?`<div class="small" style="margin:-2px 0 4px 72px">Original: ${p.vs[i]}</div>`:''}`}).join('')+`<div class="small" style="margin-top:6px">Gesamt: ${p.s.reduce((a,b)=>a+b,0)}</div></div>`}
 // Fähigkeiten
 if(p.ab&&p.ab.length){const lab=['Fähigkeit 1','Fähigkeit 2','Versteckte Fähigkeit'];const seen=new Set();h+='<div class="card"><h3>Fähigkeiten</h3>'+p.ab.map((k,i)=>{const s=abLine(k,p.ab.length===3?lab[i]:'Fähigkeit');return s}).join('')+'</div>'}
 // Schwächen
 h+=`<div class="card"><h3>Schwächen & Resistenzen</h3>${multHTML(p.t)}<div class="small">Nach Typen berechnet (Sacred Gold mit Fee-Typ). Fähigkeiten wie Schwebe können das ändern.</div></div>`;
 if(p.ch.length)h+=`<div class="card"><h3>Sacred Gold-Änderungen</h3>${p.ch.map(c=>`<div>• ${esc(c)}</div>`).join('')}</div>`;
 if(p.held.length)h+=`<div class="card"><h3>Items wilder Exemplare</h3>${p.held.map(([pc,it])=>{const k=nrm(it).replace(/ /g,'');const i=ITK[k];return `<div>${pc}%: ${i?`<a style="color:var(--ac)" onclick="openView(vIt,'${k}')">${both(i.en,i.de)}</a>`:esc(it)}</div>`}).join('')}<div class="small">Gilt nicht in den EVless-Versionen.</div></div>`;
 // Attacken
 if(p.lv&&p.lv.length)h+=`<details class="card" open><summary>Level-Up-Attacken (${p.lv.length})</summary><table><tr><th>Lv.</th><th>Attacke</th><th>Typ</th><th>Stä.</th></tr>${p.lv.map(([l,k])=>mvLink(k,l)).join('')}</table></details>`;
 if(p.tm&&p.tm.length)h+=`<details class="card"><summary>TM-Attacken (${p.tm.length})</summary><table><tr><th>TM</th><th>Attacke</th><th>Typ</th><th>Stä.</th></tr>${p.tm.map(([n,k])=>mvLink(k,n)).join('')}</table></details>`;
 if(p.tu&&p.tu.length)h+=`<details class="card"><summary>Tutor-Attacken (${p.tu.length})</summary><table>${p.tu.map(k=>mvLink(k,'')).join('')}</table></details>`;
 if(p.em&&p.em.length)h+=`<details class="card"><summary>Attacken der Vorstufe (${p.em.length})</summary><table>${p.em.map(([f,l,k])=>mvLink(k,`<span class="small">${esc(f)} ${esc(l)}</span>`)).join('')}</table></details>`;
 return{t:both(p.en,p.de),h,btn:`<button class="iconbtn ${FAV.has(fk)?'on':''}" onclick="toggleFav('${fk}')">${FAV.has(fk)?'★':'☆'}</button>`}}
function toggleFav(k){FAV.has(k)?FAV.delete(k):FAV.add(k);saveFav();drawTop()}
function toggleTeam(k){const i=TEAM.indexOf(k);if(i>=0)TEAM.splice(i,1);else{if(TEAM.length>=6){alert('Dein Team ist voll (6). Entferne zuerst ein Pokémon.');return}TEAM.push(k)}saveTeam();drawTop()}

/* ===== Item-Detail ===== */
function vIt(k){const i=ITK[k];if(!i)return{t:'?',h:'Nicht gefunden'};const fk='it:'+k;
 let h=`<div class="big">${esc(i.en)}</div><div class="big2">${esc(i.de||'kein deutscher Name in den Daten')}</div>${i.cat?`<span class="tag">${esc(ICAT[i.cat]||i.cat)}</span>`:''}<div style="height:10px"></div>`;
 if(i.txt)h+=`<div class="card"><h3>Wirkung</h3><div>${esc(i.txt)}</div><div class="small" style="margin-top:4px">Offizieller deutscher Spieltext.</div></div>`;
 if(i.note.length)h+=`<div class="card"><h3>Sacred Gold-Besonderheiten</h3>${i.note.map(n=>`<div>• ${esc(n)}</div>`).join('')}</div>`;
 if(i.evo.length)h+=`<div class="card"><h3>Entwickelt</h3>${i.evo.map(([a,b])=>{const pa=PKN[nrm(a).replace(/ /g,'')],pb=PKN[nrm(b).replace(/ /g,'')];return `<button class="btn" onclick="openView(vPk,'${pa?pa.key:''}')">${both(a,pa&&pa.de)} → <b>${both(b,pb&&pb.de)}</b></button>`}).join('')}</div>`;
 h+='<div class="card"><h3>Fundorte in Sacred Gold</h3>'+(i.locs.length?'<table>'+i.locs.map(([a,qn,hid,m])=>{const ar=AREAN[nrm(a)];return `<tr class="lk" onclick="${ar?`openView(vAr,${ar.i})`:''}"><td>${esc(a)}</td><td>${qn>1?'×'+qn:''} ${hid?'<span class="tag h">Versteckt</span>':''}${m?`<span class="tag">${esc(m)}</span>`:''}</td></tr>`}).join('')+'</table>':'<div class="small">Kein Fundort in der Sacred Gold-Itemliste.</div>')+'</div>';
 if(i.buy.length)h+=`<div class="card"><h3>Kaufen</h3>${[...new Set(i.buy)].map(b=>`<div>• ${esc(b)}</div>`).join('')}${i.cost?`<div class="small" style="margin-top:4px">Preis: ${i.cost} ₽</div>`:''}</div>`;
 else if(i.cost)h+=`<div class="card"><h3>Preis</h3><div>${i.cost} ₽ <span class="small">(Verkaufswert = Hälfte)</span></div></div>`;
 return{t:both(i.en,i.de),h,btn:`<button class="iconbtn ${FAV.has(fk)?'on':''}" onclick="toggleFav('${fk}')">${FAV.has(fk)?'★':'☆'}</button>`}}

/* ===== Attacken-Detail ===== */
function vMv(k){const m=MVK[k];if(!m)return{t:'?',h:'Nicht gefunden'};
 let h=`<div class="big">${esc(m.en)}</div><div class="big2">${esc(m.de||'kein deutscher Name in den Daten')}</div><div style="margin-bottom:12px">${tb(m.t)} <span class="tag">${CAT[m.c]||m.c}</span></div>`;
 h+=`<div class="card"><dl class="kv"><dt>Stärke</dt><dd>${m.p??'–'}</dd><dt>Genauigkeit</dt><dd>${m.a??'–'}</dd><dt>AP</dt><dd>${m.pp??'–'}</dd><dt>Priorität</dt><dd>${m.pr||0}</dd></dl></div>`;
 (m.tm||[]).forEach(t=>{h+=`<div class="card"><h3>${t.n}</h3><div>Fundort: <b>${esc(t.loc)}</b></div>${t.old?`<div class="small">Ersetzt ${esc(t.old)} aus dem Original.</div>`:''}${t.chg?'<div class="small">Fundort gegenüber dem Original geändert.</div>':''}</div>`});
 if(m.txt)h+=`<div class="card"><h3>Wirkung</h3><div>${esc(m.txt)}</div><div class="small" style="margin-top:4px">Offizieller deutscher Spieltext (Original). Bei Sacred Gold-Änderungen gilt der Kasten unten.</div></div>`;
 if(m.ch&&m.ch.length)h+=`<div class="card"><h3>Sacred Gold-Änderungen</h3>${m.ch.map(c=>`<div>• ${esc(c)}</div>`).join('')}</div>`;
 if(m.fx)h+=`<details class="card"><summary>Effekt laut Sacred Gold-Daten (EN)</summary><div>${esc(m.fx)}</div></details>`;
 const lv=[],tm=[];PK.forEach(p=>{const l=(p.lv||[]).find(x=>x[1]===k);if(l)lv.push([p,l[0]]);if((p.tm||[]).some(x=>x[1]===k))tm.push(p)});
 if(lv.length)h+=`<details class="card"><summary>Lernen per Level-Up (${lv.length})</summary>${lv.map(([p,l])=>`<div class="chk" onclick="openView(vPk,'${p.key}')"><span>Lv. ${l} – ${both(p.en,p.de)}</span></div>`).join('')}</details>`;
 if(tm.length)h+=`<details class="card"><summary>Lernen per TM (${tm.length})</summary>${tm.map(p=>`<div class="chk" onclick="openView(vPk,'${p.key}')"><span>${both(p.en,p.de)}</span></div>`).join('')}</details>`;
 return{t:both(m.en,m.de),h}}

/* ===== Gebiet-Detail ===== */
function ck(id,label,extra){const on=CHK.has(id);return `<label class="chk ${on?'done':''}"><input type="checkbox" ${on?'checked':''} onchange="tick('${id.replace(/'/g,"\\'")}',this)"><span>${label}${extra||''}</span></label>`}
function tick(id,el){el.checked?CHK.add(id):CHK.delete(id);saveChk();el.parentNode.classList.toggle('done',el.checked)}
function vAr(i){const a=AREA[i];if(!a)return{t:'?',h:''};let h=`<div class="big">${esc(a.n)}</div>${a.pg?'<span class="tag pg">Postgame</span>':''}<div style="height:10px"></div>`;
 if(a.enc.length){const g={};a.enc.forEach(e=>{const k=(e[2]?e[2]+' – ':'')+methDE(e[1]);(g[k]=g[k]||[]).push(e)});
  h+='<div class="card"><h3>Wilde Pokémon</h3>'+Object.entries(g).map(([k,es])=>`<div style="margin:8px 0 2px;font-weight:600">${esc(k)}</div><table>${es.map(e=>{const p=PKN[nrm(e[0]).replace(/ /g,'')];const id=`${a.n}|pk|${e[0]}`;return `<tr><td style="width:34px"><input type="checkbox" style="width:24px;height:24px;accent-color:var(--ac)" ${CHK.has(id)?'checked':''} onchange="tick('${id.replace(/'/g,"\\'")}',this)" title="gefangen"></td><td class="lk" onclick="openView(vPk,'${p?p.key:''}')"><b>${esc(e[0])}</b><div class="small">${esc(p&&p.de||'')}</div></td><td>${p?p.t.map(tb).join(' '):''}</td><td>Lv. ${esc(e[3])}<div class="small">${e[4]??''}%</div></td></tr>`}).join('')}</table>`).join('')+'<div class="small" style="margin-top:6px">Häkchen = gefangen (wird gespeichert).</div></div>'}
 if(a.items.length){h+='<div class="card"><h3>Items (Checkliste)</h3>'+a.items.map((it,j)=>{const id=`${a.n}|it|${j}`;let lab;
  if(it.tm){const t=D.tm.find(x=>x.n===it.tm);const m=t&&MVK[t.mv];lab=`<b>${it.tm}</b> ${m?both(m.en,m.de):esc(it.n)}`}
  else{const x=it.k&&ITK[it.k];lab=x?both(x.en,x.de):esc(it.n)}
  return ck(id,lab,`${it.q>1?' ×'+it.q:''} ${it.h?'<span class="tag h">Versteckt</span>':''}${it.m?`<span class="tag">${esc(it.m)}</span>`:''}`)}).join('')+'</div>'}
 if(a.tms.length){const inItems=new Set(a.items.filter(x=>x.tm).map(x=>x.tm));const rest=a.tms.filter(t=>!inItems.has(t));
  if(rest.length)h+='<div class="card"><h3>TMs an diesem Ort</h3>'+rest.map(n=>{const t=D.tm.find(x=>x.n===n);const m=t&&MVK[t.mv];return ck(`${a.n}|tm|${n}`,`<b>${n}</b> ${m?both(m.en,m.de):''}`,t?`<div class="small">${esc(t.loc)}</div>`:'')}).join('')+'</div>'}
 if(a.tr.length)h+='<div class="card"><h3>Trainer</h3>'+a.tr.map(id=>`<button class="btn" onclick="openView(vTrP,'${id}')">${esc(TRPID[id].title)}</button>`).join('')+'</div>';
 if(!a.enc.length&&!a.items.length&&!a.tms.length)h+='<div class="hint">Für dieses Gebiet sind keine Daten hinterlegt.</div>';
 h+='<div class="small">Geschenk-Pokémon, NPCs und Tausche findest du unter Mehr → Seiten.</div>';
 return{t:esc(a.n),h}}

/* ===== Trainer ===== */
function monTypes(n){const p=PKN[nrm(n).replace(/ /g,'')];return p?p.t:[]}
function counterTypes(mons){const c={};TYPES.forEach(t=>{let se=0,res=0;mons.forEach(m=>{const ty=monTypes(m.n);if(!ty.length)return;const v=ty.reduce((x,d)=>x*eff(t,d),1);if(v>=2)se++;if(v<1)res++});c[t]=[se,res]});
 return Object.entries(c).filter(([t,[se,res]])=>se>0).sort((a,b)=>(b[1][0]-b[1][1])-(a[1][0]-a[1][1])).slice(0,4)}
function vTrP(id){const p=TRPID[id];let h=`<div class="big">${esc(p.title)}</div><div style="height:8px"></div>`;
 p.secs.forEach(s=>{h+=`<div style="margin:14px 0 6px"><b style="font-size:17px">${esc(s.h)}</b>${s.tab?` <span class="tag ${/Challenge/.test(s.tab)?'h':''}">${esc(TABDE[s.tab]||s.tab)}</span>`:''}</div>`;
  if(s.info.length)h+=`<div class="small" style="margin-bottom:6px">${s.info.map(x=>esc(LVDE(x))).join('<br>')}</div>`;
  s.tr.forEach(t=>{const imp=t.fl.includes('Pflicht')||/LEADER|CHAMPION|ELITE|HUGH|COLRESS|GHETSIS|ZINZOLIN|SHADOW|N\b/i.test(t.n);
   h+=`<details class="card" ${imp&&t.mons.length?'open':''}><summary>${esc(t.n)} <span class="small" style="margin-left:6px">${t.mons.length} Pkm${t.mons.length?' · Lv. '+Math.max(...t.mons.map(m=>+m.lv||0)):''}</span></summary>${t.fl.map(f=>`<span class="tag ${f==='Level-Cap'?'h':''}">${f}</span>`).join('')}`;
   if(t.mons.length){const ct=counterTypes(t.mons);if(ct.length)h+=`<div class="okbox">Gut dagegen: ${ct.map(([ty,[se]])=>tb(ty)+` <span class="small">trifft ${se}/${t.mons.length}</span>`).join(' ')}<div class="small">Automatisch berechnet: Typen, die die meisten Pokémon dieses Trainers sehr effektiv treffen.</div></div>`}
   t.mons.forEach(m=>{const pk=PKN[nrm(m.n).replace(/ /g,'')],ab=ABK[nrm(m.ab||'').replace(/ /g,'')],it=m.it&&ITK[nrm(m.it).replace(/ /g,'')];
    h+=`<div class="mon"><div class="lk" onclick="${pk?`openView(vPk,'${pk.key}')`:''}"><b>${both(m.n,pk&&pk.de)}</b> <span class="small">Lv. ${esc(m.lv)}</span> ${pk?pk.t.map(tb).join(' '):''}</div>
     <div class="small">Fähigkeit: ${ab?both(ab.en,ab.de):esc(m.ab||'–')}${m.it?` · Item: ${it?both(it.en,it.de):esc(m.it)}`:''}</div>
     <div style="font-size:14px">${m.mv.map(x=>{const mv=MVK[nrm(x).replace(/ /g,'')];return mv?`<span style="color:${TCOL[mv.t]}">●</span> ${both(mv.en,mv.de)}`:esc(x)}).join('<br>')}</div>
     ${pk?`<div class="small">Schwach gegen: ${Object.entries(defMult(pk.t)).filter(([,v])=>v>=2).map(([t,v])=>TDE[t]+(v>=4?' (4×)':'')).join(', ')||'–'}</div>`:''}</div>`});
   h+='</details>'})});
 return{t:esc(p.title),h}}

/* ===== Mehr ===== */
function moreMenu(v){if(v){const n=nrm(v);let h='';
  const tr=[];TRP.forEach(p=>{p.secs.forEach(s=>s.tr.forEach(t=>{if(nrm(t.n).includes(n)||nrm(p.title).includes(n))tr.push([p,t])}))});
  const seen=new Set();h+=tr.filter(([p,t])=>{const k=p.id+t.n;if(seen.has(k))return false;seen.add(k);return true}).slice(0,40).map(([p,t])=>`<button class="row" onclick="openView(vTrP,'${p.id}')"><span class="nm"><div class="en">${esc(t.n)}</div><div class="de">${esc(p.title)}</div></span></button>`).join('');
  const ab=search(Object.values(ABK),v,a=>[nrm(a.en),nrm(a.de)],a=>a.en).slice(0,20);h+=ab.map(a=>`<button class="row" onclick="openView(vAb,'${a.k}')"><span class="nm"><div class="en">${esc(a.en)}</div><div class="de">${esc(a.de||'')} · Fähigkeit</div></span></button>`).join('');
  h+=GU.filter(g=>nrm(g.t).includes(n)).map(g=>`<button class="row" onclick="openView(vGu,'${g.id}')"><span class="nm"><div class="en">${esc(g.t)}</div></span></button>`).join('');
  return h||'<div class="hint">Nichts gefunden.</div>'}
 const dc=deCount();
 return `<button class="btn" onclick="openView(vTrList)">⚔︎ Trainer & Arenaleiter</button>
 <button class="btn" onclick="openView(vTeam)">◎ Team-Planer (${TEAM.length}/6)</button>
 <button class="btn" onclick="openView(vTypes)">◐ Typenhelfer</button>
 <button class="btn" onclick="openView(vFav)">★ Favoriten (${FAV.size})</button>
 <button class="btn" onclick="openView(vAbList)">✧ Fähigkeiten</button>
 <div class="hint" style="margin-top:10px">Seiten aus dem Sacred Gold-Wiki (englischer Originaltext):</div>
 ${GU.map(g=>`<button class="btn" onclick="openView(vGu,'${g.id}')">${esc(g.t)}</button>`).join('')}
 <div class="card" style="margin-top:14px"><h3>Daten</h3><div class="small">Quelle: Blaze Black 2 Sacred Gold Wiki (SmilingZero), Stand v1.4.1. Deutsche Namen & Spieltexte: PokéAPI.</div>
 <div class="small" style="margin-top:6px">Deutsche Pokémon-Namen: ${dc} von 493.</div>${dc<493?'<button class="btn pri" style="margin-top:8px" onclick="reloadDe(this)">Deutsche Namen jetzt laden</button>':''}</div>`}
async function reloadDe(b){b.textContent='Lädt …';const ok=await loadDeNames(true);b.textContent=ok?'Geladen ✓':'Fehlgeschlagen – Internet prüfen';render()}
function vTrList(){const main=TRP.filter(p=>!p.pg),pg=TRP.filter(p=>p.pg);
 const btn=p=>`<button class="btn" onclick="openView(vTrP,'${p.id}')">${esc(p.title)}</button>`;
 return{t:'Trainer',h:`<div class="hint">Tipp: Im Reiter „Mehr“ kannst du direkt nach Trainernamen suchen.</div>${main.map(btn).join('')}<div class="hint">Postgame & Sonstige</div>${pg.map(btn).join('')}`}}
function vAb(k){const a=ABK[k];return{t:both(a.en,a.de),h:`<div class="big">${esc(a.en)}</div><div class="big2">${esc(a.de||'')}</div>${a.txt?`<div class="card"><h3>Wirkung</h3>${esc(a.txt)}<div class="small" style="margin-top:4px">Offizieller deutscher Spieltext (Original).</div></div>`:''}${a.fx?`<div class="card"><h3>Sacred Gold-Beschreibung (EN)</h3>${esc(a.fx)}</div>`:''}
 <details class="card"><summary>Pokémon mit dieser Fähigkeit</summary>${PK.filter(p=>(p.ab||[]).includes(k)).map(p=>`<div class="chk" onclick="openView(vPk,'${p.key}')"><span>${both(p.en,p.de)}${p.ab[2]===k&&p.ab.length===3?' <span class="tag">versteckt</span>':''}</span></div>`).join('')}</details>`}}
function vAbList(){const l=Object.values(ABK).filter(a=>a.en&&a.en!=='N/A').sort((a,b)=>a.en.localeCompare(b.en));return{t:'Fähigkeiten',h:l.map(a=>`<button class="row" onclick="openView(vAb,'${a.k}')"><span class="nm"><div class="en">${esc(a.en)}</div><div class="de">${esc(a.de||'')}</div></span></button>`).join('')}}
function vGu(id){const g=GU.find(x=>x.id===id);return{t:esc(g.t),h:`<div class="small" style="margin-bottom:8px">Originaltext aus dem Sacred Gold-Wiki (Englisch).</div><div class="guide">${g.h}</div>`}}
function vFav(){const ps=[...FAV].filter(f=>f.startsWith('pk:')).map(f=>PKN[f.slice(3)]).filter(Boolean),is=[...FAV].filter(f=>f.startsWith('it:')).map(f=>ITK[f.slice(3)]).filter(Boolean);
 return{t:'Favoriten',h:(ps.length||is.length)?`${ps.length?'<div class="hint">Pokémon</div>'+ps.map(rowPk).join(''):''}${is.length?'<div class="hint">Items</div>'+is.map(rowIt).join(''):''}`:'<div class="hint">Noch keine Favoriten. Tippe in einer Detailansicht oben rechts auf ☆.</div>'}}
let TSEL=[];
function vTypes(){let h='<div class="hint">Wähle einen oder zwei Typen.</div><div class="chips">'+TYPES.map(t=>`<button class="chip ${TSEL.includes(t)?'on':''}" onclick="selT('${t}')" style="${TSEL.includes(t)?'':`border-color:${TCOL[t]}55`}">${TDE[t]} <span class="small">${t}</span></button>`).join('')+'</div>';
 if(TSEL.length){h+=`<div class="card" style="margin-top:14px"><h3>Verteidigung: ${TSEL.map(tb).join(' ')}</h3>${multHTML(TSEL)}</div>`;
  TSEL.forEach(a=>{const c=CH[a];h+=`<div class="card"><h3>Angriff mit ${tb(a)}</h3><div class="mult"><span class="small">Sehr effektiv</span><span>${c[0].map(tb).join(' ')||'–'}</span></div><div class="mult"><span class="small">Nicht sehr eff.</span><span>${c[1].map(tb).join(' ')||'–'}</span></div><div class="mult"><span class="small">Keine Wirkung</span><span>${c[2].map(tb).join(' ')||'–'}</span></div></div>`})}
 h+='<div class="small">Typentabelle der 4. Generation ohne Fee-Typ. Stahl resistiert Geist und Unlicht.</div>';
 return{t:'Typenhelfer',h}}
function selT(t){const i=TSEL.indexOf(t);if(i>=0)TSEL.splice(i,1);else{TSEL.push(t);if(TSEL.length>2)TSEL.shift()}drawTop()}
function vTeam(){const mons=TEAM.map(k=>PKN[k]).filter(Boolean);let h='';
 if(!mons.length)return{t:'Team-Planer',h:'<div class="hint">Noch kein Team. Öffne ein Pokémon und tippe auf „Zum Team hinzufügen“. Das Team bleibt auf diesem iPhone gespeichert.</div>'};
 h+=mons.map(p=>`<div class="row" style="cursor:default"><span class="nm lk" onclick="openView(vPk,'${p.key}')"><div class="en">${esc(p.en)}</div><div class="de">${esc(p.de||'')} · ${esc(p.role||'')}</div></span><span class="side">${p.t.map(tb).join('')}</span><button class="iconbtn" onclick="toggleTeam('${p.key}')" aria-label="entfernen">✕</button></div>`).join('');
 // Defensive Analyse
 const rows=TYPES.map(a=>{let w=0,r=0,im=0,x4=0;mons.forEach(p=>{const v=p.t.reduce((m,d)=>m*eff(a,d),1);if(v>=2)w++;if(v>=4)x4++;if(v>0&&v<1)r++;if(v===0)im++});return{a,w,r,im,x4}});
 const weak=rows.filter(x=>x.w>=2&&x.w>x.r+x.im).sort((a,b)=>b.w-a.w);
 h+=`<div class="card"><h3>Gemeinsame Schwächen</h3>${weak.length?weak.map(x=>`<div class="mult"><span>${tb(x.a)}</span><span>${x.w} schwach${x.x4?` (${x.x4}× 4fach)`:''}, ${x.r+x.im} resistent/immun</span></div>`).join(''):'<div>Keine Schwäche, die mehrere Teammitglieder ohne Ausgleich teilen. ✓</div>'}</div>`;
 h+=`<details class="card"><summary>Alle Typen: schwach / resistent / immun</summary><table><tr><th>Typ</th><th>Schw.</th><th>Res.</th><th>Imm.</th></tr>${rows.map(x=>`<tr><td>${tb(x.a)}</td><td>${x.w||''}</td><td>${x.r||''}</td><td>${x.im||''}</td></tr>`).join('')}</table></details>`;
 // Offensive Abdeckung über STAB
 const stab=[...new Set(mons.flatMap(p=>p.t))];const cov=TYPES.filter(d=>stab.some(a=>eff(a,d)>=2)),miss=TYPES.filter(d=>!cov.includes(d));
 h+=`<div class="card"><h3>Offensive Abdeckung (nur Team-Typen)</h3><div class="small">Sehr effektiv gegen ${cov.length} von 18 Typen.</div>${miss.length?`<div style="margin-top:6px">Nicht sehr effektiv abgedeckt: ${miss.map(tb).join(' ')}</div><div class="small">Berücksichtigt nur die Typen deiner Pokémon, nicht ihre Zusatzattacken.</div>`:''}</div>`;
 // Phys/Spez/Init
 const ph=mons.filter(p=>p.s&&p.s[1]>p.s[3]+10).length,sp=mons.filter(p=>p.s&&p.s[3]>p.s[1]+10).length,mx=mons.length-ph-sp;const spe=mons.filter(p=>p.s).map(p=>p.s[5]);const avg=spe.length?Math.round(spe.reduce((a,b)=>a+b,0)/spe.length):0;
 h+=`<div class="card"><h3>Verteilung</h3><dl class="kv"><dt>Physisch</dt><dd>${ph}</dd><dt>Speziell</dt><dd>${sp}</dd><dt>Gemischt</dt><dd>${mx}</dd><dt>Ø Initiative</dt><dd>${avg}</dd></dl>${ph>=5?'<div class="small" style="margin-top:6px">Sehr physisch – anfällig für Gegner mit hoher Verteidigung oder Irrlicht.</div>':''}${sp>=5?'<div class="small" style="margin-top:6px">Sehr speziell – anfällig für Gegner mit hoher Spezial-Verteidigung.</div>':''}${avg&&avg<65?'<div class="small" style="margin-top:6px">Eher langsames Team – du wirst oft zuerst getroffen.</div>':''}</div>`;
 return{t:`Team (${mons.length}/6)`,h}}

if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
boot();
