'use strict';
if(requireLogin()){
 const amountInput=$('#withdraw-amount');
 const balanceLabel=$('#wallet-balance');
 function updateBalance(){
    balanceLabel.textContent=fmt(user().balance)+' P';refreshHeader();
 }
 updateBalance();
 $('#withdraw-all').addEventListener('click',()=>{amountInput.value=String(user().balance);});
 $('#withdraw-form').addEventListener('submit',e=>{
  e.preventDefault();const amount=Number(amountInput.value);
  if(!Number.isSafeInteger(amount)||amount<1){
        alert('1 P 이상의 정수를 입력하세요.');
        return;
    }
  if(amount>user().balance){
        alert('잔액보다 많은 포인트는 환급할 수 없습니다.');
        return;
    }
  user().balance-=amount;
  user().withdrawals??=[];
  user().withdrawals.unshift({date:new Date().toLocaleString('ko-KR'),amount});
  save();updateBalance();amountInput.value='';
  alert(fmt(amount)+' P 가상 환급 처리 완료 (실제 송금 없음)');
 });
}
