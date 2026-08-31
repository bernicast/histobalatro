const CARDS = {
  plana: { name: 'Célula plana', kind: 'celula', glyph: '▬', tissues: ['epitelial'], tags: ['plana'] },
  cubica: { name: 'Célula cúbica', kind: 'celula', glyph: '◼', tissues: ['epitelial'], tags: ['cubica'] },
  cilindrica: { name: 'Célula cilíndrica', kind: 'celula', glyph: '▮', tissues: ['epitelial'], tags: ['cilindrica'] },
  fibroblasto: { name: 'Fibroblasto', kind: 'celula', glyph: '✳', tissues: ['conjuntivo'], tags: ['fibroblasto'] },
  adipocito: { name: 'Adipocito', kind: 'celula', glyph: '○', tissues: ['conjuntivo'], tags: ['adipocito'] },
  miocito: { name: 'Miocito', kind: 'celula', glyph: '∥', tissues: ['muscular'], tags: ['miocito'] },
  neurona: { name: 'Neurona', kind: 'celula', glyph: '✱', tissues: ['nervioso'], tags: ['neurona'] },
  glia: { name: 'Célula de glía', kind: 'celula', glyph: '·', tissues: ['nervioso'], tags: ['glia'] },
  simple: { name: 'Simple', kind: 'organizacion', glyph: '1', tissues: ['epitelial','muscular'], tags: ['simple'] },
  estratificado: { name: 'Estratificado', kind: 'organizacion', glyph: '☰', tissues: ['epitelial'], tags: ['estratificado'] },
  seudo: { name: 'Seudoestratificado', kind: 'organizacion', glyph: '⋮', tissues: ['epitelial'], tags: ['seudo'] },
  laxo: { name: 'Laxo', kind: 'organizacion', glyph: '≋', tissues: ['conjuntivo'], tags: ['laxo'] },
  denso_reg: { name: 'Denso regular', kind: 'organizacion', glyph: '≡', tissues: ['conjuntivo'], tags: ['denso_reg'] },
  denso_irr: { name: 'Denso irregular', kind: 'organizacion', glyph: '≠', tissues: ['conjuntivo'], tags: ['denso_irr'] },
  ramificado: { name: 'Ramificado', kind: 'organizacion', glyph: 'Y', tissues: ['muscular','nervioso'], tags: ['ramificado'] },
  mb: { name: 'Membrana basal', kind: 'estructura', glyph: '▁', tissues: ['epitelial'], tags: ['mb'] },
  colageno: { name: 'Colágeno', kind: 'estructura', glyph: '〰', tissues: ['conjuntivo'], tags: ['colageno'] },
  sf: { name: 'Sustancia fundamental', kind: 'estructura', glyph: '░', tissues: ['conjuntivo'], tags: ['sf'] },
  estrias: { name: 'Estriaciones', kind: 'estructura', glyph: '▤', tissues: ['muscular'], tags: ['estrias'] },
  discos: { name: 'Discos intercalares', kind: 'estructura', glyph: '⋈', tissues: ['muscular'], tags: ['discos'] },
  nucleos_per: { name: 'Núcleos periféricos', kind: 'estructura', glyph: '••', tissues: ['muscular'], tags: ['nucleos_per'] },
  soma: { name: 'Soma', kind: 'estructura', glyph: '●', tissues: ['nervioso'], tags: ['soma'] },
  axon: { name: 'Axón', kind: 'estructura', glyph: '→', tissues: ['nervioso'], tags: ['axon'] },
  mielina: { name: 'Vaina de mielina', kind: 'estructura', glyph: '◎', tissues: ['nervioso'], tags: ['mielina'] }
};
const STARTING_DECK = ['plana','plana','plana','cubica','cubica','cilindrica','cilindrica','fibroblasto','fibroblasto','fibroblasto','adipocito','adipocito','miocito','miocito','miocito','miocito','neurona','neurona','glia','simple','simple','simple','estratificado','estratificado','seudo','laxo','laxo','denso_reg','denso_reg','denso_irr','ramificado','ramificado','mb','mb','mb','colageno','colageno','sf','sf','estrias','estrias','estrias','discos','discos','nucleos_per','nucleos_per','soma','soma','axon','axon','mielina'];
const ROUNDS = [
  { id:1, name:'Corte de calentamiento', target:160, blurb:'Que se vea un tejido.' },
  { id:2, name:'Bandeja de epitelios', target:260, blurb:'Sin membrana basal no es epitelio.' },
  { id:3, name:'La matriz manda', target:380, blurb:'Células dispersas y fibras: conjuntivo.' },
  { id:4, name:'Contracción', target:520, blurb:'Estriado o no. El núcleo delata al esquelético.' },
  { id:5, name:'Señales', target:680, blurb:'Soma, axón, mielina.' },
  { id:6, name:'El profesor de prácticas', target:900, blurb:'Jefe. Los cuatro tejidos.' }
];
const JOKERS = [
  { id:'polaridad', name:'Polaridad', text:'×2 si el corte es epitelial.' },
  { id:'mb', name:'Membrana basal', text:'+8 mult si hay membrana basal.' },
  { id:'matriz', name:'Matriz abundante', text:'×2,5 si es conjuntivo.' },
  { id:'denso', name:'Pocas células', text:'+40 fichas en conjuntivo denso.' },
  { id:'contractil', name:'Contráctil', text:'+35 fichas si es muscular.' },
  { id:'estriado', name:'Estriado', text:'×2 en esquelético o cardiaco.' },
  { id:'periferico', name:'Núcleo periférico', text:'+12 mult en músculo esquelético.' },
  { id:'excitable', name:'Excitable', text:'×2 si es nervioso.' },
  { id:'avascular', name:'Avascular', text:'+6 mult en epitelio.' },
  { id:'atlas', name:'Lámina de atlas', text:'Atlas y lámina de 10 duplican fichas.' },
  { id:'limpio', name:'Corte limpio', text:'+10 mult si no sobran cartas.' },
  { id:'sospechoso', name:'Ojo clínico', text:'Las sospechas pagan 3×.' }
];
function uid(){ return Math.random().toString(36).slice(2,9); }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function has(cards,id){ return cards.some(c=>c.type===id); }
function countTags(cards){ const t={}; cards.forEach(c=>(CARDS[c.type].tags||[]).forEach(tag=>t[tag]=(t[tag]||0)+1)); return t; }
function tissueVotes(cards){ const v={epitelial:0,conjuntivo:0,muscular:0,nervioso:0}; cards.forEach(c=>CARDS[c.type].tissues.forEach(t=>v[t]++)); return v; }
function diagnose(played){
  if(played.length<3) return {tier:'nada',name:'Nada reconocible',tissue:null,chips:0,mult:0,note:'Monta 3 a 5 cartas.'};
  const T=countTags(played), votes=tissueVotes(played);
  const recipes=[
    {id:'esq',name:'Músculo esquelético',tissue:'muscular',need:T.miocito&&T.estrias&&T.nucleos_per,conflict:T.discos||T.mb||T.axon,key:3},
    {id:'card',name:'Músculo cardiaco',tissue:'muscular',need:T.miocito&&T.estrias&&T.discos,conflict:T.nucleos_per||T.mb,key:3},
    {id:'liso',name:'Músculo liso',tissue:'muscular',need:T.miocito&&T.simple&&!T.estrias,conflict:T.estrias||T.discos||T.nucleos_per,key:2},
    {id:'esp',name:'Epitelio simple plano',tissue:'epitelial',need:T.plana&&T.simple&&T.mb,conflict:T.estratificado||T.estrias,key:3},
    {id:'esc',name:'Epitelio simple cúbico',tissue:'epitelial',need:T.cubica&&T.simple&&T.mb,conflict:T.estratificado,key:3},
    {id:'eci',name:'Epitelio simple cilíndrico',tissue:'epitelial',need:T.cilindrica&&T.simple&&T.mb,conflict:T.estratificado,key:3},
    {id:'eep',name:'Epitelio estratificado plano',tissue:'epitelial',need:T.plana&&T.estratificado&&T.mb,conflict:false,key:3},
    {id:'pseu',name:'Epitelio seudoestratificado',tissue:'epitelial',need:T.cilindrica&&T.seudo&&T.mb,conflict:false,key:3},
    {id:'laxo',name:'Conjuntivo laxo',tissue:'conjuntivo',need:T.fibroblasto&&T.laxo&&(T.sf||T.colageno),conflict:T.denso_reg||T.denso_irr,key:3},
    {id:'dreg',name:'Conjuntivo denso regular',tissue:'conjuntivo',need:T.fibroblasto&&T.denso_reg&&T.colageno,conflict:T.laxo||T.estrias,key:3},
    {id:'dirr',name:'Conjuntivo denso irregular',tissue:'conjuntivo',need:T.fibroblasto&&T.denso_irr&&T.colageno,conflict:T.denso_reg,key:3},
    {id:'adi',name:'Tejido adiposo',tissue:'conjuntivo',need:T.adipocito&&played.length>=3,conflict:T.estrias,key:2},
    {id:'neu',name:'Neurona',tissue:'nervioso',need:T.neurona&&T.soma&&T.axon,conflict:T.estrias,key:3},
    {id:'ner',name:'Nervio periférico',tissue:'nervioso',need:T.axon&&T.mielina&&(T.glia||T.ramificado||T.neurona),conflict:T.estrias,key:3}
  ];
  const hit=recipes.find(r=>r.need);
  if(hit){
    const conflict=!!hit.conflict;
    const exactish=played.length<=4&&!conflict;
    const atlas=played.length<=3&&!conflict&&hit.key>=3;
    let tier,chips,mult,name=hit.name;
    if(atlas){tier='atlas';chips=180;mult=5;}
    else if(exactish){tier='lamina';chips=120;mult=4;name=hit.name+' · lámina de 10';}
    else if(conflict){tier='basico';chips=55;mult=2;name=hit.tissue+' (sucio)';}
    else {tier='subtipo';chips=80;mult=3;}
    const note=conflict?'Hay una estructura que no encaja.':(atlas?'Corte de atlas.':('Tejido '+hit.tissue+'.'));
    return {tier,name,tissue:hit.tissue,chips,mult,note,recipe:hit.id};
  }
  const top=Object.entries(votes).sort((a,b)=>b[1]-a[1])[0];
  if(top[1]>=3) return {tier:'sospecha',name:'Sospecha de '+top[0],tissue:top[0],chips:28,mult:2,note:'Falta la tríada diagnóstica.'};
  if(top[1]>=2) return {tier:'basico',name:'Tejido básico indefinido',tissue:top[0],chips:40,mult:1,note:'Hay familia, no hay subtipo.'};
  return {tier:'nada',name:'Quimera',tissue:null,chips:8,mult:1,note:'Has inventado un tejido.'};
}
function applyJokers(diag,played,jokers){
  let chips=diag.chips, mult=diag.mult; const notes=[];
  jokers.forEach(j=>{
    if(j.id==='polaridad'&&diag.tissue==='epitelial'){mult*=2;notes.push('Polaridad ×2');}
    if(j.id==='mb'&&has(played,'mb')){mult+=8;notes.push('MB +8');}
    if(j.id==='matriz'&&diag.tissue==='conjuntivo'){mult*=2.5;notes.push('Matriz ×2,5');}
    if(j.id==='denso'&&(diag.recipe==='dreg'||diag.recipe==='dirr')){chips+=40;notes.push('+40 denso');}
    if(j.id==='contractil'&&diag.tissue==='muscular'){chips+=35;notes.push('+35');}
    if(j.id==='estriado'&&(diag.recipe==='esq'||diag.recipe==='card')){mult*=2;notes.push('Estriado ×2');}
    if(j.id==='periferico'&&diag.recipe==='esq'){mult+=12;notes.push('Núcleo +12');}
    if(j.id==='excitable'&&diag.tissue==='nervioso'){mult*=2;notes.push('Excitable ×2');}
    if(j.id==='avascular'&&diag.tissue==='epitelial'){mult+=6;notes.push('Avascular +6');}
    if(j.id==='atlas'&&(diag.tier==='atlas'||diag.tier==='lamina')){chips*=2;notes.push('Atlas ×2');}
    if(j.id==='limpio'&&played.length<=3&&diag.tier!=='nada'&&diag.tier!=='sospecha'){mult+=10;notes.push('Limpio +10');}
    if(j.id==='sospechoso'&&diag.tier==='sospecha'){chips*=3;notes.push('Ojo clínico ×3');}
  });
  return {chips,mult,total:Math.round(chips*mult),notes};
}
function makeCard(type){ return {id:uid(),type}; }
const state={view:'title',deck:[],discard:[],hand:[],selected:[],jokers:[],round:0,score:0,runScore:0,playsLeft:3,discardsLeft:2,lastVerdict:null,draft:[]};
function resetRun(){ state.deck=shuffle(STARTING_DECK.map(makeCard)); state.discard=[]; state.hand=[]; state.selected=[]; state.jokers=[]; state.round=0; state.score=0; state.runScore=0; state.lastVerdict=null; startRound(); state.view='play'; }
function drawTo(n){ while(state.hand.length<n){ if(!state.deck.length){ if(!state.discard.length) break; state.deck=shuffle(state.discard); state.discard=[]; } state.hand.push(state.deck.pop()); } }
