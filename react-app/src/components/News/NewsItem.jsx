import React, { useEffect, useState } from 'react';

const NewsItem = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3000/articles');
        const data = await response.json();
        setArticles(data.articles.slice(0, 4));
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexWrap: 'wrap' }}>
        {articles.map((article, index) => (
          <li
            key={index}
            style={{
              borderBottom: '1px solid #ddd',
              marginBottom: '10px',
              paddingBottom: '10px',
              flexBasis: 'calc(33.333% - 20px)',
              marginRight: index % 2 === 0 ? '20px' : '0',
              marginTop: index >= 2 ? '20px' : '0',
              boxSizing: 'border-box',
              maxWidth: '300px', // Ajustement de la taille maximale
            }}
          >
            <h3 style={{ margin: '0', fontSize: '16px' }}>{article.title}</h3>
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                style={{ width: '100%', height: 'auto', marginTop: '10px' }}
              />
            )}
            <p style={{ margin: '5px 0', fontSize: '14px' }}>Auteur: {article.author}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              Date de publication: {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>Source: {article.source.name}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              Lien: <a href={article.url} target="_blank" rel="noopener noreferrer">Lien vers l'article</a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsItem;
