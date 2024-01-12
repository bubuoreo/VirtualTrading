const SYMBOLS = ['BTC-USD', 'ETH-USD', 'CHZ-USD', 'WBNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'EGLD-USD'];
const HOME_FETCH_BASE_CODES = ["/finance7j/", "/finance/"];

const yahooFinance = require('yahoo-finance2').default;

class MainService {


    constructor() {
        this.fetchQueues = new Map();
        this.database = new Map();
        this.updateDatabase = this.updateDatabase.bind(this);
    }

    updateDatabase({ code, json }) {
        this.database.set(code, json);
    }

    async addUserToNotifPageQueues({ socketId, page }) {
        this.removeUserFromAllQueues({ userSocketId: socketId});
        var ret = [];
        switch (page) {
            case 'home':
                console.log('MainService: addUserToNotifPageQueues: Ajout à la queue de notification de la page \'home\'');
                for (const codeBase of HOME_FETCH_BASE_CODES) {
                    for (const symbol of SYMBOLS) {
                        console.log('MainService: addUserToNotifPageQueues: Vérification de l\'existance de la donnée dans la database');
                        const code = codeBase + symbol;
                        if (this.database.has(code)) {
                            console.log('MainService: addUserToNotifPageQueues: Le code est dans la Database');
                            const element = {
                                "dest": [socketId],
                                "code": code,
                                "data": this.database.get(code),
                            };
                            ret = [...ret, element];
                        } else {
                            const result = await this.apiRequest({ code });
                            const element = {
                                "dest": [socketId],
                                "code": code,
                                "data": result,
                            };
                            ret = [...ret, element];
                        }
                        if (this.fetchQueues.has(code)) {
                            const queue = this.fetchQueues.get(code);
                            this.fetchQueues.set(code, [...queue, socketId]);
                        } else {
                            this.fetchQueues.set(code, [socketId]);
                        }
                    }
                }
                break;
            
            default:
                console.log(`Sorry, we are out of ${expr}.`);
        }
        console.log("MainService: addUserToNotifPageQueues:");
        console.log([...this.fetchQueues.entries()]);
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
        console.log("MainService: apiRequestAllURLs:");
        console.log(this.database);
        console.log(ret);
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
            const timeframe = code.match(/\d\w*$/g);
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
        console.log(this.database);
    }
}

module.exports = MainService