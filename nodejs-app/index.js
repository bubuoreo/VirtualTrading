// Declaration des différents const
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const yahooFinance = require('yahoo-finance2').default;
const cors = require('cors');
const app = express(); 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500',
    methods: ["GET", "POST"]
  }
});

// Ajoutez les options CORS pour autoriser les requêtes de votre client
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // ou '*' pour autoriser toutes les origines
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Ajout pour News
const axios = require('axios');
const port = 3000;

// Déclaration d'une route API dans l'application express qui récupère et renvoie les données 
// financières d'un actif spécifié (symbol) sur un intervalle de temps donné (timeframe),
// en utilisant les données de l'année précédente jusqu'à aujourd'hui.
app.get('/finance/:symbol/:timeframe', async (req, res) => {
    const { symbol, timeframe } = req.params;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    try {
      const result = await yahooFinance.chart(symbol, {
        period1: oneYearAgo.toISOString().split('T')[0], // Start Date one year ago
        interval: timeframe,  // Timeframe granularity passed as a parameter
      });
      res.json(result);
    } catch (error) {
      res.status(500).send("Error fetching data: " + error);
    }
  });

// Déclaration d'une route API dans une l'application express qui récupère et renvoie les données financières
// actuelles d'un actif spécifié (symbol), telles que le prix du marché et d'autres informations 
// pertinentes, en utilisant la méthode 'quote' du package yahoo-finance2.
app.get('/finance/:symbol/', async (req, res) => {
  const { symbol } = req.params;
  try {
      // Utilisez la méthode 'quote' pour obtenir les données actuelles de l'actif
      const quote = await yahooFinance.quote(symbol);
      res.json(quote);
  } catch (error) {
      res.status(500).send("Error fetching data: " + error);
  }
});


app.get('/finance7j/:symbol/', async (req, res) => {
  const { symbol} = req.params;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Définir la date à il y a 7 jours
  try {
    const result = await yahooFinance.chart(symbol, {
      period1: sevenDaysAgo.toISOString().split('T')[0], // Start Date 7 days ago
      interval: '1d',
    });
    res.json(result);
  } catch (error) {
    res.status(500).send("Error fetching data: " + error);
  }
});

// Modification pour utilisation des sockets

// Cette fonction récupère les données et les envoie via WebSocket
async function emitCryptoData(socket) {
  try {
    const symbols = ['BTC-USD','ETH-USD','CHZ-USD',]; // Exemple de symboles
    for (const symbol of symbols) {
      const data = await yahooFinance.quote(symbol);
      socket.emit('cryptoData', { symbol, data });
    }
  } catch (error) {
    console.error("Error fetching crypto data: ", error);
  }
}

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');
  emitCryptoData(socket);

  // Envoyer les données toutes les 30 secondes
  const intervalId = setInterval(() => emitCryptoData(socket), 30000);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    clearInterval(intervalId);
  });
});

// Ajout pour News
app.use(express.static('public')); // Pour servir des fichiers statiques comme HTML, CSS, JS

app.get('/articles', (req, res) => {
    const apiKey = '28969bda89aa4648827906d830743c8b';
    const q = 'crypto';
    const language = 'fr';
    const oldestDate = '2024-01-01';
    const apiUrl = `https://newsapi.org/v2/everything?q=${q}&from=${oldestDate}&sortBy=publishedAt&language=${language}&apiKey=${apiKey}`;

    axios.get(apiUrl)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            console.error('Erreur lors de la requête API :', error);
            res.status(500).send('Erreur serveur');
        });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
