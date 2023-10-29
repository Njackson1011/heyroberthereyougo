const { ipcRenderer } = require('electron');

document.getElementById('search').addEventListener('click', () => {
  console.log('Search button clicked');
  const searchTerm = document.getElementById('search-input').value;
  ipcRenderer.send('search', searchTerm);
});

ipcRenderer.on('search-results', (event, results) => {
  const outputList = document.getElementById('output-list');
  outputList.innerHTML = '';

  results.forEach(result => {
    const li = document.createElement('li');
    li.textContent = result.name;
    outputList.appendChild(li);
  });
});

function navigateTo(page) {
  window.location.href = `${page}`;
}

function goBack() {
  window.history.back();
} 