function startRound() {
  const r = ROUNDS[state.round];
  state.score = 0;
  state.playsLeft = 3;
  state.discardsLeft = 2;
  state.selected = [];
  state.lastVerdict = { html: '<em>' + r.name + '.</em> ' + r.seek + ' Objetivo: ' + r.target + ' fichas. ' + r.next };
  drawTo(8);
}
function playSelected() {
  if (state.selected.length < 3 || state.selected.length > 5 || state.playsLeft <= 0) return;
  const played = state.hand.filter(c => state.selected.includes(c.id));
  const kept = state.hand.filter(c => !state.selected.includes(c.id));
  const diag = diagnose(played);
  const scored = applyJokers(diag, played, state.jokers);
  state.score += scored.total;
  state.runScore += scored.total;
  state.playsLeft -= 1;
  state.discard.push(...played);
  state.hand = kept;
  state.selected = [];
  drawTo(8);
  const reached = state.score >= ROUNDS[state.round].target;
  let extra = scored.notes.length ? ' ' + scored.notes.join(' · ') + '.' : '';
  state.lastVerdict = { html: '<em>' + diag.name + '.</em> ' + diag.note + extra + ' ' + scored.chips + ' × ' + scored.mult + ' = <em>' + scored.total + '</em> fichas.' };
  if (reached) {
    if (state.round === ROUNDS.length - 1) state.view = 'win';
    else openDraft();
  } else if (state.playsLeft <= 0) state.view = 'lose';
}
function discardSelected() {
  if (!state.selected.length || state.discardsLeft <= 0) return;
  const dumped = state.hand.filter(c => state.selected.includes(c.id));
  state.hand = state.hand.filter(c => !state.selected.includes(c.id));
  state.discard.push(...dumped);
  state.selected = [];
  state.discardsLeft -= 1;
  drawTo(8);
}
function toggleCard(id) {
  if (state.selected.includes(id)) state.selected = state.selected.filter(x => x !== id);
  else if (state.selected.length < 5) state.selected.push(id);
}
function openDraft() {
  const pool = shuffle(JOKERS.filter(j => !state.jokers.some(h => h.id === j.id)));
  state.draft = pool.slice(0, 3);
  state.view = 'draft';
}
function pickJoker(id) {
  const j = JOKERS.find(x => x.id === id);
  if (j && state.jokers.length < 5) state.jokers.push(j);
  state.round += 1;
  startRound();
  state.view = 'play';
}
function skipJoker() {
  state.round += 1;
  startRound();
  state.view = 'play';
}
function shareText() {
  const names = state.jokers.map(j => j.name).join(', ') || 'sin jokers';
  const end = state.view === 'win' ? 'Prácticas aprobadas' : 'Te han echado de la sala';
  return 'Histobalatro\n' + end + '\n' + state.runScore + ' fichas · ronda ' + Math.min(state.round+1,6) + '/6\n' + names;
}
function renderCard(card) {
  const def = CARDS[card.type];
  const sel = state.selected.includes(card.id) ? 'selected' : '';
  return '<button class="card ' + def.kind + ' ' + sel + '" data-id="' + card.id + '"><div class="kind">' + def.kind + '</div><div class="name">' + def.name + '</div><div class="glyph">' + def.glyph + '</div></button>';
}
function render() {
  const root = document.getElementById('app');
  if (state.view === 'title') {
    root.innerHTML = '<div class="screen"><div class="title-wrap"><div class="eyebrow">Prácticas de histología · los 4 tejidos</div><h1>Histobalatro</h1><p class="lede">6 rondas fijas: calentamiento → epitelio → conjuntivo → músculo → nervioso → examen. Monta 3 cartas: célula + organización + estructura. Si mezclas familias, el corte se ensucia.</p><div class="actions"><button class="btn" data-act="start">Nueva run</button><button class="btn ghost" data-act="help">Cómo se juega</button></div></div></div>';
    return;
  }
  if (state.view === 'help') {
    root.innerHTML = '<div class="screen"><div class="eyebrow">Manual</div><h2>Cómo se monta un corte</h2><div class="help"><p><b>Objetivo de cada ronda:</b> llegar a las fichas con 3 cortes y 2 descartes.</p><p><b>Receta ganadora:</b> exactamente 3 cartas que encajen. La 4ª suele estorbar.</p><p><b>Epitelio:</b> célula plana/cúbica/cilíndrica + simple o estratificado + membrana basal.</p><p><b>Conjuntivo:</b> fibroblasto + laxo o denso regular + colágeno o sustancia fundamental.</p><p><b>Músculo esquelético:</b> miocito + estriaciones + núcleos periféricos.</p><p><b>Músculo cardiaco:</b> miocito + estriaciones + discos intercalares.</p><p><b>Neurona:</b> neurona + soma + axón.</p><p><b>Las 6 rondas:</b> 1 calentamiento · 2 epitelios · 3 conjuntivo · 4 músculo · 5 nervioso · 6 examen final.</p><p>Si no está la receta, descarta cartas de otra familia. Una sospecha (3 cartas de la misma familia) suma poco, pero evita el 0.</p></div><div class="actions"><button class="btn" data-act="title">Volver</button></div></div>';
    return;
  }
  if (state.view === 'draft') {
    const nxt = ROUNDS[state.round + 1];
    const hint = nxt ? ('Siguiente ronda: <em>' + nxt.name + '</em>. ' + nxt.seek) : 'Última ronda superada.';
    root.innerHTML = '<div class="screen"><div class="eyebrow">Ronda superada · ' + state.score + ' fichas</div><h2>Elige un joker</h2><p class="lede">Un criterio histológico para el resto de la run. ' + hint + '</p><div class="modal-grid">' + state.draft.map(j => '<button class="pick" data-joker="' + j.id + '"><b>' + j.name + '</b><p>' + j.text + '</p></button>').join('') + '</div><button class="btn ghost" data-act="skip">Seguir sin joker</button></div>';
    return;
  }
  if (state.view === 'win' || state.view === 'lose') {
    const ok = state.view === 'win';
    root.innerHTML = '<div class="screen"><div class="eyebrow">' + (ok ? 'Run completa' : 'Run muerta') + '</div><h2>' + (ok ? 'Has aprobado prácticas.' : 'El corte no se sostiene.') + '</h2><p style="font-family:Fraunces,serif;font-size:42px;color:var(--gold)">' + state.runScore + ' fichas</p><div class="share">' + shareText() + '</div><div class="actions"><button class="btn" data-act="copy">Copiar resultado</button><button class="btn ghost" data-act="start">Otra run</button></div></div>';
    return;
  }
  const r = ROUNDS[state.round];
  root.innerHTML = '<div class="screen"><div class="hud"><div class="stat"><b>' + state.score + ' / ' + r.target + '</b><span>fichas</span></div><div class="round-name">' + r.name + '<div style="font-size:12px;color:var(--muted)">' + state.playsLeft + ' cortes · ' + state.discardsLeft + ' descartes</div></div><div class="stat right"><b>' + (state.round+1) + '/6</b><span>ronda</span></div></div><div class="jokers">' + (state.jokers.length ? state.jokers.map(j => '<div class="joker-chip">' + j.name + '</div>').join('') : '<div class="joker-chip">Sin jokers</div>') + '</div><div class="table"><div class="scope-label">Platina</div><div class="play-row">' + (state.hand.filter(c => state.selected.includes(c.id)).map(renderCard).join('') || '<span style="color:#8aa399">Elige 3 cartas de la receta. La 4ª suele sobrar.</span>') + '</div><div class="verdict">' + (state.lastVerdict ? state.lastVerdict.html : '') + '</div></div><div class="hand-wrap"><h3>Mano</h3><div class="hand-row">' + state.hand.map(renderCard).join('') + '</div></div><div class="controls"><button class="btn" data-act="play" ' + (state.selected.length<3||state.selected.length>5?'disabled':'') + '>Montar corte (' + state.selected.length + ')</button><button class="btn ghost" data-act="discard" ' + (!state.selected.length||!state.discardsLeft?'disabled':'') + '>Descartar</button></div></div>';
}
document.getElementById('app').addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card && card.dataset.id && state.view === 'play') { toggleCard(card.dataset.id); render(); return; }
  const act = e.target.closest('[data-act]');
  if (act) {
    const a = act.dataset.act;
    if (a === 'start') resetRun();
    if (a === 'help') state.view = 'help';
    if (a === 'title') state.view = 'title';
    if (a === 'play') playSelected();
    if (a === 'discard') discardSelected();
    if (a === 'skip') skipJoker();
    if (a === 'copy') { navigator.clipboard && navigator.clipboard.writeText(shareText()); act.textContent = 'Copiado'; return; }
    render(); return;
  }
  const jk = e.target.closest('[data-joker]');
  if (jk) { pickJoker(jk.dataset.joker); render(); }
});
render();
