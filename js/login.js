'use strict';
$('#login-form').addEventListener('submit', e => { e.preventDefault(); 
const id = $('#auth-id').value.trim(), pw = $('#auth-password').value; 
const u = db.users[id]; 
if (!u || u.password !== pw) { 
    $('#auth-error').textContent = '아이디 또는 비밀번호가 올바르지 않습니다.'; 
    return; 
} 
db.current = id;
save(); 
location.href = 'index.html'; 
});
