document.getElementById('year').textContent=new Date().getFullYear();

const portrait=document.getElementById('portrait-image');
if(portrait){
  fetch('assets/portrait-small.txt',{cache:'no-store'})
    .then(r=>r.ok?r.text():Promise.reject(new Error('portrait unavailable')))
    .then(b64=>{portrait.src='data:image/jpeg;base64,'+b64.trim();})
    .catch(()=>{});
}