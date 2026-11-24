const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const next = String(today.getDate()+1).padStart(2, '0');
const formattedDate = `🗓️ ${year}-${month}-${day} ~ ${year}-${month}-${(next)}`;
const date = `◷ ${month}-${day}`;

document.querySelector('.date-label').textContent = formattedDate;
document.querySelector('.match-time').textContent = date;