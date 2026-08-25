const portraitSizing = document.createElement('style');
portraitSizing.textContent = '.portrait{width:220px!important;height:220px!important;flex:0 0 auto}@media(max-width:700px){.portrait{width:160px!important;height:160px!important}}';
document.head.appendChild(portraitSizing);

(() => {
  const papers = [...document.querySelectorAll('#writing .paper')];
  if (papers.length < 2) return;

  // Keep only the two current manuscripts.
  papers.slice(2).forEach(paper => paper.remove());

  const mycelic = papers[0];
  const mycelicTitle = mycelic.querySelector('.paper-title');
  const mycelicPdf = mycelic.querySelector('.paper-link');
  const mycelicHref = 'Mycelic_Architecture_Benchmark_Preprint_2026-08-14%20(1)%20(2).pdf';
  mycelicTitle.textContent = 'Mycelic: A Hierarchical Lineage Fabric for Persistent Agent Collectives';
  [mycelicTitle, mycelicPdf].forEach(link => {
    link.classList.remove('paper-pdf');
    link.removeAttribute('data-pdf');
    link.removeAttribute('data-pdf-parts');
    link.href = mycelicHref;
    link.target = '_blank';
    link.rel = 'noreferrer';
  });

  const neural = papers[1];
  const neuralTitle = neural.querySelector('.paper-title');
  const neuralPdf = neural.querySelector('.paper-link');
  const neuralImageHref = 'neuralgraph_architecture.jpg';
  neuralTitle.textContent = 'Memory Is a Graph: NeuralGraph for Persistent AI Agents';
  [neuralTitle, neuralPdf].forEach(link => {
    link.classList.remove('paper-pdf');
    link.href = neuralImageHref;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.removeAttribute('data-pdf-parts');
    link.removeAttribute('data-pdf');
  });
  neuralPdf.textContent = 'JPG';
})();

async function fetchPaperPayload(link){
  if(link.dataset.pdfParts){
    const urls=link.dataset.pdfParts.split(',').map(s=>s.trim()).filter(Boolean);
    const parts=await Promise.all(urls.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(`HTTP ${r.status}`);return (await r.text()).trim();}));
    return parts.join('');
  }
  const r=await fetch(link.dataset.pdf);
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  return (await r.text()).trim();
}

async function openPaper(link){
  const original=link.textContent;
  const tab=window.open('about:blank','_blank');
  link.textContent='Opening PDF…';
  link.setAttribute('aria-busy','true');
  try{
    if(!('DecompressionStream' in window))throw new Error('DecompressionStream unavailable');
    const b64=await fetchPaperPayload(link);
    const binary=atob(b64);
    const compressed=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)compressed[i]=binary.charCodeAt(i);
    const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const pdf=await new Response(stream).arrayBuffer();
    const url=URL.createObjectURL(new Blob([pdf],{type:'application/pdf'}));
    if(tab)tab.location.href=url;else window.location.href=url;
    setTimeout(()=>URL.revokeObjectURL(url),120000);
  }catch(err){
    console.error('PDF open failed',err);
    if(tab)tab.close();
    alert('Could not open this PDF in your browser. Try Chrome, Edge, Safari, or Firefox on a current version.');
  }finally{
    link.textContent=original;
    link.removeAttribute('aria-busy');
  }
}

document.querySelectorAll('.paper-pdf').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openPaper(link);}));
