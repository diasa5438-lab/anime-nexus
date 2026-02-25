const animeListEl = document.getElementById('anime-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const favListEl = document.getElementById('fav-list');

let temporadaAnimes = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

function salvarFavoritos(){
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  mostrarFavoritos();
}

function mostrarFavoritos(){
  if(favoritos.length===0){
    favListEl.textContent="Nenhum anime favorito ainda. Clique em 'Favoritar' em algum anime!";
    return;
  }
  favListEl.innerHTML="<h2>⭐ Seus Favoritos</h2>"+favoritos.map(f=>`<p>${f.title}</p>`).join('');
}

function criarCardAnime(anime){
  const div = document.createElement('div');
  div.classList.add('anime-card');
  const isFav=favoritos.some(f=>f.mal_id===anime.mal_id);

  div.innerHTML=`
    <img src="${anime.images.jpg.large_image_url}" class="anime-img">
    <div class="anime-content">
      <div class="anime-title">${anime.title}</div>
      <div class="anime-actions">
        <button class="btn btn-details">Detalhes</button>
        <button class="btn btn-fav">${isFav?'Desfavoritar':'Favoritar'}</button>
      </div>
    </div>
  `;

  div.querySelector('.btn-details').addEventListener('click', ()=>{
    window.open(`anime.html?id=${anime.mal_id}`, '_blank');
  });

  div.querySelector('.btn-fav').addEventListener('click', ()=>{
    if(isFav){
      favoritos=favoritos.filter(f=>f.mal_id!==anime.mal_id);
    } else {
      favoritos.push(anime);
    }
    salvarFavoritos();
    renderizarAnimes(temporadaAnimes);
  });

  return div;
}

function renderizarAnimes(animes){
  animeListEl.innerHTML='';
  if(animes.length===0){ animeListEl.innerHTML='<p>Nenhum anime encontrado.</p>'; return; }
  animes.forEach(anime=>animeListEl.appendChild(criarCardAnime(anime)));
}

async function carregarAnimesTemporada(){
  const res = await fetch('https://api.jikan.moe/v4/seasons/now');
  const data = await res.json();
  temporadaAnimes = data.data;
  renderizarAnimes(temporadaAnimes);
  mostrarFavoritos();
}

async function buscarAnimes(nome){
  if(!nome.trim()){ renderizarAnimes(temporadaAnimes); return; }
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(nome)}&limit=15`);
  const data = await res.json();
  renderizarAnimes(data.data||[]);
}

searchBtn.addEventListener('click', ()=>buscarAnimes(searchInput.value));
searchInput.addEventListener('keyup', e=>{if(e.key==='Enter'){buscarAnimes(searchInput.value);}});

carregarAnimesTemporada();
