/* ...existing code... */
const phraseFile = 'phrases.json';

const el = {
  number: document.getElementById('number'),
  phrase: document.getElementById('phrase'),
  generate: document.getElementById('generate'),
  copy: document.getElementById('copy'),
  clear: document.getElementById('clear'),
  min: document.getElementById('min'),
  max: document.getElementById('max'),
  historyList: document.getElementById('historyList')
};

let phrases = [];
let history = [];

async function loadPhrases(){
  try{
    const res = await fetch(phraseFile);
    phrases = await res.json();
  }catch(e){
    phrases = ["Buen trabajo","Sigue así","Hoy es tu día","Inténtalo de nuevo","¡Perfecto!"];
  }
}
function randInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randPhrase(){
  if(!phrases.length) return '';
  return phrases[Math.floor(Math.random() * phrases.length)];
}
function renderResult(num, phrase){
  el.number.textContent = num;
  el.phrase.textContent = phrase;
}
function addToHistory(num, phrase){
  const item = {num, phrase, time: new Date().toLocaleTimeString()};
  history.unshift(item);
  if(history.length > 50) history.pop();
  renderHistory();
}
function renderHistory(){
  el.historyList.innerHTML = '';
  history.forEach(h=>{
    const li = document.createElement('li');
    li.innerHTML = `<div class="small-num">${h.num}</div><div><div style="font-weight:600">${h.phrase}</div><div style="font-size:12px;color:var(--muted)">${h.time}</div></div>`;
    el.historyList.appendChild(li);
  });
}

el.generate.addEventListener('click', ()=>{
  let min = parseInt(el.min.value) || 1;
  let max = parseInt(el.max.value) || 100;
  if(min > max) [min, max] = [max, min];
  const n = randInt(min, max);
  const p = randPhrase();
  renderResult(n, p);
  addToHistory(n, p);
});

el.copy.addEventListener('click', async ()=>{
  const text = `${el.number.textContent} — ${el.phrase.textContent}`;
  try{
    await navigator.clipboard.writeText(text);
    el.copy.textContent = 'Copiado';
    setTimeout(()=>el.copy.textContent = 'Copiar', 1200);
  }catch(e){
    el.copy.textContent = 'Error';
    setTimeout(()=>el.copy.textContent = 'Copiar', 1200);
  }
});

el.clear.addEventListener('click', ()=>{
  history = [];
  renderHistory();
  renderResult('—', 'Pulsa "Generar" para obtener un número y una frase.');
});

loadPhrases().then(()=>{/* ready */});
/* ...existing code... */

