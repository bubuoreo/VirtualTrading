const SYMBOLS = ['BTC-USD', 'ETH-USD', 'CHZ-USD', 'WBNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'EGLD-USD'];
const FINANCE_STR = "/finance/"
const FINANCE7J_STR = "/finance7j/"
const FINANCE_CHART_STR = "/financeChart/"
const HOME_FETCH_BASE_CODES = [FINANCE7J_STR, FINANCE_STR];

const yahooFinance = require('yahoo-finance2').default;
const natural = require('natural');
const SentimentAnalyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const sentimentAnalyzer = new SentimentAnalyzer('English', stemmer, 'afinn');

class MainService {


    constructor() {
        this.fetchQueues = new Map();
        this.database = new Map();
        this.updateDatabase = this.updateDatabase.bind(this);
        this.analyzeSentiment = this.analyzeSentiment.bind(this);
    }

    updateDatabase({ code, json }) {
        this.database.set(code, json);
    }

    async addUserToNotifPageQueues({ socketId, request }) {
        this.removeUserFromAllQueues({ userSocketId: socketId });
        var ret = [];

        if (request === 'HOME') {
            console.log('MainService: addUserToNotifPageQueues: Ajout à la queue de notification de la page \'home\'');
            for (const codeBase of HOME_FETCH_BASE_CODES) {
                for (const symbol of SYMBOLS) {
                    console.log('MainService: addUserToNotifPageQueues: Vérification de l\'existance de la donnée dans la database');
                    const code = codeBase + symbol;

                    const result = await this.retrieveCodeData({ code, socketId });
                    ret = [...ret, result];
                }
            }
        } else if (request.match(/wallet/g)) {
            console.log(request);
            const symbols = request.match(/[A-Z]+-USD/g);
            if (symbols) {
                const codesList = symbols.map(item => FINANCE_STR + item);
                for (const code of codesList) {
                    const result = await this.retrieveCodeData({ code, socketId });
                    ret = [...ret, result];
                }
                console.log(codesList);
            }
        } else if (request.match(/[A-Z]*-[A-Z]*/g)[0]) {
            console.log(`${request}`);
            const codesList = [FINANCE_STR + request, FINANCE_CHART_STR + request];
            for (const code of codesList) {

                const result = await this.retrieveCodeData({ code, socketId });
                ret = [...ret, result];
            }
        } else {
            console.log(`No reference found for: ${request}.`);
        }

        console.log("MainService: addUserToNotifPageQueues:");
        console.log([...this.fetchQueues.entries()]);
        return ret;
    }

    async retrieveCodeData({ code, socketId }) {
        var ret;
        if (this.database.has(code)) {
            console.log('MainService: retrieveCodeData: Le code est dans la Database');
            const element = {
                "dest": [socketId],
                "code": code,
                "data": this.database.get(code),
            };
            ret = element;
        } else {
            const result = await this.apiRequest({ code: code });
            const element = {
                "dest": [socketId],
                "code": code,
                "data": result,
            };
            ret = element;
        }

        if (this.fetchQueues.has(code)) {
            const queue = this.fetchQueues.get(code);
            this.fetchQueues.set(code, [...queue, socketId]);
        } else {
            this.fetchQueues.set(code, [socketId]);
        }

        return ret;
    }


    removeUserFromAllQueues({ userSocketId }) {
        for (const [url, queue] of this.fetchQueues.entries()) {
            const updatedQueue = queue.filter((socketId) => socketId !== userSocketId);
            if (updatedQueue.length === 0) {
                this.fetchQueues.delete(url);
            }
            else {
                this.fetchQueues.set(url, updatedQueue);
            }

        }
        console.log("MainService: removeUserFromAllQueues: fetchQueue");
        console.log([...this.fetchQueues.entries()]);
    }

    async apiRequestAllCodes() {
        var ret = [];
        for (const [code, queue] of this.fetchQueues.entries()) {
            var result = await this.apiRequest({ code });
            var element = {
                "dest": queue,
                "code": code,
                "data": result
            }
            ret = [...ret, element]
        }
        return ret;
    }

    async apiRequest({ code }) {
        const symbol = code.match(/[A-Z]*-[A-Z]*/g)[0]
        var result;
        if (code.startsWith("/finance/")) {
            try {
                // Utilisez la méthode 'quote' pour obtenir les données actuelles de l'actif
                result = await yahooFinance.quote(symbol);
                this.updateDatabase({ code: code, json: result });

            } catch (error) {
                throw new Error("Error fetching data: " + error);
            }
        }
        else if (code.startsWith("/finance7j/")) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Définir la date à il y a 7 jours
            try {
                result = await yahooFinance.chart(symbol, {
                    period1: sevenDaysAgo.toISOString().split('T')[0], // Start Date 7 days ago
                    interval: '1d',
                });
                this.updateDatabase({ code: code, json: result });

            } catch (error) {
                throw new Error("Error fetching data: " + error);
            }
        }
        else if (code.startsWith("/financeChart/")) {
            const timeframe = code.match(/\d\w*$/g)[0];
            console.log(timeframe);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            try {
                result = await yahooFinance.chart(symbol, {
                    period1: oneYearAgo.toISOString().split('T')[0], // Start Date one year ago
                    interval: timeframe,  // Timeframe granularity passed as a parameter
                });
                this.updateDatabase({ code: code, json: result });
            } catch (error) {
                throw new Error("Error fetching data: " + error);
            }
        }
        return result;
    }

    resetDatabase() {
        console.log("MainService: resetDatabase: On réinitialise la Database");
        this.database.clear();
    }

    analyzeSentiment({ articles }) {
        var ret;
        let totalSentiment = 0;
        let totalWeight = 0;

        articles.forEach(article => {
            let titleSentiment = 0;
            let contentSentiment = 0;
            let descriptionSentiment = 0;

            if (article.title) {
                titleSentiment = sentimentAnalyzer.getSentiment(article.title.split(' '));
            }

            if (article.content) {
                contentSentiment = sentimentAnalyzer.getSentiment(article.content.split(' '));
            }

            if (article.description) {
                descriptionSentiment = sentimentAnalyzer.getSentiment(article.description.split(' '));
            }

            // Définir des poids pour chaque partie de l'article
            const titleWeight = 0.5;  // Poids pour le titre
            const contentWeight = 0.25;  // Poids pour le contenu
            const descriptionWeight = 0.25;  // Poids pour la description

            // Calculer le score pondéré de l'article
            const weightedSentiment = (titleSentiment * titleWeight) + (contentSentiment * contentWeight) + (descriptionSentiment * descriptionWeight);

            totalSentiment += weightedSentiment;
            totalWeight += 1;  // Vous pouvez ajuster cela en fonction de votre propre logique de pondération.
        });

        if (totalWeight > 0) {
            const averageSentiment = totalSentiment / totalWeight;
            ret = averageSentiment
            console.log(`Moyenne pondérée du sentiment du marché: ${averageSentiment}`);
        } else {
            console.log("Aucun article trouvé pour l'analyse.");
        }
        return ret;
    }
}

module.exports = MainService