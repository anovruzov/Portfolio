const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Subtle generative mycelium field: decorative only, no library required.
const canvas = document.getElementById('mycelium');
const ctx = canvas.getContext('2d');
let nodes = [];
function resize(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = 820 * dpr;
  canvas.style.width = innerWidth+'px'; canvas.style.height = '820px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  nodes = Array.from({length: Math.min(58, Math.floor(innerWidth/22))}, () => ({
    x: Math.random()*innerWidth, y: 60+Math.random()*650,
    vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.12, r:Math.random()*1.4+.5
  }));
}
function draw(){
  ctx.clearRect(0,0,innerWidth,820);
  for(let i=0;i<nodes.length;i++){
    const a=nodes[i]; a.x+=a.vx; a.y+=a.vy;
    if(a.x<0||a.x>innerWidth)a.vx*=-1; if(a.y<20||a.y>780)a.vy*=-1;
    for(let j=i+1;j<nodes.length;j++){
      const b=nodes[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
      if(d<155){ctx.strokeStyle=`rgba(184,255,90,${(1-d/155)*.13})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    }
    ctx.fillStyle='rgba(184,255,90,.38)';ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(draw);
}
resize(); draw(); addEventListener('resize', resize);
