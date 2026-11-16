'use strict';
// Classroom-only local browser storage. Do not use real credentials.
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const fmt = n => Math.round(n).toLocaleString('ko-KR');
const key = 'betzone_demo_v2';
function loadDB() {
    try {
        const d = JSON.parse(localStorage.getItem(key));
        return d && typeof d === 'object' && d.users ? d : { users: {}, current: null };
    } catch {
        return { users: {}, current: null };
    }
}
let db = loadDB();
function save() {
    localStorage.setItem(key, JSON.stringify(db));
}
function user() {
    return db.current && Object.prototype.hasOwnProperty.call(db.users, db.current) ? db.users[db.current] : null;
}
function requireLogin() {
    if (!user()) {
        location.href = 'login.html';
        return false;
    }
    return true;
}
function refreshHeader() {
    const balance = $('#balance-value');
    if (balance) balance.textContent = fmt(user()?.balance || 0);
    $$('.guest-only').forEach(el => el.hidden = !!user());
    $$('.member-only').forEach(el => el.hidden = !user());
}
function logout() {
    db.current = null;
    save();
    location.href = 'index.html';
}
document.addEventListener('DOMContentLoaded', () => {
    refreshHeader();
    $$('[data-logout]').forEach(b => b.addEventListener('click', logout));
});
