'use strict';
function renderHistory(){
  const u=user();if(!u)return;
  $('#mypage-name').textContent=`${db.current}님`;
  const staked=u.history.reduce((a,h)=>a+h.stake,0);
  const returned=u.history.reduce((a,h)=>a+h.returned,0);
  $('#total-staked').textContent=fmt(staked)+' P';
  $('#total-returned').textContent=fmt(returned)+' P';
  $('#return-rate').textContent=(staked?returned/staked*100:0).toFixed(1)+'%';
  const root=$('#history-list');
  root.replaceChildren();
  if(!u.history.length){
    const p=document.createElement('p');
    p.className='demo-note';
    p.textContent='아직 구매 내역이 없습니다.';
    root.append(p);
    return;
  }
  for(const h of u.history){
    const div=document.createElement('div');
    div.className='history-item';
    const top=document.createElement('div');
    top.className='history-top';
    const title=document.createElement('span');
    title.textContent=`${h.date} · ${fmt(h.stake)} P`;
    const status=document.createElement('span');
    status.textContent={pending:'결과 대기',win:'적중',lose:'미적중'}[h.status]||'결과 대기';
    top.append(title,status);
    const details=document.createElement('div');
    details.className='history-details';
    details.textContent=h.items.map(i=>`${i.match} / ${i.market} / ${i.pick} (${i.odd.toFixed(2)})`).join(' | ')+`\n총 배당 ${h.odds.toFixed(2)} · 예상 환급 ${fmt(h.potential)} P · 실제 환급 ${fmt(h.returned)} P`;
    div.append(top,details);
    if(h.status==='pending')for(const [label,statusValue] of [['적중 처리','win'],['미적중 처리','lose']]){
      const btn=document.createElement('button');
      btn.textContent=label;btn.addEventListener('click',()=>{
        if(!confirm(`이 예측을 ${label}하시겠습니까?`))return;
        h.status=statusValue;h.returned=statusValue==='win'?h.potential:0;
        u.balance+=h.returned;
        save();
        refreshHeader();
        renderHistory();
      });
      div.append(btn);
    }
    root.append(div);
  }
}

if(requireLogin())renderHistory();
