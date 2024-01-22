const SYMBOLS = ['BTC-USD', 'ETH-USD', 'CHZ-USD', 'WBNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'EGLD-USD'];
const FINANCE_STR = "/finance/"
const FINANCE7J_STR = "/finance7j/"
const FINANCE_CHART_STR = "/financeChart/"
const HOME_FETCH_BASE_CODES = [FINANCE7J_STR, FINANCE_STR];
const SCENARIOS = [
    {
        "symbol": "BTC-USD",
        "from": new Date(2021, 3, 12),
        "to": new Date(2021, 11, 12),
        "granularity": "1mo"
    },
    {
        "symbol": "ETH-USD",
        "from": new Date(2017, 12, 3),
        "to": new Date(2018, 10, 3),
        "granularity": "1mo"
    },
    {
        "symbol": "CHZ-USD",
        "from": new Date(2018, 12, 15),
        "to": new Date(2020, 1, 15),
        "granularity": "1mo"
    }
]

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
        this.scenariosList = null;
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
        } else if (request === 'GAME') {
            let result;
            if (this.scenariosList) {
                result = this.scenariosList;
            } else {
                result = await this.initScenarios();
            }
            const element = {
                "dest": [socketId],
                "code": "/financeGame",
                "data": result,
            };
            ret = [element];
        } else if (request.match(/wallet/g)) {
            console.log(request);
            const symbols = request.match(/[A-Z]+-USD/g);
            if (symbols) {
                const codesList = symbols.map(item => FINANCE_STR + item);
                for (const code of codesList) {
                    const result = await this.retrieveCodeData({ code, socketId });
                    ret = [...ret, result];
                }
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
        let ret = [];
        let requestedCodes = [];
        for (const [code, queue] of this.fetchQueues.entries()) {
            var result = await this.apiRequest({ code });
            var element = {
                "dest": queue,
                "code": code,
                "data": result
            }
            ret = [...ret, element]
            requestedCodes = [...requestedCodes, code];
        }
        // Delete database entries if not update (data peremption)
        let nonRequestedCodes = Array.from(this.database.keys()).filter(code => !requestedCodes.includes(code));
        console.log("MainService: apiRequestAllCodes:");
        console.log(Array.from(this.database.keys()));
        console.log(nonRequestedCodes);
        this.deleteDatabaseKeys({keys: nonRequestedCodes})
        return ret;
    }

    async apiRequest({ code }) {
        const symbol = code.match(/[A-Z]*-[A-Z]*/g)[0]
        var result;
        if (code.startsWith("/finance/")) {
            try {
                result = await yahooFinance.quote(symbol);
                this.updateDatabase({ code: code, json: result });

            } catch (error) {
                throw new Error("Error fetching data: " + error);
            }
        }
        else if (code.startsWith("/finance7j/")) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            try {
                result = await yahooFinance.chart(symbol, {
                    period1: sevenDaysAgo.toISOString().split('T')[0],
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
                    period1: oneYearAgo.toISOString().split('T')[0],
                    interval: timeframe,
                });
                this.updateDatabase({ code: code, json: result });
            } catch (error) {
                throw new Error("Error fetching data: " + error);
            }
        }
        return result;
    }

    resetDatabase() {
        console.log("MainService: resetDatabase");
        this.database.clear();
    }

    deleteDatabaseKeys({keys}) {
        keys.forEach(code => {
            this.database.delete(code);
            console.log(`MainService: deleteDatabaseKeys: ${code} deleted from database`);
        });
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
            const titleWeight = 0.5;
            const contentWeight = 0.25;
            const descriptionWeight = 0.25;

            const weightedSentiment = (titleSentiment * titleWeight) + (contentSentiment * contentWeight) + (descriptionSentiment * descriptionWeight);

            totalSentiment += weightedSentiment;
            totalWeight += 1;
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

    async initScenarios() {
        let ret = [];
        for (let index = 0; index < SCENARIOS.length; index++) {
            const scenario = SCENARIOS[index];
            let result;
            const symbol = scenario.symbol;
            const from = scenario.from
            const to = scenario.to
            const granularity = scenario.granularity

            try {
                result = await yahooFinance.chart(symbol, {
                    period1: from.toISOString().split('T')[0],
                    period2: to.toISOString().split('T')[0],
                    interval: granularity,
                });
            } catch (error) {
                console.error(`Error fetching data for ${symbol}: ${error.message}`);
            }
            ret = [...ret, result];
        }
        return ret;
    }
}

module.exports = MainService