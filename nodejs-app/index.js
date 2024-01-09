// Declaration des différents const
const express = require('express');
const yahooFinance = require('yahoo-finance2').default;
const cors = require('cors');
const app = express();
app.use(cors());  // Enable CORS

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


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
