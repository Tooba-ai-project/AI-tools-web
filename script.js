let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let recentViewed = JSON.parse(localStorage.getItem('recentViewed')) || [];

fetch('tools.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('toolsContainer');
    const searchBar = document.getElementById('searchBar');
    const categoryFilter = document.getElementById('categoryFilter');
    const recentDiv = document.getElementById('recent');
    const toggleThemeBtn = document.getElementById('toggleTheme');

    function displayTools(filter = '', category = '') {
      container.innerHTML = '';
      data.filter(tool => {
        return tool.name.toLowerCase().includes(filter.toLowerCase()) &&
               (category === '' || tool.category === category);
      }).forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = `
          <span class="favorite">${favorites.includes(tool.name)?'❤️':'♡'}</span>
          <img src="${tool.icon}" alt="${tool.name} Icon">
          <h3>${tool.name}</h3>
          <p>${tool.description}</p>
          <div class="star-rating">
            <span class="star" data-value="1">★</span>
            <span class="star" data-value="2">★</span>
            <span class="star" data-value="3">★</span>
            <span class="star" data-value="4">★</span>
            <span class="star" data-value="5">★</span>
          </div>
        `;
        card.querySelector('.favorite').onclick = (e)=>{
          e.stopPropagation();
          if(favorites.includes(tool.name)){
            favorites = favorites.filter(f=>f!==tool.name);
          } else { favorites.push(tool.name); }
          localStorage.setItem('favorites', JSON.stringify(favorites));
          displayTools(searchBar.value, categoryFilter.value);
        }

        // Star rating
        const stars = card.querySelectorAll('.star');
        stars.forEach(star=>{
          star.onclick = (e)=>{
            stars.forEach(s=>s.classList.remove('selected'));
            for(let i=0;i<star.dataset.value;i++){
              stars[i].classList.add('selected');
            }
          }
        });

        card.onclick = ()=>{
          window.open(tool.url,'_blank');
          recentViewed.unshift(tool.name);
          recentViewed = [...new Set(recentViewed)].slice(0,5);
          localStorage.setItem('recentViewed', JSON.stringify(recentViewed));
          displayRecent();
        }

        container.appendChild(card);
      });
    }

    function displayRecent(){
      recentDiv.innerHTML = '';
      recentViewed.forEach(name=>{
        const tool = data.find(t=>t.name===name);
        if(tool){
          const div = document.createElement('div');
          div.innerHTML = `<img src="${tool.icon}" width="40" height="40" title="${tool.name}">`;
          recentDiv.appendChild(div);
        }
      });
    }

    searchBar.addEventListener('input', ()=>displayTools(searchBar.value, categoryFilter.value));
    categoryFilter.addEventListener('change', ()=>displayTools(searchBar.value, categoryFilter.value));
    toggleThemeBtn.addEventListener('click', ()=>document.body.classList.toggle('dark-mode'));

    displayTools();
    displayRecent();
  });