'use strict';
$('#signup-form').addEventListener('submit',e=>{e.preventDefault();
const id=$('#auth-id').value.trim(),pw=$('#auth-password').value,confirmPw=$('#auth-confirm').value,err=$('#auth-error');
if(!/^[a-zA-Z0-9_]{3,24}$/.test(id)){
    err.textContent='아이디는 영문, 숫자, 밑줄 3~24자여야 합니다.';
    return;
}
if(db.users[id]){
    err.textContent='이미 사용 중인 아이디입니다.';
        return;
}
if(pw!==confirmPw){
    err.textContent='비밀번호 확인이 일치하지 않습니다.';
    return;
}
db.users[id]={password:pw,balance:0,history:[]};
db.current=id;save();location.href='index.html';
});
