'use strict';
if (requireLogin()) {
    $('#wallet-balance').textContent = fmt(user().balance) + ' P'; 
    $('#charge-form').addEventListener('submit', e => { e.preventDefault(); 
    const amount = Number($('#charge-amount').value.replace(/,/g, '')); 
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 1000000) {
         alert('1~1,000,000 P 사이로 입력하세요.'); 
         return; 
    } 
    user().balance += amount; 
    save(); 
    refreshHeader(); 
    $('#wallet-balance').textContent = fmt(user().balance) + ' P'; 
    alert(fmt(amount) + ' P 가상 충전 완료'); }); 
}
