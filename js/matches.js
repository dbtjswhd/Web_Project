'use strict';
const selections = new Map();
const PAGE_SIZE = 4;
let shownCount = PAGE_SIZE;
const baseMatches = $$('.match');
// Fixture groups: the same match has multiple prediction markets.
const markets = [
  { name: '핸디캡 승패', labels: ['홈 -1.0', '무 (H -1.0)', '원정 +1.0'], odds: [2.28, 3.30, 2.45], badge: 'H -1.0' },
  { name: '언더오버', labels: ['언더 2.5', '오버 2.5'], odds: [2.05, 1.51], badge: 'U/O 2.5' },
  { name: '전반 승무패', labels: ['전반 홈승', '전반 무', '전반 원정승'], odds: [2.48, 2.03, 3.30], badge: '1H' },
  { name: '홀짝', labels: ['홀', '짝'], odds: [1.80, 1.80], badge: 'O/E' }
];
const list = $('.match-list');
const groups = [];
baseMatches.forEach((original, index) => {
  const fixture = String(index), sport = original.dataset.sport;
  const info = original.querySelector('.match-info');
  const league = info.querySelector('.league')?.cloneNode(true);
  const teams = info.querySelector('.teams')?.cloneNode(true);
  const time = info.querySelector('.match-time')?.cloneNode(true);
  const group = document.createElement('section'); group.className = 'fixture-group'; group.dataset.sport = sport;
  const header = document.createElement('div'); header.className = 'fixture-header';
  const identity = document.createElement('div'); identity.className = 'fixture-identity';
  if (league) identity.append(league);
  if (teams) identity.append(teams);
  if (time) identity.append(time);
  const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'fixture-toggle'; toggle.setAttribute('aria-expanded', 'true'); toggle.textContent = '접기 −';
  header.append(identity, toggle); group.append(header);
  const baseMarket = original;
  baseMarket.classList.add('market-row'); baseMarket.dataset.fixture = fixture; baseMarket.dataset.market = '일반 승패';
  baseMarket.querySelector('.match-info').replaceChildren();
  const label = document.createElement('div'); label.className = 'market-title'; label.textContent = '일반 승패';
  const badge = document.createElement('span'); badge.className = 'market-badge'; badge.textContent = '기본'; label.append(badge);
  baseMarket.querySelector('.match-info').append(label);
  baseMarket.querySelectorAll('.odds button').forEach(b => b.dataset.market = '일반 승패');
  group.append(baseMarket);
  markets.forEach(market => {
    const row = original.cloneNode(true); row.classList.add('extra-match'); row.hidden = false;
    row.dataset.fixture = fixture; row.dataset.market = market.name;
    const rowInfo = row.querySelector('.match-info'); rowInfo.replaceChildren();
    const title = document.createElement('div'); title.className = 'market-title'; title.textContent = market.name;
    const tag = document.createElement('span'); tag.className = 'market-badge'; tag.textContent = market.badge;
    title.append(tag); rowInfo.append(title);
    const odds = row.querySelector('.odds'); odds.replaceChildren(); odds.classList.toggle('two', market.labels.length === 2);
    market.labels.forEach((name, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.pick = name; button.dataset.odd = String(market.odds[i]); button.dataset.market = market.name;
      const small = document.createElement('small'); small.textContent = name;
      const bold = document.createElement('b'); bold.textContent = market.odds[i].toFixed(2);
      button.append(small, bold); odds.append(button);
    });
    group.append(row);
  });
  group.classList.add('expanded');
  toggle.addEventListener('click', () => {
    group.classList.toggle('expanded');
    const on = group.classList.contains('expanded'); toggle.setAttribute('aria-expanded', String(on)); toggle.textContent = on ? '접기 −' : '유형 보기 +';
    filterMatches();
  });
  list.append(group); groups.push(group);
});
// 추가 경기: 기존 레이아웃을 재사용하는 시연용 가상 일정
const extraFixtures = [
  ['soccer', '⚽ SERIE A', '인터 밀란', 'AC 밀란', '11.09 (월) 02:00', [2.05, 3.10, 3.65]],
  ['soccer', '⚽ LIGUE 1', '파리 생제르맹', '마르세유', '11.09 (월) 04:00', [1.62, 3.90, 4.80]],
  ['basketball', '🏀 NBA', '보스턴', '뉴욕', '11.09 (월) 09:30', [1.78, 2.10]],
  ['baseball', '⚾ BASEBALL · EXHIBITION', '화이트 폭스', '블랙 베어스', '11.09 (월) 15:00', [1.84, 1.96]],
  ['volleyball', '🏐 VOLLEYBALL · EXHIBITION', '인천 블루', '대전 스타', '11.09 (월) 17:00', [1.90, 1.90]],
  ['soccer', '⚽ PREMIER LEAGUE', '맨체스터 유나이티드', '첼시', '11.10 (화) 21:30', [2.30, 3.15, 2.95]],
  ['soccer', '⚽ LA LIGA', '아틀레티코 마드리드', '세비야', '11.10 (화) 23:00', [1.72, 3.50, 4.40]],
  ['basketball', '🏀 NBA', '댈러스', '덴버', '11.11 (수) 11:00', [2.00, 1.83]]
];
extraFixtures.forEach(([sport, league, home, away, time, prices], idx) => {
  const template = groups.find(g => g.dataset.sport === sport);
  if (!template) return;
  const group = template.cloneNode(true);
  const fixture = String(groups.length);
  group.dataset.sport = sport;
  group.querySelector('.fixture-identity .league').textContent = league;
  group.querySelector('.fixture-identity .teams').innerHTML = '';
  const teams = group.querySelector('.fixture-identity .teams');
  const h = document.createElement('span'); h.textContent = home;
  const vs = document.createElement('b'); vs.textContent = 'VS';
  const a = document.createElement('span'); a.textContent = away;
  teams.append(h, vs, a);
  group.querySelector('.fixture-identity .match-time').textContent = '◷ ' + time + ' · 가상 일정';
  group.querySelectorAll('.match').forEach(row => {
    row.dataset.fixture = fixture;
    row.querySelectorAll('.odds button').forEach((b, i) => {
      if (row.dataset.market === '일반 승패') {
        b.dataset.odd = String(prices[i] ?? 3.15);
        b.querySelector('b').textContent = Number(b.dataset.odd).toFixed(2);
        b.dataset.pick = i === 0 ? home + ' 승' : i === prices.length - 1 ? away + ' 승' : '무승부';
      }
    });
  });
  const toggle = group.querySelector('.fixture-toggle');
  toggle.addEventListener('click', () => {
    group.classList.toggle('expanded'); const open = group.classList.contains('expanded');
    toggle.textContent = open ? '접기 −' : '유형 보기 +'; toggle.setAttribute('aria-expanded', String(open)); filterMatches();
  });
  list.append(group); groups.push(group);
});
let activeSport = 'all', authMode = 'login';
function filterMatches() {
  const matching = groups.filter(g => activeSport === 'all' || g.dataset.sport === activeSport);
  groups.forEach(group => {
    group.hidden = !matching.includes(group) || matching.indexOf(group) >= shownCount;
    group.querySelectorAll('.extra-match').forEach(row => row.hidden = !group.classList.contains('expanded'));
  });
  $('#visible-count').textContent = matching.slice(0, shownCount).length;
  const more = $('#more-matches');
  more.hidden = matching.length <= shownCount;
  more.textContent = `다른 경기 더보기 (${matching.length - shownCount}경기 남음) ↓`;
}
$('#more-matches').addEventListener('click', () => { shownCount += PAGE_SIZE; filterMatches(); });
$$('.filter').forEach(btn => btn.addEventListener('click', () => {
  activeSport = btn.dataset.sport; shownCount = PAGE_SIZE; $$('.filter').forEach(b => b.classList.toggle('active', b === btn)); filterMatches();
}));
function syncButtons() {
  $$('.odds button').forEach(btn => {
    const row = btn.closest('.match'); const item = selections.get(row.dataset.fixture + '|' + row.dataset.market + '|' + btn.dataset.pick);
    btn.classList.toggle('chosen', !!item);
  });
}
list.addEventListener('click', e => {
  const btn = e.target.closest('.odds button'); if (!btn) return;
  const row = btn.closest('.match'); const k = row.dataset.fixture + '|' + row.dataset.market + '|' + btn.dataset.pick;
  const old = selections.get(k);
  if (old) selections.delete(k);
  else {
    // 한 실제 경기에서는 유형과 무관하게 한 가지 결과만 선택 가능.
    for (const [key, item] of selections) { if (item.fixture === row.dataset.fixture) selections.delete(key); }
    selections.set(k, { fixture: row.dataset.fixture, match: row.closest('.fixture-group')?.querySelector('.fixture-header .teams')?.innerText.replace(/\s+/g, ' ').trim() || '경기', market: row.dataset.market, pick: btn.dataset.pick, odd: Number(btn.dataset.odd) });
  }
  syncButtons(); renderSlip();
});
function renderSlip() {
  const count = selections.size;
  $('#pick-count').textContent = count; $('#selection-count').textContent = `${count} 경기/시장`;
  const odds = count ? [...selections.values()].reduce((a, v) => a * v.odd, 1) : 0;
  $('#total-odds').textContent = odds.toFixed(2);
  $('#expected').textContent = `${fmt(Math.max(0, Number($('#stake').value.replace(/,/g, '')) || 0) * odds)} P`;
  const list = $('#pick-list'); list.replaceChildren();
  if (!count) { list.innerHTML = '<div class="empty-slip"><div class="empty-icon">◎</div><strong>선택한 경기가 없습니다</strong><p>경기 배당률을 클릭하면<br>여기에 선택 내역이 표시됩니다.</p></div>'; return; }
  for (const [k, item] of selections) {
    const card = document.createElement('div'); card.className = 'pick-item';
    const top = document.createElement('div'); top.className = 'pick-item-top';
    const title = document.createElement('span'); title.textContent = `${item.match} · ${item.market}`;
    const remove = document.createElement('button'); remove.textContent = '×'; remove.setAttribute('aria-label', '선택 제거'); remove.addEventListener('click', () => { selections.delete(k); syncButtons(); renderSlip(); });
    top.append(title, remove);
    const bottom = document.createElement('div'); bottom.className = 'pick-item-bottom';
    const name = document.createElement('span'); name.textContent = item.pick;
    const odd = document.createElement('b'); odd.textContent = item.odd.toFixed(2);
    bottom.append(name, odd); card.append(top, bottom); list.append(card);
  }
}
$('#stake').addEventListener('input', renderSlip);
$('#stake-all').addEventListener('click', () => { $('#stake').value = String(user()?.balance || 0); renderSlip(); });

$('#submit-pick').addEventListener('click', () => {
  const u = user(); if (!u) { location.href = 'login.html'; return; }
  if (!selections.size) return alert('먼저 경기 결과를 선택해 주세요.');
  const amount = Number($('#stake').value.replace(/,/g, ''));
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 1000000) return alert('구매 포인트는 1~1,000,000 P 사이의 정수로 입력하세요.');
  if (amount > u.balance) return alert('포인트가 부족합니다. 가상 충전을 이용하세요.');
  const odds = [...selections.values()].reduce((a, v) => a * v.odd, 1);
  u.balance -= amount;
  u.history.unshift({ id: Date.now() + '_' + Math.random().toString(36).slice(2, 7), date: new Date().toLocaleString('ko-KR'), 
    stake: amount, odds: Number(odds.toFixed(4)), potential: Math.round(amount * odds), items: [...selections.values()].map(v => ({ ...v })), status: 'pending', returned: 0 });
  save(); selections.clear(); syncButtons(); renderSlip(); refreshHeader(); alert('가상 구매가 완료되었습니다. 마이페이지에서 내역을 확인하세요.');
});

filterMatches(); renderSlip(); refreshHeader();
