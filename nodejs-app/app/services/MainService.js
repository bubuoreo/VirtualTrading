const SYMBOLS = ['BTC-USD','ETH-USD','CHZ-USD'];
const HOME_FETCH_BASE_URLS = ["/finance7j/", "/finance/"];

class MainService {


    constructor() {
        this.fetchQueues = new Map()
    }

    addUserToNotifPageQueues({socketId, page }) {
        switch (page) {
            case 'home':
                console.log('Ajout à la queue de notification de la page \'home\'');
                HOME_FETCH_BASE_URLS.forEach(urlBase => {
                    SYMBOLS.forEach(symbol => {
                        var url = urlBase + symbol
                        if (this.fetchQueues.has(url)) {
                            var queue = this.fetchQueues.get(url)
                            queue = [...queue, socketId]
                            this.fetchQueues.set(url, queue);
                        } else {
                            this.fetchQueues.set(url, [socketId]);
                        }
                    });
                });
                break;
            case 'Mangoes':
            case 'Papayas':
                console.log('Mangoes and papayas are $2.79 a pound.');
                // Expected output: "Mangoes and papayas are $2.79 a pound."
                break;
            default:
                console.log(`Sorry, we are out of ${expr}.`);
        }
        console.log(this.fetchQueues.entries());
    }

    removeUserFromAllQueues({ userSocketId }) {
        console.log(userSocketId);
        for (const [url, queue] of this.fetchQueues.entries()) {
            const updatedQueue = queue.filter((socketId) => socketId !== userSocketId);
            this.fetchQueues.set(url, updatedQueue);
        }
        console.log([...this.fetchQueues.entries()]);
    }
}

module.exports = MainService