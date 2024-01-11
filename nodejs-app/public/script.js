document.addEventListener('DOMContentLoaded', function() {
    fetch('/articles')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('articlesTable');
            data.articles.forEach(article => {
                const row = table.insertRow();
                row.insertCell().textContent = article.title;
                row.insertCell().textContent = article.author;
                row.insertCell().textContent = new Date(article.publishedAt).toLocaleDateString();
                row.insertCell().textContent = article.source.name;
                row.insertCell().innerHTML = `<a href="${article.url}" target="_blank">Lien</a>`;
            });
        })
        .catch(error => console.error('Erreur:', error));
});
